import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  PLAN_NAMES,
  PROMO_CODES,
  REFERRAL_DISCOUNT_PERCENT,
  REFERRER_REWARD_PERCENT,
  INSTALMENTS,
  instalmentSplit,
  priceSelection,
} from "../_shared/pricing.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const toCharge = (currency: string, ngn: number) =>
  currency === 'USD' ? Math.round(ngn / 1400 * 100) / 100 : ngn;

const isoDateInDays = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

/** Asks Flutterwave for a payment link; `onFail` undoes what was saved for it. */
async function paymentLink(
  flutterwaveKey: string,
  payload: Record<string, unknown>,
  onFail: () => PromiseLike<unknown>,
): Promise<Response> {
  const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${flutterwaveKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const rawResponse = await flwResponse.text();
  let flwData: { status?: string; message?: string; data?: { link?: string } } | null = null;

  try {
    flwData = rawResponse ? JSON.parse(rawResponse) : null;
  } catch {
    console.error('Flutterwave returned non-JSON response', {
      status: flwResponse.status,
      contentType: flwResponse.headers.get('content-type'),
      bodyPreview: rawResponse.slice(0, 300),
    });
    await onFail();

    return jsonResponse(
      { error: 'Payment provider returned an unexpected response. Please try again or use WhatsApp or Email enrollment.' },
      502,
    );
  }

  if (!flwResponse.ok || flwData?.status !== 'success' || !flwData?.data?.link) {
    console.error('Flutterwave error:', {
      status: flwResponse.status,
      data: flwData,
    });
    await onFail();

    return jsonResponse(
      { error: flwData?.message || 'Failed to create payment link' },
      flwResponse.ok ? 500 : 502,
    );
  }

  return jsonResponse({ url: flwData.data.link });
}

type BalancePlan = { id: string; faculty_id: string; plan_name: string; status: string; balance_due: number | null; currency: string | null };

/** A Flutterwave checkout for what is left to pay on an instalment plan. */
async function balanceCheckout(
  admin: ReturnType<typeof createClient>,
  flutterwaveKey: string,
  enrollment: BalancePlan,
  successUrl: string,
): Promise<Response> {
  if (!['active', 'confirmed'].includes(enrollment.status) || !(Number(enrollment.balance_due) > 0)) {
    return jsonResponse({ error: 'Nothing is left to pay on this plan' }, 400);
  }
  const balanceTxRef = `TFB-${enrollment.faculty_id}-${crypto.randomUUID()}`;
  const balanceCurrency = enrollment.currency === 'USD' ? 'USD' : 'NGN';
  const { error: paymentErr } = await admin.from('enrollment_payments').insert({
    enrollment_id: enrollment.id,
    tx_ref: balanceTxRef,
    amount: Number(enrollment.balance_due),
    currency: balanceCurrency,
    status: 'pending',
  });
  if (paymentErr) {
    console.error('Failed to save balance payment:', paymentErr);
    return jsonResponse({ error: 'Could not start your payment. Please try again.' }, 500);
  }
  return await paymentLink(flutterwaveKey, {
    tx_ref: balanceTxRef,
    amount: Number(enrollment.balance_due),
    currency: balanceCurrency,
    redirect_url: `${successUrl}?tx_ref=${encodeURIComponent(balanceTxRef)}&faculty_id=${encodeURIComponent(enrollment.faculty_id)}&plan=${encodeURIComponent(enrollment.plan_name)}`,
    meta: { faculty_id: enrollment.faculty_id, plan_name: enrollment.plan_name, balance_for: enrollment.id },
    customer: { email: `${enrollment.faculty_id}@techfaculty.ng` },
    customizations: {
      title: 'Tech Faculty',
      description: `${enrollment.plan_name} — balance`,
      logo: 'https://techfaculty.ng/favicon.png',
    },
  }, () => admin.from('enrollment_payments').delete().eq('tx_ref', balanceTxRef).eq('status', 'pending'));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const flutterwaveKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    if (!flutterwaveKey) {
      return jsonResponse({ error: 'Flutterwave is not configured yet. Please add your Flutterwave secret key.' }, 500);
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
      auth: { persistSession: false },
    });
    const body = await req.json();

    // The pay link in a balance reminder email: the token stands in for
    // signing in, and only lets the holder pay that plan's balance.
    if (body.balancePayToken) {
      const { data: reminder } = await admin
        .from('balance_reminders')
        .select('enrollment_id')
        .eq('pay_token', String(body.balancePayToken))
        .maybeSingle();
      const { data: enrollment } = reminder
        ? await admin
          .from('enrollments')
          .select('id, faculty_id, plan_name, status, balance_due, currency')
          .eq('id', reminder.enrollment_id)
          .maybeSingle()
        : { data: null };
      if (!enrollment) {
        return jsonResponse({ error: 'This payment link is not valid. Sign in to pay from your dashboard.' }, 404);
      }
      const site = Deno.env.get('SITE_URL') ?? 'https://techfaculty.ng';
      return await balanceCheckout(admin, flutterwaveKey, enrollment, `${site}/payment-success`);
    }

    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) {
      return jsonResponse({ error: 'Please sign in to pay' }, 401);
    }

    const {
      planId,
      planName,
      facultyId,
      courseIds,
      benefitIds,
      learningModeId,
      currencyCode: rawCurrencyCode,
      discountCode,
      successUrl,
      payInInstalments,
    } = body;

    const currencyCode = (rawCurrencyCode || 'NGN').toUpperCase();

    // The enrolment is created for the signed-in student only.
    const { data: profile } = await admin.from('profiles').select('faculty_id').eq('id', user.id).maybeSingle();

    // Paying the rest of an instalment plan the student already started.
    if (body.balanceForEnrollmentId) {
      const { data: enrollment } = await admin
        .from('enrollments')
        .select('id, faculty_id, plan_name, status, balance_due, currency')
        .eq('id', String(body.balanceForEnrollmentId))
        .eq('faculty_id', profile?.faculty_id ?? '')
        .maybeSingle();
      if (!enrollment) {
        return jsonResponse({ error: 'This enrolment is not yours' }, 403);
      }
      return await balanceCheckout(admin, flutterwaveKey, enrollment, successUrl);
    }

    if (!profile?.faculty_id || profile.faculty_id !== facultyId) {
      return jsonResponse({ error: 'This Faculty ID is not yours' }, 403);
    }
    const planNameForEnrollment = PLAN_NAMES[String(planId ?? '')];
    if (!planNameForEnrollment) {
      return jsonResponse({ error: 'Unknown plan' }, 400);
    }

    // Prices come from the shared catalogue, never from the request.
    const priced = priceSelection(
      String(planId ?? ''),
      Array.isArray(courseIds) ? courseIds.map(String) : [],
      Array.isArray(benefitIds) ? benefitIds.map(String) : [],
      learningModeId ? String(learningModeId) : null,
    );
    if (!priced.ok) {
      return jsonResponse({ error: priced.error }, 400);
    }
    const { courses, benefits, learningMode } = priced;
    let totalAmount = priced.total;

    if (totalAmount <= 0) {
      return jsonResponse({ error: 'No items selected for checkout' }, 400);
    }

    // Discounts are worked out here too, never taken from the request.
    const code = discountCode ? String(discountCode).trim().toUpperCase() : '';
    let referral: { code: string; referrerUserId: string; discount: number; reward: number } | null = null;
    if (code && PROMO_CODES[code]) {
      totalAmount = Math.round(totalAmount * (100 - PROMO_CODES[code]) / 100);
    } else if (code) {
      // Anything else must be a graduate's referral code this student may use.
      const { data: check, error: checkErr } = await admin.rpc('check_referral_code', { _code: code, _user_id: user.id });
      if (checkErr) {
        console.error('Referral check failed:', checkErr);
        return jsonResponse({ error: 'Could not check your discount code. Please try again.' }, 500);
      }
      const result = check as { ok: boolean; error?: string; code?: string; referrer_user_id?: string };
      if (!result?.ok || !result.code || !result.referrer_user_id) {
        return jsonResponse({ error: result?.error || 'That discount code isn\'t valid.' }, 400);
      }
      const discount = Math.round(totalAmount * REFERRAL_DISCOUNT_PERCENT / 100);
      totalAmount -= discount;
      referral = {
        code: result.code,
        referrerUserId: result.referrer_user_id,
        discount,
        reward: Math.round(totalAmount * REFERRER_REWARD_PERCENT / 100),
      };
    }

    const toChargeCurrency = (ngn: number) => toCharge(currencyCode, ngn);

    // Paying in instalments charges the deposit now and records the rest as
    // the balance, which the student pays later from their dashboard.
    const split = payInInstalments ? instalmentSplit(totalAmount) : null;
    if (payInInstalments && !split) {
      return jsonResponse({ error: 'This plan can\'t be paid in instalments. Please pay in full.' }, 400);
    }
    const amount = toChargeCurrency(split ? split.deposit : totalAmount);
    const instalment = split
      ? {
          instalment_total: toChargeCurrency(totalAmount),
          balance_due: Math.round((toChargeCurrency(totalAmount) - amount) * 100) / 100,
          balance_due_by: isoDateInDays(INSTALMENTS.balanceDueDays),
        }
      : {};

    const itemNames: string[] = [];
    courses.forEach((c) => itemNames.push(c.name));
    if (learningMode?.name) itemNames.push(`Mode: ${learningMode.name}`);
    benefits.forEach((b) => { if (b.price > 0) itemNames.push(b.name); });

    const txRef = `TF-${facultyId}-${crypto.randomUUID()}`;
    const currency = currencyCode === 'USD' ? 'USD' : 'NGN';

    // Saved as pending with the amount due. Only a payment Flutterwave
    // verifies for this amount activates it (flutterwave-webhook / verify-payment).
    const { error: enrollErr } = await admin.from('enrollments').insert({
      faculty_id: facultyId,
      plan_name: planNameForEnrollment,
      status: 'pending',
      learning_mode: learningMode?.name ?? 'online-only',
      coupon_code: code || null,
      tx_ref: txRef,
      amount_due: amount,
      currency,
      ...instalment,
    });
    if (enrollErr) {
      console.error('Failed to save pending enrolment:', enrollErr);
      return jsonResponse({ error: 'Could not start your enrolment. Please try again.' }, 500);
    }

    const dropPending = () => admin.from('enrollments').delete().eq('tx_ref', txRef).eq('status', 'pending');

    // Recorded against this checkout; it counts once Flutterwave confirms the
    // payment, and is removed with the checkout if it never gets that far.
    if (referral) {
      const { error: referralErr } = await admin.from('referrals').insert({
        code: referral.code,
        referrer_user_id: referral.referrerUserId,
        referred_user_id: user.id,
        tx_ref: txRef,
        currency,
        discount_amount: toChargeCurrency(referral.discount),
        reward_amount: toChargeCurrency(referral.reward),
      });
      if (referralErr) {
        console.error('Failed to save referral:', referralErr);
        await dropPending();
        return jsonResponse({ error: 'Could not start your enrolment. Please try again.' }, 500);
      }
    }

    return await paymentLink(flutterwaveKey, {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: `${successUrl}?tx_ref=${encodeURIComponent(txRef)}&faculty_id=${encodeURIComponent(facultyId)}&plan=${encodeURIComponent(planName)}`,
      meta: {
        faculty_id: facultyId,
        plan_name: planName,
        discount_code: code,
      },
      customer: {
        email: `${facultyId}@techfaculty.ng`,
      },
      customizations: {
        title: 'Tech Faculty',
        description: `${planName} Plan${split ? ' (deposit)' : ''} — ${itemNames.join(', ')}`,
        logo: 'https://techfaculty.ng/favicon.png',
      },
    }, dropPending);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    console.error('Flutterwave checkout error:', error);
    return jsonResponse({ error: message }, 500);
  }
});
