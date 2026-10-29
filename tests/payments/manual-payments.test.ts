import { beforeEach, describe, expect, it, vi } from "vitest";
import "./stubs/deno-env.ts";
import { createClient, useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import { chaseManualPayments } from "../../supabase/functions/_shared/manual-payments.ts";
import { PLAN_PRICING, priceSelection } from "../../supabase/functions/_shared/pricing.ts";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

const PLAN = "developer-pro";
const COURSES = PLAN_PRICING[PLAN].courses.map((c) => c.id);
const priced = priceSelection(PLAN, COURSES, [], null);
const FULL_PRICE = priced.ok ? priced.total : NaN;

let db: FakeDb;
let fetchMock: ReturnType<typeof vi.fn>;
/** Flutterwave's verify answer per tx_ref. */
let flutterwave: Record<string, Record<string, unknown>>;
let linkFails: boolean;

const request = (id: string, createdAt: string, over: Record<string, unknown> = {}) => ({
  id,
  faculty_id: "TF001",
  plan_name: "Developer Pro",
  status: "pending",
  tx_ref: null,
  created_at: createdAt,
  requested_selection: { planId: PLAN, courseIds: COURSES, benefitIds: [], learningModeId: null, currency: "NGN" },
  ...over,
});
const row = (id: string) => db.tables.enrollments.find((r) => r.id === id)!;
const calls = (part: string) => fetchMock.mock.calls.filter(([url]) => String(url).includes(part));
const run = () => chaseManualPayments(createClient() as never, "FLWSECK_TEST-key");

beforeEach(() => {
  db = { users: {}, tables: { enrollments: [], admin_audit_log: [], referrals: [], profiles: [{ id: "user-1", faculty_id: "TF001" }] } };
  useFakeDb(db);
  flutterwave = {};
  linkFails = false;
  fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith("/v3/payments")) {
      const body = JSON.parse(String(init?.body));
      return linkFails
        ? Response.json({ status: "error", message: "down" }, { status: 502 })
        : Response.json({ status: "success", data: { link: `https://checkout.flutterwave.com/pay/${body.tx_ref}` } });
    }
    if (url.endsWith("/link/disable")) return Response.json({ status: "success" });
    const txRef = new URL(url).searchParams.get("tx_ref")!;
    const data = flutterwave[txRef];
    return Response.json(data ? { status: "success", data } : { status: "error" }, { status: data ? 200 : 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
});

describe("chasing WhatsApp and bank requests", () => {
  it("makes a pay link at the catalogue price an hour after the request", async () => {
    db.tables.enrollments.push(request("a", ago(2 * HOUR)));

    expect(await run()).toMatchObject({ linksCreated: 1, linksSkipped: 0 });
    const a = row("a");
    expect(a).toMatchObject({ status: "pending", amount_due: FULL_PRICE, currency: "NGN" });
    expect(String(a.tx_ref)).toMatch(/^TF-TF001-/);
    expect(a.pay_link_url).toBe(`https://checkout.flutterwave.com/pay/${a.tx_ref}`);
    expect(typeof a.pay_link_created_at).toBe("string");

    const sent = JSON.parse(String(calls("/v3/payments")[0][1].body));
    expect(sent).toMatchObject({ tx_ref: a.tx_ref, amount: FULL_PRICE, currency: "NGN" });
    expect(sent.link_expiration).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/);
    expect(db.tables.admin_audit_log).toEqual([
      expect.objectContaining({ action: "payment.pay_link_created", actor_email: "automation", target_id: "a" }),
    ]);
  });

  it("applies a promo code and charges dollars when asked", async () => {
    db.tables.enrollments.push(
      request("promo", ago(2 * HOUR), { requested_selection: { planId: PLAN, courseIds: COURSES, currency: "USD", discountCode: "techup50" } }),
    );
    await run();
    expect(row("promo")).toMatchObject({ currency: "USD", amount_due: Math.round((FULL_PRICE / 2 / 1400) * 100) / 100 });
  });

  it("applies a referral code and records the referral against the link", async () => {
    db.rpc = { check_referral_code: () => ({ ok: true, code: "ADA10", referrer_user_id: "grad-1" }) };
    db.tables.enrollments.push(
      request("ref", ago(2 * HOUR), { requested_selection: { planId: PLAN, courseIds: COURSES, discountCode: "ADA10" } }),
    );
    await run();
    const discount = Math.round(FULL_PRICE / 10);
    expect(row("ref").amount_due).toBe(FULL_PRICE - discount);
    expect(db.tables.referrals).toEqual([
      expect.objectContaining({ code: "ADA10", referred_user_id: "user-1", tx_ref: row("ref").tx_ref, discount_amount: discount }),
    ]);
  });

  it("leaves requests an admin should price, and says why", async () => {
    db.tables.enrollments.push(
      request("asked", ago(2 * HOUR), { requested_selection: { planId: PLAN, courseIds: COURSES, discountRequested: true } }),
      request("unknown", ago(2 * HOUR), { requested_selection: { planId: "no-such-plan" } }),
    );
    expect(await run()).toMatchObject({ linksCreated: 0, linksSkipped: 2 });
    expect(row("asked")).toMatchObject({ tx_ref: null, pay_link_skipped_reason: "Asked for a discount code" });
    expect(row("unknown")).toMatchObject({ tx_ref: null, pay_link_skipped_reason: "Unknown plan" });
    expect(calls("/v3/payments")).toHaveLength(0);

    // Not priced again on the next run.
    await run();
    expect(calls("/v3/payments")).toHaveLength(0);
  });

  it("skips fresh requests, requests saved without a selection, and card checkouts", async () => {
    db.tables.enrollments.push(
      request("fresh", ago(20 * 60 * 1000)),
      request("old-style", ago(2 * HOUR), { requested_selection: null }),
      request("card", ago(2 * HOUR), { tx_ref: "TF-TF001-card", amount_due: 1000 }),
      request("stale", ago(5 * DAY)),
    );
    expect(await run()).toMatchObject({ linksCreated: 0, linksSkipped: 0 });
    expect(calls("/v3/payments")).toHaveLength(0);
  });

  it("frees the request to try again when Flutterwave can't make a link", async () => {
    linkFails = true;
    db.tables.enrollments.push(request("a", ago(2 * HOUR)));
    expect(await run()).toMatchObject({ linksCreated: 0 });
    expect(row("a")).toMatchObject({ status: "pending", tx_ref: null, amount_due: null });
    expect(row("a").pay_link_url).toBeUndefined();
  });

  it("cancels a request still unpaid 14 days after its link, and switches the link off", async () => {
    db.tables.enrollments.push(
      request("late", ago(15 * DAY), { tx_ref: "TF-TF001-late", amount_due: 1000, currency: "NGN", pay_link_url: "https://flw/late", pay_link_created_at: ago(14 * DAY + HOUR) }),
      request("recent", ago(3 * DAY), { tx_ref: "TF-TF001-recent", amount_due: 1000, currency: "NGN", pay_link_url: "https://flw/recent", pay_link_created_at: ago(3 * DAY) }),
    );
    expect(await run()).toMatchObject({ cancelled: 1 });
    expect(row("late")).toMatchObject({ status: "cancelled" });
    expect(typeof row("late").auto_cancelled_at).toBe("string");
    expect(typeof row("late").pay_link_disabled_at).toBe("string");
    expect(row("recent")).toMatchObject({ status: "pending" });
    expect(db.tables.admin_audit_log).toEqual([
      expect.objectContaining({ action: "enrollment.auto_cancelled", actor_email: "automation", target_id: "late" }),
    ]);
  });

  it("activates instead of cancelling when the link was paid after the last check", async () => {
    db.tables.enrollments.push(
      request("paid", ago(15 * DAY), { tx_ref: "TF-TF001-paid", amount_due: 1000, currency: "NGN", pay_link_url: "https://flw/paid", pay_link_created_at: ago(14 * DAY + HOUR) }),
    );
    flutterwave["TF-TF001-paid"] = { id: 9, tx_ref: "TF-TF001-paid", status: "successful", amount: 1000, currency: "NGN" };
    expect(await run()).toMatchObject({ cancelled: 0, oldLinksPaid: 1 });
    expect(row("paid")).toMatchObject({ status: "active", payment_reference: "9" });
    expect(typeof row("paid").recovered_at).toBe("string");
  });

  it("switches off the link once an admin marks the plan paid", async () => {
    db.tables.enrollments.push(
      request("marked", ago(2 * DAY), { status: "active", tx_ref: "TF-TF001-marked", pay_link_url: "https://flw/marked", pay_link_created_at: ago(2 * DAY) }),
    );
    expect(await run()).toMatchObject({ linksDisabled: 1 });
    expect(calls("/link/disable")).toHaveLength(1);
    expect(typeof row("marked").pay_link_disabled_at).toBe("string");
    await run();
    expect(calls("/link/disable")).toHaveLength(1);
  });
});
