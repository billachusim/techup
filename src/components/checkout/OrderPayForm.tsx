import { useState } from "react";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { getSupabase } from "@/integrations/supabase/lazy";
import { rememberCheckout, trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import LeadCaptureForm, { type LeadExtraField } from "@/components/leads/LeadCaptureForm";
import { PRODUCTS, type ProductId } from "../../../supabase/functions/_shared/products.ts";

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

type Props = {
  /** What this form sells. */
  product: ProductId;
  /** Offered as a tick-box add-on, paid in the same payment. */
  addOn?: ProductId;
  /** Page the order came from, saved with the lead for attribution. */
  source: string;
  /** Additional questions saved into the order's notes. */
  extraFields?: LeadExtraField[];
};

/**
 * Card / transfer / USSD payment through Flutterwave for Virtual SIWES, the
 * logbook service or the Success Kit. Prices come from the shared product
 * list; create-order-checkout re-prices on the server and sends the buyer to
 * Flutterwave, which returns them to /order-complete.
 */
export function OrderPayForm({ product, addOn, source, extraFields = [] }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [withAddOn, setWithAddOn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items: ProductId[] = addOn && withAddOn ? [product, addOn] : [product];
  const total = items.reduce((n, id) => n + PRODUCTS[id].priceNGN, 0);
  const idFor = (field: string) => `order-${product}-${field}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address for your receipt.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Enter a valid WhatsApp number (at least 10 digits).");
    const missing = extraFields.find((f) => f.required && !extras[f.id]?.trim());
    if (missing) return setError(`Please fill in "${missing.label}".`);

    setSaving(true);
    setError(null);
    const notes = extraFields
      .map((f) => (extras[f.id]?.trim() ? `${f.label}: ${extras[f.id].trim()}` : null))
      .filter(Boolean)
      .join(" | ");
    const supabase = await getSupabase();
    const { data, error: fnError } = await supabase.functions.invoke("create-order-checkout", {
      body: { items, name, email, phone, school, notes, source },
    });
    if (fnError || !data?.url) {
      setSaving(false);
      let message = "We couldn't open the payment page. Please try again, or reserve your slot and pay by transfer.";
      // The function's own message is in the response body when it refused the order.
      const body = await (fnError as { context?: Response } | null)?.context?.json?.().catch(() => null);
      if (body?.error) message = body.error;
      setError(message);
      return;
    }
    const plan = items.map((id) => PRODUCTS[id].name).join(" + ");
    trackEvent("begin_checkout", { value: total, currency: "NGN", items: items.map((id) => ({ item_id: id, item_name: PRODUCTS[id].name })) });
    rememberCheckout({ plan, value: total, currency: "NGN" });
    window.location.href = data.url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor={idFor("name")}>Your name</Label>
          <Input id={idFor("name")} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chisom Okeke" autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idFor("email")}>Email address</Label>
          <Input
            id={idFor("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idFor("phone")}>WhatsApp number</Label>
          <Input
            id={idFor("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0803 000 0000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={idFor("school")}>
            School or institution <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input id={idFor("school")} value={school} onChange={(e) => setSchool(e.target.value)} placeholder="e.g. Nnamdi Azikiwe University" />
        </div>
        {extraFields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <Label htmlFor={idFor(f.id)}>
              {f.label}
              {!f.required && <span className="text-muted-foreground font-normal"> (optional)</span>}
            </Label>
            <Input
              id={idFor(f.id)}
              value={extras[f.id] ?? ""}
              onChange={(e) => setExtras((prev) => ({ ...prev, [f.id]: e.target.value }))}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>

      {addOn && (
        <div className="flex items-start gap-2 text-sm">
          <Checkbox id={idFor("addon")} checked={withAddOn} onCheckedChange={(c) => setWithAddOn(c === true)} />
          <Label htmlFor={idFor("addon")} className="font-normal leading-relaxed">
            Add {PRODUCTS[addOn].name.toLowerCase()} ({formatNaira(PRODUCTS[addOn].priceNGN)})
          </Label>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
        {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <CreditCard size={16} className="mr-2" />}
        Pay {formatNaira(total)} now
      </Button>

      <p className="text-xs text-muted-foreground flex items-start gap-1.5">
        <Lock size={12} className="mt-0.5 shrink-0" />
        Secure payment by card, bank transfer or USSD through Flutterwave. Your receipt goes to your email, and we
        contact you on WhatsApp.
      </p>
    </form>
  );
}

type PayOrReserveProps = Props & {
  /** The existing reserve form, for buyers who would rather pay by transfer to us directly. */
  reserve: React.ComponentProps<typeof LeadCaptureForm>;
};

/** Pay online by default, with the reserve-and-pay-later form one click away. */
export default function PayOrReserve({ reserve, ...pay }: PayOrReserveProps) {
  const [mode, setMode] = useState<"pay" | "reserve">("pay");
  return (
    <div className="space-y-4">
      {mode === "pay" ? <OrderPayForm {...pay} /> : <LeadCaptureForm {...reserve} />}
      <p className="text-xs text-muted-foreground border-t border-border pt-3">
        {mode === "pay" ? "Rather pay by bank transfer to us directly? " : "Rather pay online now? "}
        <button
          type="button"
          className="underline underline-offset-2 hover:text-foreground"
          onClick={() => setMode(mode === "pay" ? "reserve" : "pay")}
        >
          {mode === "pay" ? "Reserve instead and we send the details" : "Pay by card, transfer or USSD"}
        </button>
        .
      </p>
    </div>
  );
}
