import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/integrations/supabase/lazy";
import { PRODUCTS, type ProductId } from "../../../supabase/functions/_shared/products.ts";

type Order = {
  id: string;
  items: string[];
  amount_due: number;
  name: string | null;
  email: string;
  phone: string | null;
  school: string | null;
  notes: string | null;
  paid_at: string | null;
  fulfilled_at: string | null;
};

const itemNames = (items: string[]) => items.map((id) => PRODUCTS[id as ProductId]?.name ?? id).join(" + ");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

const whatsappUrl = (order: Order) => {
  const digits = (order.phone ?? "").replace(/\D/g, "");
  const normalised = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  const firstName = order.name?.trim().split(/\s+/)[0];
  const message = `Hello${firstName ? ` ${firstName}` : ""}, this is Tech Faculty NG. Thank you for your payment for ${itemNames(order.items)}.`;
  return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
};

/** Online orders paid by card (Virtual SIWES, logbook service, Success Kit) that still need sending. */
export default function PaidOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("product_orders")
      .select("id, items, amount_due, name, email, phone, school, notes, paid_at, fulfilled_at")
      .eq("status", "paid")
      .is("fulfilled_at", null)
      .order("paid_at", { ascending: true })
      .limit(100);
    // Before the online-orders migration runs the table is missing; show nothing.
    setOrders(error ? [] : ((data ?? []) as Order[]));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markFulfilled = async (order: Order) => {
    setSaving(order.id);
    const supabase = await getSupabase();
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("product_orders")
      .update({ fulfilled_at: new Date().toISOString(), fulfilled_by: auth.user?.id ?? null })
      .eq("id", order.id);
    setSaving(null);
    if (error) {
      toast({ title: "Couldn't update the order", description: error.message, variant: "destructive" });
      return;
    }
    setOrders((prev) => (prev ?? []).filter((o) => o.id !== order.id));
    toast({ title: "Marked fulfilled", description: order.name || order.email });
  };

  if (!orders?.length) return null;

  return (
    <Card className="border-primary/40">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Paid online, to fulfil ({orders.length})</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Send the acceptance letter, arrange the logbook pickup or check the kit download, then mark it fulfilled.
        </p>
        <ul className="divide-y divide-border">
          {orders.map((order) => (
            <li key={order.id} className="py-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 text-sm min-w-0">
                <p className="font-medium">
                  {order.name || order.email}{" "}
                  <Badge variant="secondary" className="ml-1">
                    ₦{Number(order.amount_due).toLocaleString("en-NG")}
                  </Badge>
                </p>
                <p>{itemNames(order.items)}</p>
                <p className="text-muted-foreground break-words">
                  {order.email}
                  {order.phone ? ` · ${order.phone}` : ""}
                  {order.school ? ` · ${order.school}` : ""}
                  {order.paid_at ? ` · paid ${formatDate(order.paid_at)}` : ""}
                </p>
                {order.notes && <p className="text-muted-foreground break-words">{order.notes}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                {order.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={whatsappUrl(order)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                    </a>
                  </Button>
                )}
                <Button size="sm" onClick={() => void markFulfilled(order)} disabled={saving === order.id}>
                  {saving === order.id ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  )}
                  Mark fulfilled
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
