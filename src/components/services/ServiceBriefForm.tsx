import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
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

type Props = {
  /** Pre-selected service; omit on hub pages so the visitor names the task. */
  serviceName?: string;
  priceFrom?: number;
  unit?: string;
};

/** "Send a brief" for pay-per-task services. Stored as a business brief, like /hire. */
const ServiceBriefForm = ({ serviceName, priceFrom, unit }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    phone: "",
    email: "",
    city: "",
    task: serviceName ?? "",
    quantity: "",
    description: "",
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const waMessage = `Hello Tech Faculty, I want to order ${form.task || serviceName || "a pay-per-task service"}${form.company ? ` for ${form.company}` : ""}.`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.company.trim() ||
      !form.contact_name.trim() ||
      !form.phone.trim() ||
      !form.task.trim() ||
      !form.description.trim()
    ) {
      toast({
        title: "Please fill the required fields",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const briefId = crypto.randomUUID();
      const supabase = await getSupabase();
      const { error } = await supabase.from("business_briefs").insert({
        id: briefId,
        company: form.company.trim().slice(0, 160),
        contact_name: form.contact_name.trim().slice(0, 120),
        email: form.email.trim() || null,
        phone: form.phone.trim().slice(0, 40),
        city: form.city.trim().slice(0, 80) || null,
        country: "Nigeria",
        project_title: `Service order: ${form.task.trim()}`.slice(0, 160),
        description: [
          form.quantity.trim() && `How many: ${form.quantity.trim()}`,
          form.description.trim(),
        ]
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 4000),
        skills_needed: [form.task.trim().slice(0, 80)],
        budget_text: priceFrom
          ? `From ${naira(priceFrom)} ${unit ?? ""}`.trim().slice(0, 160)
          : null,
        timeline: null,
        engagement: "project",
        selection_process: "direct",
      });
      if (error) throw error;
      trackLead("service_order", { service: form.task.trim().slice(0, 80) });
      setDone(true);
      try {
        await notifyHiringRequest({ data: { briefId } });
      } catch {
        /* confirmation email is best-effort */
      }
    } catch (err) {
      toast({
        title: "Could not send your brief",
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
        <CheckCircle2 className="mx-auto text-primary" size={40} />
        <h2 className="text-xl font-semibold">Brief received</h2>
        <p className="text-sm text-muted-foreground">
          We confirm the price and start date within one working day. For a
          faster reply, send the same details on WhatsApp.
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

  return (
    <form
      id="brief"
      onSubmit={submit}
      className="space-y-4 rounded-lg border border-border bg-card p-6"
    >
      <h2 className="text-lg font-semibold">Send a brief</h2>
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
          <Label htmlFor="sb-email">Email</Label>
          <Input
            id="sb-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sb-task">Service *</Label>
          <Input
            id="sb-task"
            value={form.task}
            onChange={(e) => set("task", e.target.value)}
            placeholder="AI video, flyer design, app testing…"
          />
        </div>
        <div>
          <Label htmlFor="sb-qty">
            How many{unit ? ` (${unit.replace(/^per /, "")})` : ""}?
          </Label>
          <Input
            id="sb-qty"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            placeholder="e.g. 4 a week"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="sb-city">City</Label>
          <Input
            id="sb-city"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="sb-desc">What do you need? *</Label>
        <Textarea
          id="sb-desc"
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send my brief"}
      </Button>
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
