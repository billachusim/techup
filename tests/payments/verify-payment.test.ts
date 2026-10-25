import { beforeEach, describe, expect, it, vi } from "vitest";
import { setEnv } from "./stubs/deno-env.ts";
import { servedHandler } from "./stubs/deno-serve.ts";
import { createClient, useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import "../../supabase/functions/verify-payment/index.ts";
import { confirmOrderPayment, confirmPayment } from "../../supabase/functions/_shared/flutterwave.ts";

const TX = "TF-TF001-1111";

let db: FakeDb;
let flutterwave: ReturnType<typeof vi.fn>;

const enrollment = () => db.tables.enrollments[0];

/** What Flutterwave's verify API reports for TX. */
function flutterwaveSays(data: Record<string, unknown> | null, httpStatus = 200) {
  flutterwave.mockResolvedValue(
    new Response(JSON.stringify(data ? { status: "success", data } : { status: "error", message: "No transaction" }), {
      status: httpStatus,
    }),
  );
}
const paid = (over: Record<string, unknown> = {}) => ({
  id: 987654,
  tx_ref: TX,
  status: "successful",
  amount: 82500,
  currency: "NGN",
  ...over,
});

function verify(body: unknown, token = "student-token") {
  return servedHandler()(
    new Request("https://fn.test/verify-payment", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
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
          status: "pending",
          tx_ref: TX,
          amount_due: 82500,
          currency: "NGN",
        },
      ],
    },
  };
  useFakeDb(db);
  setEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK_TEST-key");
  flutterwave = vi.fn();
  vi.stubGlobal("fetch", flutterwave);
  flutterwaveSays(paid());
});

