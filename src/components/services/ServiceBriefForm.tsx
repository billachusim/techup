import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, CreditCard, MessageCircle } from "lucide-react";
import { paymentReturnState } from "@/lib/service-payment-return";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getSupabase } from "@/integrations/supabase/lazy";
import { talentWhatsAppUrl } from "@/lib/talent";
import { notifyHiringRequest } from "@/lib/public-requests.functions";
import { trackLead } from "@/lib/analytics";
import { naira } from "@/lib/fees";
import { MAX_ORDER_QUANTITY } from "../../../supabase/functions/_shared/service-prices";

type Props = {
  /** Service page: its slug and name. Omit on hub pages, where the visitor names the task. */
  slug?: string;
  serviceName?: string;
  priceFrom?: number;
  unit?: string;
};

type Mode = "pay" | "custom";

/**
 * Order form for pay-per-task services, stored as a business brief like /hire.
 * On a service page the visitor can pay now at the listed price × quantity
 * (create-service-checkout makes the pay link from the shared price list), or
 * send a custom brief that staff quote by hand. Hub pages only take briefs.
 */
const ServiceBriefForm = ({ slug, serviceName, priceFrom, unit }: Props) => {
  const canPayNow = Boolean(slug && serviceName && priceFrom);
  const [mode, setMode] = useState<Mode>(canPayNow ? "pay" : "custom");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<"brief" | "paid" | "unpaid" | null>(
    null,
  );
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    phone: "",
    email: "",
    city: "",
    task: serviceName ?? "",
    quantity: "1",
    description: "",
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Back from Flutterwave: /services/<slug>?paid=1&status=successful|cancelled|failed
  useEffect(() => {
    if (typeof window === "undefined") return;
    const back = paymentReturnState(window.location.search);
    if (back) setDone(back);
  }, []);

  const qty = Math.min(
    MAX_ORDER_QUANTITY,
    Math.max(1, Math.floor(Number(form.quantity) || 1)),
  );
  const total = priceFrom ? priceFrom * qty : 0;
  const waMessage = `Hello Tech Faculty, I want to order ${form.task || serviceName || "a pay-per-task service"}${form.company ? ` for ${form.company}` : ""}.`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payNow = mode === "pay" && canPayNow;
    if (
      !form.company.trim() ||
      !form.contact_name.trim() ||
      !form.phone.trim() ||
      !form.task.trim() ||
      (!payNow && !form.description.trim())
    ) {
      toast({
        title: "Please fill the required fields",
        variant: "destructive",
      });
      return;
    }
    if (payNow && !form.email.trim()) {
      toast({
        title: "Add your email so we can send your receipt and updates",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const briefId = crypto.randomUUID();
      const supabase = await getSupabase();
      const title = payNow
        ? `Service order: ${serviceName}`
        : `Custom request: ${form.task.trim()}`;
      const details = payNow
        ? [
            `Pay-now order: ${qty} × ${serviceName} (${unit}) = ${naira(total)}`,
            form.description.trim(),
          ]
        : [
            form.quantity.trim() && `How many: ${form.quantity.trim()}`,
            form.description.trim(),
          ];
      const { error } = await supabase.from("business_briefs").insert({
        id: briefId,
        company: form.company.trim().slice(0, 160),
        contact_name: form.contact_name.trim().slice(0, 120),
        email: form.email.trim() || null,
        phone: form.phone.trim().slice(0, 40),
        city: form.city.trim().slice(0, 80) || null,
        country: "Nigeria",
        project_title: title.slice(0, 160),
        description:
          details.filter(Boolean).join("\n\n").slice(0, 4000) ||
          "Pay-now order",
        skills_needed: [form.task.trim().slice(0, 80)],
        budget_text: priceFrom
          ? `From ${naira(priceFrom)} ${unit ?? ""}`.trim().slice(0, 160)
          : null,
        timeline: null,
        engagement: "project",
        selection_process: "direct",
      });
      if (error) throw error;
      trackLead(payNow ? "service_pay_now" : "service_order", {
        service: form.task.trim().slice(0, 80),
      });

      let payUrl: string | null = null;
      if (payNow) {
        const { data } = await supabase.functions.invoke(
          "create-service-checkout",
          { body: { briefId, slug, quantity: qty } },
        );
        payUrl = data?.ok && data.payUrl ? String(data.payUrl) : null;
      }
      // The order email carries the pay link when there is one.
      try {
        await notifyHiringRequest({ data: { briefId } });
      } catch {
        /* confirmation email is best-effort */
      }
      if (payUrl) {
        window.location.href = payUrl;
        return;
      }
      setDone("brief");
    } catch (err) {
      toast({
        title: "Could not send your order",
        description:
          err instanceof Error
            ? err.message
            : "Please try again or message us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-center">
        {done === "unpaid" ? (
          <AlertCircle className="mx-auto text-destructive" size={40} />
        ) : (
          <CheckCircle2 className="mx-auto text-link" size={40} />
        )}
        <h2 className="text-xl font-semibold">
          {done === "paid"
            ? "Payment received, thank you"
            : done === "unpaid"
              ? "Payment not completed"
              : "Order received"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {done === "paid"
            ? "We are assigning your task now and will update you by email and WhatsApp until it is delivered."
            : done === "unpaid"
              ? "Your payment was cancelled or did not go through. Your order is saved: use the pay link in your order email to try again, or message us on WhatsApp."
              : "We reply within one working day with a few quick questions and a clear price. For a faster reply, send the same details on WhatsApp."}
        </p>
        <a
          href={talentWhatsAppUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>
            <MessageCircle className="mr-2" size={18} /> Message us now
          </Button>
        </a>
      </div>
    );
  }

  const payNow = mode === "pay" && canPayNow;
  return (
    <form
      id="brief"
      onSubmit={submit}
      className="space-y-4 rounded-lg border border-border bg-card p-6"
    >
      <h2 className="text-lg font-semibold">
        {payNow ? "Order and pay" : "Send a brief"}
      </h2>
      {canPayNow && (
        <div
          className="grid grid-cols-2 gap-2 text-sm"
          role="radiogroup"
          aria-label="How do you want to order?"
        >
          {(["pay", "custom"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md border px-3 py-2 ${mode === m ? "border-link font-medium text-link" : "border-border text-muted-foreground"}`}
            >
              {m === "pay" ? "Standard: pay now" : "Custom: get a quote"}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="sb-company">Business name *</Label>
          <Input
            id="sb-company"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sb-name">Your name *</Label>
          <Input
            id="sb-name"
            value={form.contact_name}
            onChange={(e) => set("contact_name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sb-phone">Phone or WhatsApp *</Label>
          <Input
            id="sb-phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sb-email">Email{payNow ? " *" : ""}</Label>
          <Input
            id="sb-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        {!payNow && (
          <div>
            <Label htmlFor="sb-task">Service *</Label>
            <Input
              id="sb-task"
              value={form.task}
              onChange={(e) => set("task", e.target.value)}
              placeholder="AI video, flyer design, app testing…"
            />
          </div>
        )}
        <div>
          <Label htmlFor="sb-qty">
            How many{unit ? ` (${unit.replace(/^per /, "")})` : ""}?
          </Label>
          <Input
            id="sb-qty"
            type={payNow ? "number" : "text"}
            min={1}
            max={MAX_ORDER_QUANTITY}
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder="e.g. 4 a week"
          />
        </div>
        <div className={payNow ? "sm:col-span-2" : ""}>
          <Label htmlFor="sb-city">City</Label>
          <Input
            id="sb-city"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="sb-desc">
          {payNow
            ? "Anything we should know? (optional)"
            : "What do you need? *"}
        </Label>
        <Textarea
          id="sb-desc"
          rows={payNow ? 3 : 4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      {payNow ? (
        <>
          <p className="text-sm text-muted-foreground">
            {qty} × {naira(priceFrom!)} {unit} ={" "}
            <strong className="text-foreground">{naira(total)}</strong>. Pay by
            card, bank transfer or USSD.
          </p>
          <Button type="submit" className="w-full" disabled={submitting}>
            <CreditCard className="mr-2" size={18} />
            {submitting ? "Preparing payment…" : `Pay now ${naira(total)}`}
          </Button>
        </>
      ) : (
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Send my brief"}
        </Button>
      )}
      <a
        href={talentWhatsAppUrl(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-link hover:underline"
      >
        Rather order on WhatsApp
      </a>
    </form>
  );
};

export default ServiceBriefForm;
