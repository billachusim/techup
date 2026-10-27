import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setEnv } from "./stubs/deno-env.ts";
import { servedHandler } from "./stubs/deno-serve.ts";
import { useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import "../../supabase/functions/create-checkout/index.ts";
import { INSTALMENTS, PLAN_PRICING, instalmentSplit } from "../../supabase/functions/_shared/pricing.ts";

const devProCourses = PLAN_PRICING["developer-pro"].courses;
const devProTotal = devProCourses.reduce((s, c) => s + c.price, 0);

let db: FakeDb;
let flutterwave: ReturnType<typeof vi.fn>;

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
  INSTALMENTS.enabled = true;
  db = {
    users: { "student-token": "user-1", "other-token": "user-2" },
    tables: {
      profiles: [
        { id: "user-1", faculty_id: "TF001" },
        { id: "user-2", faculty_id: "TF002" },
      ],
      enrollments: [],
      enrollment_payments: [],
    },
  };
  useFakeDb(db);
  setEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK_TEST-key");
  flutterwave = vi.fn(async () =>
    new Response(JSON.stringify({ status: "success", data: { link: "https://checkout.flutterwave.test/pay/abc" } })),
  );
  vi.stubGlobal("fetch", flutterwave);
});

afterEach(() => {
  INSTALMENTS.enabled = true;
});

describe("instalment terms", () => {
  it("are two payments, the balance due within 30 days", () => {
    expect(INSTALMENTS.enabled).toBe(true);
    expect(INSTALMENTS.balanceDueDays).toBe(30);
    INSTALMENTS.enabled = false;
    expect(instalmentSplit(100000)).toBeNull();
  });

  it("split a total into a deposit and a balance that add back up", () => {
    const split = instalmentSplit(82501)!;
    expect(split.deposit + split.balance).toBe(82501);
    expect(split.deposit).toBe(Math.round(82501 * INSTALMENTS.depositPercent / 100));
    expect(instalmentSplit(INSTALMENTS.minimumTotal - 1)).toBeNull();
  });
});

describe("create-checkout with instalments", () => {
  it("charges the deposit and records the balance", async () => {
    const res = await checkout({ payInInstalments: true });
    expect(res.status).toBe(200);
    const { deposit, balance } = instalmentSplit(devProTotal)!;
    expect(sentToFlutterwave()).toMatchObject({ amount: deposit, currency: "NGN" });
    const [enrollment] = db.tables.enrollments;
    expect(enrollment).toMatchObject({ status: "pending", amount_due: deposit, instalment_total: devProTotal, balance_due: balance });
    expect(enrollment.balance_due_by).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("refuses instalments while they are switched off", async () => {
    INSTALMENTS.enabled = false;
    const res = await checkout({ payInInstalments: true });
    expect(res.status).toBe(400);
    expect(flutterwave).not.toHaveBeenCalled();
    expect(db.tables.enrollments).toHaveLength(0);
  });

  it("leaves a pay-in-full checkout as it was", async () => {
    await checkout({});
    expect(sentToFlutterwave().amount).toBe(devProTotal);
    expect(db.tables.enrollments[0].balance_due).toBeUndefined();
  });

  it("starts a balance payment for the student's own plan", async () => {
    db.tables.enrollments.push({ id: "enr-1", faculty_id: "TF001", plan_name: "Developer Pro", status: "active", balance_due: 41250, currency: "NGN" });
    const res = await checkout({ balanceForEnrollmentId: "enr-1" });
    expect(res.status).toBe(200);
    const payment = sentToFlutterwave();
    expect(payment).toMatchObject({ amount: 41250, currency: "NGN" });
    expect(payment.tx_ref).toMatch(/^TFB-TF001-/);
    expect(db.tables.enrollment_payments[0]).toMatchObject({ enrollment_id: "enr-1", tx_ref: payment.tx_ref, amount: 41250, status: "pending" });
  });

  it("won't start a balance payment for someone else's plan or one with nothing left", async () => {
    db.tables.enrollments.push(
      { id: "enr-1", faculty_id: "TF001", plan_name: "Developer Pro", status: "active", balance_due: 41250, currency: "NGN" },
      { id: "enr-2", faculty_id: "TF001", plan_name: "Data Wizard", status: "active", balance_due: 0, currency: "NGN" },
    );
    expect((await checkout({ balanceForEnrollmentId: "enr-1" }, "other-token")).status).toBe(403);
    expect((await checkout({ balanceForEnrollmentId: "enr-2" })).status).toBe(400);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("drops the balance payment when Flutterwave won't give a link", async () => {
    db.tables.enrollments.push({ id: "enr-1", faculty_id: "TF001", plan_name: "Developer Pro", status: "active", balance_due: 41250, currency: "NGN" });
    flutterwave.mockResolvedValueOnce(new Response(JSON.stringify({ status: "error", message: "nope" }), { status: 400 }));
    expect((await checkout({ balanceForEnrollmentId: "enr-1" })).status).toBe(502);
    expect(db.tables.enrollment_payments).toHaveLength(0);
  });
});
