import { readFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { checkKitAccess, kitFileResponse } from "../../src/lib/success-kit-download.server.ts";
import { SUCCESS_KIT_BASE64 } from "../../src/lib/success-kit-file.server.ts";
import { createClient, useFakeDb } from "./stubs/supabase.ts";

const db = () => createClient() as never;

function setup() {
  useFakeDb({
    users: { "admin-token": "admin-1", "student-token": "user-1" },
    tables: {
      product_orders: [
        { tx_ref: "TFO-kit", status: "paid", items: ["success_kit"] },
        { tx_ref: "TFO-siwes", status: "paid", items: ["virtual_siwes"] },
        { tx_ref: "TFO-unpaid", status: "pending", items: ["success_kit"] },
      ],
      user_roles: [{ user_id: "admin-1", role: "admin" }],
    },
  });
}

describe("paid Success Kit download", () => {
  it("is not a public file any more, while the free checklist still is", () => {
    expect(existsSync("public/downloads/siwes-success-kit-TFNG-v1.zip")).toBe(false);
    expect(existsSync("public/downloads/siwes-placement-checklist.pdf")).toBe(true);
  });

  it("serves exactly the zip in private/success-kit (re-run scripts/embed-success-kit.ts after replacing it)", async () => {
    const zip = readFileSync("private/success-kit/siwes-success-kit-TFNG-v1.zip");
    expect(SUCCESS_KIT_BASE64).toBe(zip.toString("base64"));
    const res = kitFileResponse();
    expect(res.headers.get("Content-Type")).toBe("application/zip");
    expect(Buffer.from(await res.arrayBuffer()).equals(zip)).toBe(true);
  });

  it("lets a buyer with a paid kit order download it", async () => {
    setup();
    expect(await checkKitAccess(db(), "TFO-kit", null)).toEqual({ ok: true, via: "order" });
  });

  it("refuses unpaid orders, orders without the kit and made-up references", async () => {
    setup();
    expect(await checkKitAccess(db(), "TFO-unpaid", null)).toMatchObject({ ok: false, status: 402 });
    expect(await checkKitAccess(db(), "TFO-siwes", null)).toMatchObject({ ok: false, status: 404 });
    expect(await checkKitAccess(db(), "TFO-guess", null)).toMatchObject({ ok: false, status: 404 });
    expect(await checkKitAccess(db(), "TF-TF001-enrolment", null)).toMatchObject({ ok: false, status: 404 });
    expect(await checkKitAccess(db(), null, null)).toMatchObject({ ok: false });
  });

  it("lets an admin download it to send to a transfer buyer, but not other signed-in users", async () => {
    setup();
    expect(await checkKitAccess(db(), null, "admin-token")).toEqual({ ok: true, via: "admin" });
    expect(await checkKitAccess(db(), null, "student-token")).toMatchObject({ ok: false, status: 403 });
    expect(await checkKitAccess(db(), null, "bad-token")).toMatchObject({ ok: false, status: 403 });
  });
});
