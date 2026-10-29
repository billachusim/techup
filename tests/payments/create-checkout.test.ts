import { beforeEach, describe, expect, it, vi } from "vitest";
import { setEnv } from "./stubs/deno-env.ts";
import { servedHandler } from "./stubs/deno-serve.ts";
import { useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import "../../supabase/functions/create-checkout/index.ts";
import {
  PLAN_PRICING,
  REFERRAL_DISCOUNT_PERCENT,
  REFERRER_REWARD_PERCENT,
} from "../../supabase/functions/_shared/pricing.ts";
import { NGN_TO_USD_RATE } from "../../src/lib/fees.ts";

const devProCourses = PLAN_PRICING["developer-pro"].courses;
// Developer Pro is a flat plan: its fee covers every course.
const devProCourseTotal = PLAN_PRICING["developer-pro"].minimumAmount;

let db: FakeDb;
let flutterwave: ReturnType<typeof vi.fn>;

const enrollments = () => db.tables.enrollments ?? [];
const sentToFlutterwave = () => JSON.parse(flutterwave.mock.calls[0][1].body);

function checkout(body: Record<string, unknown>, token = "student-token") {
  return servedHandler()(
    new Request("https://fn.test/create-checkout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: "developer-pro",
        planName: "Developer Pro",
        facultyId: "TF001",
        courseIds: devProCourses.map((c) => c.id),
        benefitIds: [],
        learningModeId: "online-only",
        successUrl: "https://techfaculty.ng/payment-success",
        ...body,
      }),
    }),
  );
}

beforeEach(() => {
  db = {
    users: { "student-token": "user-1" },
    tables: {
      profiles: [
        { id: "user-1", faculty_id: "TF001" },
        { id: "user-2", faculty_id: "TF002" },
      ],
      enrollments: [],
    },
  };
  useFakeDb(db);
  setEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK_TEST-key");
  flutterwave = vi.fn(async () =>
    new Response(JSON.stringify({ status: "success", data: { link: "https://checkout.flutterwave.test/pay/abc" } })),
  );
  vi.stubGlobal("fetch", flutterwave);
});

