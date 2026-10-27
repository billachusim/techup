// Who may download the paid SIWES Success Kit from /api/success-kit:
// - a buyer, with the payment reference of a paid order that includes the kit
//   (it is on /order-complete and in their receipt email), or
// - a signed-in admin, to send the kit by hand to someone who paid by transfer.
// The free placement checklist is a separate public PDF and is not affected.
import { SUCCESS_KIT_BASE64, SUCCESS_KIT_FILENAME } from "@/lib/success-kit-file.server";
import { isOrderRef } from "../../supabase/functions/_shared/products.ts";

// The admin client's query builder; loose so tests can pass an in-memory stand-in.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = { from: (table: string) => any; auth: { getUser: (token: string) => Promise<any> } };

export type KitAccess = { ok: true; via: "order" | "admin" } | { ok: false; status: number; message: string };

export async function checkKitAccess(db: Db, ref: string | null, token: string | null): Promise<KitAccess> {
  if (ref) {
    if (!isOrderRef(ref)) return { ok: false, status: 404, message: "That download link isn't valid." };
    const { data: order } = await db
      .from("product_orders")
      .select("status, items")
      .eq("tx_ref", ref)
      .maybeSingle();
    if (order?.status === "paid" && (order.items as string[]).includes("success_kit")) return { ok: true, via: "order" };
    if (order?.status === "pending")
      return { ok: false, status: 402, message: "We haven't received confirmation of this payment yet. Try again in a few minutes." };
    return { ok: false, status: 404, message: "That download link isn't valid." };
  }

  if (token) {
    const { data } = await db.auth.getUser(token);
    const userId = data?.user?.id;
    if (userId) {
      const { data: roles } = await db.from("user_roles").select("role").eq("user_id", userId);
      if (((roles ?? []) as { role: string }[]).some((r) => r.role === "admin")) return { ok: true, via: "admin" };
    }
    return { ok: false, status: 403, message: "Admins only." };
  }

  return { ok: false, status: 404, message: "That download link isn't valid." };
}

export function kitFileResponse() {
  const bytes = Uint8Array.from(atob(SUCCESS_KIT_BASE64), (c) => c.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${SUCCESS_KIT_FILENAME}"`,
      // Personal to the buyer: never cached by a shared cache.
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
