import { beforeEach, describe, expect, it, vi } from "vitest";
import { setEnv } from "./stubs/deno-env.ts";
import { servedHandler } from "./stubs/deno-serve.ts";
import { useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import "../../supabase/functions/create-order-checkout/index.ts";
import { PRODUCTS, priceOrder } from "../../supabase/functions/_shared/products.ts";

let db: FakeDb;
let flutterwave: ReturnType<typeof vi.fn>;

const orders = () => db.tables.product_orders ?? [];
const leads = () => db.tables.leads ?? [];
const sentToFlutterwave = () => JSON.parse(flutterwave.mock.calls[0][1].body);

function order(body: Record<string, unknown>) {
  return servedHandler()(
    new Request("https://fn.test/create-order-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: ["virtual_siwes"],
        name: "Ada Obi",
        email: "Ada@Example.com",
        phone: "0803 000 0000",
        source: "/virtual-siwes#pay",
        ...body,
      }),
    }),
  );
}

beforeEach(() => {
  db = { users: {}, tables: { leads: [], product_orders: [] } };
  useFakeDb(db);
  setEnv("FLUTTERWAVE_SECRET_KEY", "FLWSECK_TEST-key");
  setEnv("SITE_URL", undefined);
  flutterwave = vi.fn(async () =>
    new Response(JSON.stringify({ status: "success", data: { link: "https://checkout.flutterwave.test/pay/abc" } })),
  );
  vi.stubGlobal("fetch", flutterwave);
});

describe("product prices", () => {
  // The pages read their prices from this same list (src/data/virtualSiwes.ts, successKit.ts).
  it("charges the prices Bill confirmed", () => {
    expect(PRODUCTS.virtual_siwes.priceNGN).toBe(45000);
    expect(PRODUCTS.logbook_service.priceNGN).toBe(15000);
    expect(PRODUCTS.success_kit.priceNGN).toBe(4500);
  });

  it("counts each product once and refuses unknown or empty orders", () => {
    expect(priceOrder(["virtual_siwes", "logbook_service", "virtual_siwes"])).toMatchObject({ ok: true, totalNGN: 60000 });
    expect(priceOrder(["free_laptop"])).toMatchObject({ ok: false });
    expect(priceOrder([])).toMatchObject({ ok: false });
    expect(priceOrder("virtual_siwes")).toMatchObject({ ok: false });
  });
});

describe("create-order-checkout", () => {
  it("saves a pending order and a lead, and charges the catalogue price in naira", async () => {
    const res = await order({ amount: 1, school: "UNIZIK", notes: "IT duration: 6 months" });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ url: "https://checkout.flutterwave.test/pay/abc" });

    expect(orders()).toHaveLength(1);
    const saved = orders()[0];
    expect(saved).toMatchObject({
      items: ["virtual_siwes"],
      amount_due: 45000,
      currency: "NGN",
      status: "pending",
      email: "ada@example.com",
      phone: "0803 000 0000",
      school: "UNIZIK",
      notes: "IT duration: 6 months",
    });
    expect(String(saved.tx_ref)).toMatch(/^TFO-/);

    expect(leads()).toHaveLength(1);
    expect(leads()[0]).toMatchObject({ id: saved.lead_id, interest: "virtual_siwes", channel: "email", contact: "ada@example.com", source: "/virtual-siwes#pay" });
    expect(String(leads()[0].notes)).toContain("WhatsApp: 0803 000 0000");

    const [url] = flutterwave.mock.calls[0];
    expect(url).toBe("https://api.flutterwave.com/v3/payments");
    const sent = sentToFlutterwave();
    expect(sent).toMatchObject({ tx_ref: saved.tx_ref, amount: 45000, currency: "NGN", customer: { email: "ada@example.com" } });
    expect(sent.redirect_url).toBe(`https://techfaculty.ng/order-complete?tx_ref=${encodeURIComponent(String(saved.tx_ref))}`);
  });

  it("charges a placement and logbook bundle in one payment", async () => {
    await order({ items: ["virtual_siwes", "logbook_service"] });
    expect(orders()[0]).toMatchObject({ items: ["virtual_siwes", "logbook_service"], amount_due: 60000 });
    expect(sentToFlutterwave().amount).toBe(60000);
  });

  it("sells the Success Kit at its price", async () => {
    await order({ items: ["success_kit"] });
    expect(orders()[0]).toMatchObject({ amount_due: 4500 });
    expect(leads()[0].interest).toBe("success_kit");
  });

  it("refuses unknown products and missing buyer details without saving anything", async () => {
    expect((await order({ items: ["free_laptop"] })).status).toBe(400);
    expect((await order({ name: " " })).status).toBe(400);
    expect((await order({ email: "not-an-email" })).status).toBe(400);
    expect((await order({ phone: "123" })).status).toBe(400);
    expect(orders()).toHaveLength(0);
    expect(leads()).toHaveLength(0);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("drops the pending order when Flutterwave won't open a payment page", async () => {
    flutterwave.mockResolvedValue(new Response(JSON.stringify({ status: "error", message: "Invalid key" }), { status: 401 }));
    const res = await order({});
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Invalid key" });
    expect(orders()).toHaveLength(0);
  });

  it("fails cleanly when the order can't be saved", async () => {
    db.failInsert = new Set(["product_orders"]);
    expect((await order({})).status).toBe(500);
    expect(flutterwave).not.toHaveBeenCalled();
  });

  it("refuses to run without the Flutterwave key", async () => {
    setEnv("FLUTTERWAVE_SECRET_KEY", undefined);
    expect((await order({})).status).toBe(500);
    expect(orders()).toHaveLength(0);
  });
});