describe("create-checkout", () => {
  it("charges the catalogue price and saves a pending enrolment for it", async () => {
    const res = await checkout({ benefitIds: ["job-placement"], learningModeId: "hybrid" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://checkout.flutterwave.test/pay/abc" });

    const expected = devProCourseTotal + 15000 + 12000;
    const payment = sentToFlutterwave();
    expect(flutterwave.mock.calls[0][0]).toBe("https://api.flutterwave.com/v3/payments");
    expect(payment).toMatchObject({ amount: expected, currency: "NGN" });
    expect(enrollments()).toHaveLength(1);
    expect(enrollments()[0]).toMatchObject({
      faculty_id: "TF001",
      plan_name: "Developer Pro",
      status: "pending",
      amount_due: expected,
      currency: "NGN",
      learning_mode: "Hybrid Mode",
      tx_ref: payment.tx_ref,
    });
    expect(payment.tx_ref).toMatch(/^TF-TF001-/);
  });

  it("ignores any price the browser sends", async () => {
    const res = await checkout({
      amount: 100,
      totalAmount: 100,
      price: 100,
      courses: devProCourses.map((c) => ({ ...c, price: 1 })),
      benefits: [{ id: "job-placement", price: 1 }],
      learningMode: { id: "online-only", price: 0 },
    });
    expect(res.status).toBe(200);
    expect(sentToFlutterwave().amount).toBe(devProCourseTotal);
    expect(enrollments()[0].amount_due).toBe(devProCourseTotal);
  });

  it("saves the enrolment under the plan's own name, not the name the browser sends", async () => {
    await checkout({ planName: "Bootcamp Starter" });
    expect(enrollments()[0].plan_name).toBe("Developer Pro");
  });

  it("refuses a made-up discount code rather than charging anything for it", async () => {
    db.rpc = { check_referral_code: () => ({ ok: false, error: "That discount code isn't valid." }) };
    const res = await checkout({ discountCode: "FREEFORME" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "That discount code isn't valid." });
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollments()).toHaveLength(0);
  });

  it("takes the referral discount off and records the graduate's reward", async () => {
    const checked: Record<string, unknown>[] = [];
    db.rpc = {
      check_referral_code: (args) => {
        checked.push(args);
        return { ok: true, code: "CHIDI-7K3Q", referrer_user_id: "user-2" };
      },
    };
    const res = await checkout({ discountCode: " chidi-7k3q " });
    expect(res.status).toBe(200);
    expect(checked).toEqual([{ _code: "CHIDI-7K3Q", _user_id: "user-1" }]);

    const discount = Math.round((devProCourseTotal * REFERRAL_DISCOUNT_PERCENT) / 100);
    const paid = devProCourseTotal - discount;
    expect(sentToFlutterwave().amount).toBe(paid);
    expect(enrollments()[0]).toMatchObject({ amount_due: paid, coupon_code: "CHIDI-7K3Q" });
    expect(db.tables.referrals).toEqual([
      expect.objectContaining({
        code: "CHIDI-7K3Q",
        referrer_user_id: "user-2",
        referred_user_id: "user-1",
        tx_ref: enrollments()[0].tx_ref,
        currency: "NGN",
        discount_amount: discount,
        reward_amount: Math.round((paid * REFERRER_REWARD_PERCENT) / 100),
      }),
    ]);
  });

  it("refuses a referral code the database turns down, with its reason", async () => {
    db.rpc = { check_referral_code: () => ({ ok: false, error: "You can't use your own referral code." }) };
    const res = await checkout({ discountCode: "MINE-AAAA" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "You can't use your own referral code." });
    expect(enrollments()).toHaveLength(0);
  });

  it("drops the pending enrolment when the referral can't be saved", async () => {
    db.rpc = { check_referral_code: () => ({ ok: true, code: "CHIDI-7K3Q", referrer_user_id: "user-2" }) };
    db.failInsert = new Set(["referrals"]);
    const res = await checkout({ discountCode: "CHIDI-7K3Q" });
    expect(res.status).toBe(500);
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollments()).toHaveLength(0);
  });

  it("still applies the fixed promo codes without a referral check", async () => {
    await checkout({ discountCode: "techup25" });
    expect(sentToFlutterwave().amount).toBe(Math.round(devProCourseTotal * 0.75));
    expect(db.tables.referrals ?? []).toHaveLength(0);
  });

  it("converts to dollars at the site's rate for USD payments", async () => {
    await checkout({ currencyCode: "usd" });
    const usd = Math.round((devProCourseTotal / NGN_TO_USD_RATE) * 100) / 100;
    expect(sentToFlutterwave()).toMatchObject({ amount: usd, currency: "USD" });
    expect(enrollments()[0]).toMatchObject({ amount_due: usd, currency: "USD" });
  });

  it("treats any other currency as naira", async () => {
    await checkout({ currencyCode: "GBP" });
    expect(sentToFlutterwave()).toMatchObject({ amount: devProCourseTotal, currency: "NGN" });
  });

  const rejected: [string, Record<string, unknown>, string][] = [
    ["an unknown plan", { planId: "secret-plan" }, "Unknown plan"],
    ["an unknown course", { courseIds: [...devProCourses.map((c) => c.id), "made-up"] }, "Unknown course: made-up"],
    ["a course from another plan", { courseIds: ["deep-learning"] }, "Unknown course: deep-learning"],
    ["an unknown benefit", { benefitIds: ["free-laptop"] }, "Unknown benefit: free-laptop"],
    ["an unknown learning mode", { learningModeId: "vip" }, "Unknown learning mode: vip"],
    ["a custom selection below the plan minimum", { planId: "custom-builder", courseIds: ["html-css"] }, "Selection is below the plan minimum"],
    ["an empty free plan", { planId: "bootcamp-starter", courseIds: [] }, "No items selected for checkout"],
  ];
  it.each(rejected)("rejects %s without charging or saving anything", async (_, body, error) => {
    const res = await checkout(body);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error });
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollments()).toHaveLength(0);
  });

  it("asks a signed-out visitor to sign in", async () => {
    const res = await checkout({}, "bad-token");
    expect(res.status).toBe(401);
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollments()).toHaveLength(0);
  });

  it("refuses to enrol someone else's Faculty ID", async () => {
    const res = await checkout({ facultyId: "TF002" });
    expect(res.status).toBe(403);
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollments()).toHaveLength(0);
  });

  it("does nothing when Flutterwave is not configured", async () => {
    setEnv("FLUTTERWAVE_SECRET_KEY", undefined);
    const res = await checkout({});
    expect(res.status).toBe(500);
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollments()).toHaveLength(0);
  });

  it("stops before Flutterwave when the enrolment can't be saved", async () => {
    db.failInsert = new Set(["enrollments"]);
    const res = await checkout({});
    expect(res.status).toBe(500);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("removes the pending enrolment when Flutterwave refuses the payment", async () => {
    flutterwave.mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "error", message: "Invalid currency" }), { status: 400 }),
    );
    const res = await checkout({});
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Invalid currency" });
    expect(enrollments()).toHaveLength(0);
  });

  it("removes the pending enrolment when Flutterwave sends back garbage", async () => {
    flutterwave.mockResolvedValueOnce(new Response("<html>Bad gateway</html>", { status: 502 }));
    const res = await checkout({});
    expect(res.status).toBe(502);
    expect(enrollments()).toHaveLength(0);
  });

  it("removes the pending enrolment when Flutterwave returns no payment link", async () => {
    flutterwave.mockResolvedValueOnce(new Response(JSON.stringify({ status: "success", data: {} })));
    const res = await checkout({});
    expect(res.status).toBe(500);
    expect(enrollments()).toHaveLength(0);
  });

  it("answers the browser's CORS preflight", async () => {
    const res = await servedHandler()(new Request("https://fn.test/create-checkout", { method: "OPTIONS" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
