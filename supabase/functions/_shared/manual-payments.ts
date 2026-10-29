// Chases plans requested over WhatsApp or email (to pay by bank transfer) that
// are still unpaid. recover-checkouts runs this every 30 minutes:
// 1. An hour after the request, prices what the student chose (from the shared
//    catalogue, never from the request) and gets a Flutterwave pay link for it.
//    The site emails the link, and a reminder two days later
//    (src/lib/pay-link-followups.server.ts).
// 2. Payments on those links are confirmed like any card checkout (confirmPayment),
//    including links older than the week recover-checkouts' own check covers.
// 3. 14 days after the link, a plan still unpaid is cancelled and its link disabled.
// 4. Once a plan is settled another way (an admin marks it paid or cancels it),
//    its link is disabled so the student can't pay twice.
// Requests an admin should price themselves (a discount was asked for, an
// unknown plan or course) are marked with pay_link_skipped_reason and left alone.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { confirmPayment } from "./flutterwave.ts";
import { PLAN_NAMES, PROMO_CODES, REFERRAL_DISCOUNT_PERCENT, REFERRER_REWARD_PERCENT, priceSelection } from "./pricing.ts";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
// Give an admin an hour to answer on WhatsApp first.
export const LINK_AFTER = 60 * MINUTE;
// Requests older than this when the chase starts are left to an admin.
const LINK_UNTIL = 3 * DAY;
export const CANCEL_AFTER = 14 * DAY;
// recover-checkouts itself re-checks pending payments for a week after the request.
const OWN_CHECK_FOR = 7 * DAY;

/** What the pricing page saves with a WhatsApp or email request. */
export type RequestedSelection = {
  planId?: string;
  courseIds?: string[];
  benefitIds?: string[];
  learningModeId?: string | null;
  currency?: string;
  discountCode?: string | null;
  discountRequested?: boolean;
};

type Request = {
  id: string;
  faculty_id: string;
  plan_name: string;
  requested_selection: RequestedSelection | null;
};

const toCharge = (currency: string, ngn: number) => (currency === "USD" ? Math.round((ngn / 1400) * 100) / 100 : ngn);

type Priced =
  | { ok: true; amount: number; currency: "NGN" | "USD"; description: string; referral: { code: string; referrerUserId: string; userId: string; discount: number; reward: number } | null }
  | { ok: false; reason: string };

/** The same price create-checkout would charge for this selection, paid in full. */
export async function priceRequest(admin: SupabaseClient, request: Request): Promise<Priced> {
  const sel = request.requested_selection ?? {};
  if (sel.discountRequested) return { ok: false, reason: "Asked for a discount code" };
  const planId = String(sel.planId ?? "");
  if (!PLAN_NAMES[planId]) return { ok: false, reason: "Unknown plan" };
  const priced = priceSelection(planId, (sel.courseIds ?? []).map(String), (sel.benefitIds ?? []).map(String), sel.learningModeId ? String(sel.learningModeId) : null);
  if (!priced.ok) return { ok: false, reason: priced.error };
  let total = priced.total;
  if (total <= 0) return { ok: false, reason: "Nothing to pay" };

  const currency = String(sel.currency ?? "NGN").toUpperCase() === "USD" ? "USD" : "NGN";
  const code = sel.discountCode ? String(sel.discountCode).trim().toUpperCase() : "";
  let referral: Extract<Priced, { ok: true }>["referral"] = null;
  if (code && PROMO_CODES[code]) {
    total = Math.round((total * (100 - PROMO_CODES[code])) / 100);
  } else if (code) {
    const { data: profile } = await admin.from("profiles").select("id").eq("faculty_id", request.faculty_id).maybeSingle();
    if (!profile?.id) return { ok: false, reason: "No student account for this Faculty ID" };
    const { data: check, error } = await admin.rpc("check_referral_code", { _code: code, _user_id: profile.id });
    if (error) throw error;
    const result = check as { ok: boolean; code?: string; referrer_user_id?: string } | null;
    if (!result?.ok || !result.code || !result.referrer_user_id) return { ok: false, reason: `Discount code ${code} isn't valid for this student` };
    const discount = Math.round((total * REFERRAL_DISCOUNT_PERCENT) / 100);
    total -= discount;
    referral = {
      code: result.code,
      referrerUserId: result.referrer_user_id,
      userId: profile.id,
      discount,
      reward: Math.round((total * REFERRER_REWARD_PERCENT) / 100),
    };
  }

  const items = [...priced.courses.map((c) => c.name), ...(priced.learningMode?.name ? [`Mode: ${priced.learningMode.name}`] : [])];
  return {
    ok: true,
    amount: toCharge(currency, total),
    currency,
    description: `${request.plan_name} Plan — ${items.join(", ")}`.slice(0, 250),
    referral: referral && { ...referral, discount: toCharge(currency, referral.discount), reward: toCharge(currency, referral.reward) },
  };
}

