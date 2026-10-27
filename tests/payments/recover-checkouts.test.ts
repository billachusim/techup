import { beforeEach, describe, expect, it, vi } from "vitest";
import "./stubs/deno-env.ts";
import { servedHandler } from "./stubs/deno-serve.ts";
import { useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import "../../supabase/functions/recover-checkouts/index.ts";

const MINUTE = 60 * 1000;
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

let db: FakeDb;
let fetchMock: ReturnType<typeof vi.fn>;
/** Flutterwave's verify answer per tx_ref; anything missing is unknown to Flutterwave. */
let flutterwave: Record<string, Record<string, unknown>>;

const checkout = (id: string, createdAt: string, over: Record<string, unknown> = {}) => ({
  id,
  faculty_id: "TF001",
  plan_name: "Developer Pro",
  status: "pending",
  tx_ref: `TF-TF001-${id}`,
  amount_due: 82500,
  currency: "NGN",
  created_at: createdAt,
  ...over,
});
const row = (id: string) => db.tables.enrollments.find((r) => r.id === id)!;
const run = async () => (await servedHandler()(new Request("https://fn.test/recover-checkouts", { method: "POST" }))).json();

beforeEach(() => {
  db = { users: {}, tables: { enrollments: [], product_orders: [] } };
  useFakeDb(db);
  flutterwave = {};
  fetchMock = vi.fn(async (url: string) => {
    if (url.endsWith("/api/payment-followups")) return Response.json({ confirmationsSent: 1, remindersSent: 0 });
    const txRef = new URL(url).searchParams.get("tx_ref")!;
    const data = flutterwave[txRef];
    return Response.json(data ? { status: "success", data } : { status: "error" }, { status: data ? 200 : 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
});

describe("recover-checkouts", () => {
  it("activates a paid checkout the student left before the payment page confirmed it", async () => {
    db.tables.enrollments.push(checkout("a", ago(40 * MINUTE)));
    flutterwave["TF-TF001-a"] = { id: 555, tx_ref: "TF-TF001-a", status: "successful", amount: 82500, currency: "NGN" };

    expect(await run()).toMatchObject({ checked: 1, confirmed: 1 });
    expect(row("a")).toMatchObject({ status: "active", payment_reference: "555" });
    expect(typeof row("a").recovered_at).toBe("string");
  });

  it("leaves unpaid and underpaid checkouts pending", async () => {
    db.tables.enrollments.push(checkout("unpaid", ago(40 * MINUTE)), checkout("short", ago(40 * MINUTE)));
    flutterwave["TF-TF001-short"] = { id: 1, tx_ref: "TF-TF001-short", status: "successful", amount: 1000, currency: "NGN" };

    expect(await run()).toMatchObject({ checked: 2, confirmed: 0 });
    expect(row("unpaid")).toMatchObject({ status: "pending" });
    expect(row("short")).toMatchObject({ status: "pending" });
    expect(row("short").recovered_at).toBeUndefined();
  });

  it("skips fresh, old, manual and already-settled enrolments", async () => {
    db.tables.enrollments.push(
      checkout("fresh", ago(2 * MINUTE)),
      checkout("old", ago(8 * 24 * 60 * MINUTE)),
      checkout("manual", ago(40 * MINUTE), { tx_ref: null }),
      checkout("done", ago(40 * MINUTE), { status: "active" }),
    );

    expect(await run()).toMatchObject({ checked: 0, confirmed: 0 });
    const flutterwaveCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes("flutterwave"));
    expect(flutterwaveCalls).toHaveLength(0);
  });

  it("does not mark a payment the payment page already confirmed as recovered", async () => {
    db.tables.enrollments.push(checkout("page", ago(40 * MINUTE), { status: "active" }));
    await run();
    expect(row("page").recovered_at).toBeUndefined();
  });

  it("asks the site to send the follow-up emails after re-checking", async () => {
    const body = await run();
    expect(fetchMock).toHaveBeenLastCalledWith("https://techfaculty.ng/api/payment-followups", { method: "POST" });
    expect(body.followups).toEqual({ confirmationsSent: 1, remindersSent: 0 });
  });

  it("marks a paid online order the buyer left before the order page confirmed it", async () => {
    const order = (id: string, createdAt: string, over: Record<string, unknown> = {}) => ({
      id, tx_ref: `TFO-${id}`, items: ["success_kit"], status: "pending", amount_due: 4500, currency: "NGN", created_at: createdAt, ...over,
    });
    db.tables.product_orders.push(order("paid", ago(40 * MINUTE)), order("unpaid", ago(40 * MINUTE)), order("fresh", ago(2 * MINUTE)));
    flutterwave["TFO-paid"] = { id: 777, tx_ref: "TFO-paid", status: "successful", amount: 4500, currency: "NGN" };

    expect(await run()).toMatchObject({ ordersChecked: 2, ordersPaid: 1 });
    const byId = (id: string) => db.tables.product_orders.find((r) => r.id === id)!;
    expect(byId("paid")).toMatchObject({ status: "paid", payment_reference: "777" });
    expect(typeof byId("paid").recovered_at).toBe("string");
    expect(byId("unpaid").status).toBe("pending");
    expect(byId("fresh").status).toBe("pending");
  });
});