describe("verify-payment", () => {
  it("activates the enrolment once Flutterwave confirms the full amount", async () => {
    const res = await verify({ txRef: TX });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "active", planName: "Developer Pro", facultyId: "TF001" });
    expect(enrollment()).toMatchObject({ status: "active", payment_reference: "987654" });
    expect(typeof enrollment().paid_at).toBe("string");

    const [url, init] = flutterwave.mock.calls[0];
    expect(url).toBe(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${TX}`);
    expect(init.headers.Authorization).toBe("Bearer FLWSECK_TEST-key");
  });

  it("does not activate an underpaid enrolment", async () => {
    flutterwaveSays(paid({ amount: 82000 }));
    expect(await (await verify({ txRef: TX })).json()).toEqual({ status: "failed" });
    expect(enrollment().status).toBe("pending");
  });

  it("does not activate a payment made in another currency", async () => {
    flutterwaveSays(paid({ amount: 82500, currency: "USD" }));
    expect(await (await verify({ txRef: TX })).json()).toEqual({ status: "failed" });
    expect(enrollment().status).toBe("pending");
  });

  it("does not activate a payment for a different reference", async () => {
    flutterwaveSays(paid({ tx_ref: "TF-TF001-2222" }));
    expect(await (await verify({ txRef: TX })).json()).toEqual({ status: "failed" });
    expect(enrollment().status).toBe("pending");
  });

  it("accepts an overpayment and a USD payment to the cent", async () => {
    flutterwaveSays(paid({ amount: 90000 }));
    expect(await (await verify({ txRef: TX })).json()).toMatchObject({ status: "active" });

    Object.assign(enrollment(), { status: "pending", amount_due: 58.93, currency: "USD" });
    flutterwaveSays(paid({ amount: 58.93, currency: "USD" }));
    expect(await (await verify({ txRef: TX })).json()).toMatchObject({ status: "active" });
  });

  it("keeps waiting while Flutterwave has the payment as pending or unknown", async () => {
    flutterwaveSays(paid({ status: "pending" }));
    expect(await (await verify({ txRef: TX })).json()).toEqual({ status: "pending" });

    flutterwaveSays(null, 404);
    expect(await (await verify({ txRef: TX })).json()).toEqual({ status: "pending" });
    expect(enrollment().status).toBe("pending");
  });

  it("reports a failed card payment and leaves the enrolment unpaid", async () => {
    flutterwaveSays(paid({ status: "failed" }));
    expect(await (await verify({ txRef: TX })).json()).toEqual({ status: "failed" });
    expect(enrollment().status).toBe("pending");
  });

  it("does not let a student check someone else's payment", async () => {
    const res = await verify({ txRef: TX }, "other-token");
    expect(res.status).toBe(404);
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollment().status).toBe("pending");
  });

  it("asks a signed-out visitor to sign in", async () => {
    expect((await verify({ txRef: TX }, "bad-token")).status).toBe(401);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("needs a payment reference", async () => {
    expect((await verify({})).status).toBe(400);
    expect((await verify({ txRef: 42 })).status).toBe(400);
    expect((await verify("not json")).status).toBe(400);
  });

  it("refuses to run without the Flutterwave key", async () => {
    setEnv("FLUTTERWAVE_SECRET_KEY", undefined);
    expect((await verify({ txRef: TX })).status).toBe(500);
    expect(enrollment().status).toBe("pending");
  });
});

describe("confirmPayment", () => {
  const admin = () => createClient() as never;

  it("reports an already-paid enrolment as active without asking Flutterwave again", async () => {
    enrollment().status = "confirmed";
    const result = await confirmPayment(admin(), "key", TX);
    expect(result).toEqual({ status: "active", enrollmentId: "enr-1", planName: "Developer Pro", facultyId: "TF001" });
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("never reactivates a cancelled enrolment", async () => {
    enrollment().status = "cancelled";
    expect(await confirmPayment(admin(), "key", TX)).toMatchObject({ status: "failed" });
    expect(flutterwave).not.toHaveBeenCalled();
    expect(enrollment().status).toBe("cancelled");
  });

  it("reports an unknown reference as not found", async () => {
    expect(await confirmPayment(admin(), "key", "TF-nope")).toMatchObject({ status: "not_found" });
    expect(flutterwave).not.toHaveBeenCalled();
  });
});

describe("verify-payment for online orders", () => {
  const ORDER_TX = "TFO-5555";
  const order = () => db.tables.product_orders[0];

  beforeEach(() => {
    db.tables.product_orders = [
      { id: "ord-1", tx_ref: ORDER_TX, items: ["virtual_siwes", "logbook_service"], status: "pending", amount_due: 60000, currency: "NGN", lead_id: "lead-1" },
    ];
    db.tables.leads = [{ id: "lead-1", status: "new" }];
    flutterwaveSays(paid({ tx_ref: ORDER_TX, amount: 60000 }));
  });

  it("marks the order paid without a sign-in once Flutterwave confirms the full amount", async () => {
    const res = await verify({ txRef: ORDER_TX }, "no-such-token");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "paid", items: ["virtual_siwes", "logbook_service"] });
    expect(order()).toMatchObject({ status: "paid", payment_reference: "987654" });
    expect(typeof order().paid_at).toBe("string");
    // Closed, so the lead follow-up emails never chase a buyer who has paid.
    expect(db.tables.leads[0].status).toBe("enrolled");
  });

  it("does not mark an underpaid or wrong-currency order paid", async () => {
    flutterwaveSays(paid({ tx_ref: ORDER_TX, amount: 45000 }));
    expect(await (await verify({ txRef: ORDER_TX })).json()).toEqual({ status: "failed" });
    flutterwaveSays(paid({ tx_ref: ORDER_TX, amount: 60000, currency: "USD" }));
    expect(await (await verify({ txRef: ORDER_TX })).json()).toEqual({ status: "failed" });
    expect(order().status).toBe("pending");
    expect(db.tables.leads[0].status).toBe("new");
  });

  it("keeps waiting while the payment is pending", async () => {
    flutterwaveSays(paid({ tx_ref: ORDER_TX, amount: 60000, status: "pending" }));
    expect(await (await verify({ txRef: ORDER_TX })).json()).toEqual({ status: "pending" });
    expect(order().status).toBe("pending");
  });

  it("reports an unknown order reference as not found", async () => {
    expect((await verify({ txRef: "TFO-nope" })).status).toBe(404);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("does not ask Flutterwave again for an order already paid, and never revives a cancelled one", async () => {
    const admin = createClient() as never;
    order().status = "paid";
    expect(await confirmOrderPayment(admin, "key", ORDER_TX)).toMatchObject({ status: "paid" });
    order().status = "cancelled";
    expect(await confirmOrderPayment(admin, "key", ORDER_TX)).toMatchObject({ status: "failed" });
    expect(flutterwave).not.toHaveBeenCalled();
  });
});