async function flutterwaveLink(secretKey: string, payload: Record<string, unknown>): Promise<string | null> {
  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.status !== "success" || !body?.data?.link) {
    console.error("manual-payments: Flutterwave link failed", { status: res.status, message: body?.message });
    return null;
  }
  return String(body.data.link);
}

async function disableLink(secretKey: string, link: string) {
  const res = await fetch("https://api.flutterwave.com/v3/payments/link/disable", {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ link }),
  });
  const body = await res.json().catch(() => null);
  // Already used or already inactive links can't be disabled again; that is fine.
  return res.ok || /inactive|invalid/i.test(String(body?.message ?? ""));
}

async function logAutomation(admin: SupabaseClient, entry: { action: string; target_id: string; faculty_id: string; details: Record<string, unknown> }) {
  const { error } = await admin.from("admin_audit_log").insert({ ...entry, actor_email: "automation", target_table: "enrollments" });
  if (error) console.error("manual-payments: audit log failed", error);
}

async function createLinks(admin: SupabaseClient, secretKey: string, now: number) {
  const { data: due, error } = await admin
    .from("enrollments")
    .select("id, faculty_id, plan_name, requested_selection")
    .eq("status", "pending")
    .is("tx_ref", null)
    .is("pay_link_skipped_reason", null)
    .not("requested_selection", "is", null)
    .lte("created_at", new Date(now - LINK_AFTER).toISOString())
    .gte("created_at", new Date(now - LINK_UNTIL).toISOString())
    .limit(50);
  if (error) throw error;

  let created = 0;
  let skipped = 0;
  for (const request of (due ?? []) as Request[]) {
    const priced = await priceRequest(admin, request);
    if (!priced.ok) {
      await admin.from("enrollments").update({ pay_link_skipped_reason: priced.reason }).eq("id", request.id).is("tx_ref", null);
      skipped++;
      continue;
    }

    // Claim the request with its payment reference before asking Flutterwave.
    const txRef = `TF-${request.faculty_id}-${crypto.randomUUID()}`;
    const { data: claimed } = await admin
      .from("enrollments")
      .update({ tx_ref: txRef, amount_due: priced.amount, currency: priced.currency })
      .eq("id", request.id)
      .eq("status", "pending")
      .is("tx_ref", null)
      .select("id")
      .maybeSingle();
    if (!claimed) continue;
    const release = () =>
      admin.from("enrollments").update({ tx_ref: null, amount_due: null, currency: null }).eq("id", request.id).eq("tx_ref", txRef).eq("status", "pending");

    if (priced.referral) {
      const { error: referralErr } = await admin.from("referrals").insert({
        code: priced.referral.code,
        referrer_user_id: priced.referral.referrerUserId,
        referred_user_id: priced.referral.userId,
        tx_ref: txRef,
        currency: priced.currency,
        discount_amount: priced.referral.discount,
        reward_amount: priced.referral.reward,
      });
      if (referralErr) {
        console.error("manual-payments: referral save failed", referralErr);
        await release();
        continue;
      }
    }

    const link = await flutterwaveLink(secretKey, {
      tx_ref: txRef,
      amount: priced.amount,
      currency: priced.currency,
      redirect_url: `https://techfaculty.ng/payment-success?tx_ref=${encodeURIComponent(txRef)}&faculty_id=${encodeURIComponent(request.faculty_id)}&plan=${encodeURIComponent(request.plan_name)}`,
      meta: { faculty_id: request.faculty_id, plan_name: request.plan_name, requested_enrollment: request.id },
      customer: { email: `${request.faculty_id}@techfaculty.ng` },
      customizations: { title: "Tech Faculty", description: priced.description, logo: "https://techfaculty.ng/favicon.png" },
      // The link stops working when the request is cancelled for non-payment.
      link_expiration: new Date(now + CANCEL_AFTER + DAY).toISOString().slice(0, 19),
    });
    if (!link) {
      if (priced.referral) await admin.from("referrals").delete().eq("tx_ref", txRef).eq("status", "pending");
      await release();
      continue;
    }
    await admin.from("enrollments").update({ pay_link_url: link, pay_link_created_at: new Date(now).toISOString() }).eq("id", request.id);
    await logAutomation(admin, {
      action: "payment.pay_link_created",
      target_id: request.id,
      faculty_id: request.faculty_id,
      details: { plan: request.plan_name, amount: priced.amount, currency: priced.currency },
    });
    created++;
  }
  return { created, skipped };
}

