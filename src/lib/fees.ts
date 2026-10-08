// Fee figures quoted in page copy and FAQ answers. They come from the same
// table the pricing section and checkout use, so a price change updates
// every answer that mentions it.
import { LEARNING_MODES, PLAN_PRICING } from "../../supabase/functions/_shared/pricing.ts";

/** Naira per US dollar, the same rate create-checkout uses for USD payments. */
export const NGN_TO_USD_RATE = 1400;

/** A naira amount in whole US dollars at the checkout rate. */
export const toUsd = (amount: number) => Math.round(amount / NGN_TO_USD_RATE);

export const naira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

const modeFee = (id: string) => LEARNING_MODES.find((m) => m.id === id)?.price ?? 0;

/** Extra charged on top of the online fee for each study mode. */
export const HYBRID_FEE = modeFee("hybrid");
export const PHYSICAL_FEE = modeFee("physical");

/** Lowest checkout amount for a pricing plan, or undefined for an unknown plan. */
export const planMinimum = (planId: string): number | undefined =>
  PLAN_PRICING[planId]?.minimumAmount;

/** Holiday teen programme fees (2026), as published on the blog. */
export const TEEN_HOLIDAY_FROM = { amount: 45000, weeks: 4 };

/** Cheapest paid department plan, for "from ₦…" copy. */
export const LOWEST_PAID_PLAN = Math.min(
  ...Object.values(PLAN_PRICING)
    .map((p) => p.minimumAmount)
    .filter((n) => n > 0),
);
