import { beforeEach, describe, expect, it, vi } from "vitest";
import { setEnv } from "./stubs/deno-env.ts";
import { servedHandler } from "./stubs/deno-serve.ts";
import { createClient, useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import "../../supabase/functions/verify-payment/index.ts";
import { confirmPayment } from "../../supabase/functions/_shared/flutterwave.ts";

const TX = "TFB-TF001-1111";

let db: FakeDb;
let flutterwave: ReturnType<typeof vi.fn>;

const plan = () => db.tables.enrollments[0];
const payment = () => db.tables.enrollment_payments[0];

function flutterwaveSays(over: Record<string, unknown> = {}) {
  flutterwave.mockResolvedValue(
    new Response(JSON.stringify({ status: "success", data: { id: 555, tx_ref: TX, status: "successful", amount: 41250, currency: "NGN", ...over } })),
  );
}

function verify(token = "student-token") {
  return servedHandler()(
    new Request("https://fn.test/verify-payment", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ txRef: TX }),
    }),
  );
}

beforeEach(() => {
  db = {
    users: { "student-token": "user-1", "other-token": "user-2" },
    tables: {
      profiles: [
        { id: "user-1", faculty_id: "TF001" },
        { id: "user-2", faculty_id: "TF002" },
      ],
      enrollments: [
        {
          id: "enr-1",
          faculty_id: "TF001",
          plan_name: "Developer Pro",
          status: "active",
          tx_ref: "TF-TF001-0000",
          amount_due: 41250,
          instalment_total: 82500,
          balance_due: 41250,
          currency: "NGN",
        },
      ],
      enrollment_payments: [{ id: "pay-1", enrollment_id: "enr-1", tx_ref: TX, amount: 41250, currency: "NGN", status: "pending" }],
    },
  };
  useFakeDb(db);
  setEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK_TEST-key");
  flutterwave = vi.fn();
  vi.stubGlobal("fetch", flutterwave);
  flutterwaveSays();
});

describe("paying an instalment balance", () => {
  it("clears the balance once Flutterwave confirms it, and counts the full plan as paid", async () => {
    const res = await verify();
    expect(await res.json()).toEqual({ status: "active", planName: "Developer Pro", facultyId: "TF001" });
    expect(payment()).toMatchObject({ status: "paid", payment_reference: "555" });
    expect(plan()).toMatchObject({ balance_due: 0, amount_paid: 82500, status: "active" });
    expect(typeof plan().balance_paid_at).toBe("string");
  });

  it("keeps the balance when the payment is short or in another currency", async () => {
    flutterwaveSays({ amount: 40000 });
    expect(await (await verify()).json()).toEqual({ status: "failed" });
    flutterwaveSays({ currency: "USD" });
    expect(await (await verify()).json()).toEqual({ status: "failed" });
    expect(plan().balance_due).toBe(41250);
    expect(payment().status).toBe("pending");
  });

  it("doesn't let another student check it", async () => {
    expect((await verify("other-token")).status).toBe(404);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("is safe to confirm twice", async () => {
    const admin = createClient() as never;
    expect((await confirmPayment(admin, "key", TX)).status).toBe("active");
    flutterwave.mockClear();
    expect((await confirmPayment(admin, "key", TX)).status).toBe("active");
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("reports an unknown reference as not found", async () => {
    expect((await confirmPayment(createClient() as never, "key", "TFB-nope")).status).toBe("not_found");
  });
});