/** Links older than recover-checkouts' own week of checks; it covers the rest. */
async function checkOldLinks(admin: SupabaseClient, secretKey: string, now: number) {
  const { data: rows, error } = await admin
    .from("enrollments")
    .select("tx_ref")
    .eq("status", "pending")
    .not("pay_link_created_at", "is", null)
    .lte("created_at", new Date(now - OWN_CHECK_FOR).toISOString())
    .limit(100);
  if (error) throw error;
  let paid = 0;
  for (const { tx_ref } of rows ?? []) {
    try {
      const result = await confirmPayment(admin, secretKey, tx_ref, { recovered_at: new Date().toISOString() });
      if (result.status === "active") paid++;
    } catch (e) {
      console.error("manual-payments: could not check", tx_ref, e);
    }
  }
  return paid;
}

async function cancelExpired(admin: SupabaseClient, secretKey: string, now: number) {
  const { data: rows, error } = await admin
    .from("enrollments")
    .select("id, faculty_id, plan_name, tx_ref, amount_due, currency, pay_link_url")
    .eq("status", "pending")
    .not("pay_link_created_at", "is", null)
    .lte("pay_link_created_at", new Date(now - CANCEL_AFTER).toISOString())
    .limit(100);
  if (error) throw error;

  let cancelled = 0;
  for (const row of rows ?? []) {
    // One last look, in case it was paid since the last check.
    const result = await confirmPayment(admin, secretKey, row.tx_ref, { recovered_at: new Date().toISOString() }).catch(() => null);
    if (result?.status === "active") continue;
    const disabled = row.pay_link_url ? await disableLink(secretKey, row.pay_link_url) : true;
    const { data: done } = await admin
      .from("enrollments")
      .update({
        status: "cancelled",
        auto_cancelled_at: new Date().toISOString(),
        ...(disabled ? { pay_link_disabled_at: new Date().toISOString() } : {}),
      })
      .eq("id", row.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
    if (!done) continue;
    await logAutomation(admin, {
      action: "enrollment.auto_cancelled",
      target_id: row.id,
      faculty_id: row.faculty_id,
      details: { from: "pending", to: "cancelled", plan: row.plan_name, amount: row.amount_due, currency: row.currency, reason: "Unpaid 14 days after the pay link" },
    });
    cancelled++;
  }
  return cancelled;
}

/** Plans settled another way (marked paid or cancelled by an admin): their unused links are switched off. */
async function disableSettledLinks(admin: SupabaseClient, secretKey: string) {
  const { data: rows, error } = await admin
    .from("enrollments")
    .select("id, pay_link_url")
    .in("status", ["active", "confirmed", "cancelled"])
    .not("pay_link_url", "is", null)
    .is("pay_link_disabled_at", null)
    .limit(100);
  if (error) throw error;
  let disabled = 0;
  for (const row of rows ?? []) {
    if (!(await disableLink(secretKey, row.pay_link_url))) continue;
    await admin.from("enrollments").update({ pay_link_disabled_at: new Date().toISOString() }).eq("id", row.id);
    disabled++;
  }
  return disabled;
}

export async function chaseManualPayments(admin: SupabaseClient, secretKey: string, now = Date.now()) {
  const links = await createLinks(admin, secretKey, now);
  const oldLinksPaid = await checkOldLinks(admin, secretKey, now);
  const cancelled = await cancelExpired(admin, secretKey, now);
  const linksDisabled = await disableSettledLinks(admin, secretKey);
  return { linksCreated: links.created, linksSkipped: links.skipped, oldLinksPaid, cancelled, linksDisabled };
}
