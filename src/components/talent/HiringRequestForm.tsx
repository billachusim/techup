import { useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseList, talentWhatsAppUrl } from "@/lib/talent";
import { notifyHiringRequest } from "@/lib/public-requests.functions";

/** Compact hiring request form for clients browsing the roles marketplace. */
const HiringRequestForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contact_name: "",
    phone: "",
    email: "",
    project_title: "",
    description: "",
    skills_needed: "",
    engagement: "project",
  });

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const waMessage = `Hello Tech Faculty, I want to hire talent${form.company ? ` for ${form.company}` : ""}.`;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.company.trim() || !form.contact_name.trim() || !form.phone.trim() || !form.project_title.trim() || !form.description.trim()) {
      toast({ title: "Please fill the required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const briefId = crypto.randomUUID();
      const { error } = await supabase
        .from("business_briefs")
        .insert({
          id: briefId,
          company: form.company.trim().slice(0, 160),
          contact_name: form.contact_name.trim().slice(0, 120),
          phone: form.phone.trim().slice(0, 40),
          email: form.email.trim().slice(0, 160) || null,
          country: "Nigeria",
          project_title: form.project_title.trim().slice(0, 160),
          description: form.description.trim().slice(0, 4000),
          skills_needed: parseList(form.skills_needed),
          engagement: form.engagement,
        });
      if (error) throw error;
      setDone(true);
      const data = { id: briefId };
      if (data.id) {
        try {
          await notifyHiringRequest({ data: { briefId: data.id } });
        } catch {
          /* confirmation email is best-effort */
        }
      }
    } catch (err) {
      toast({
        title: "Could not send your request",
        description: err instanceof Error ? err.message : "Please try again or message us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={40} />
        <h3 className="text-xl font-semibold">Request received</h3>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation to your email and our team comes back within two working days with matched talent.
        </p>
        <a href={talentWhatsAppUrl(waMessage)} target="_blank" rel="noopener noreferrer">
          <Button><MessageCircle className="mr-2" size={18} /> Message us now</Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="hr-company">Business name *</Label>
          <Input id="hr-company" value={form.company} onChange={(e) => set("company", e.target.value)} maxLength={160} />
        </div>
        <div>
          <Label htmlFor="hr-name">Your name *</Label>
          <Input id="hr-name" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} maxLength={120} />
        </div>
        <div>
          <Label htmlFor="hr-phone">Phone or WhatsApp *</Label>
          <Input id="hr-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={40} />
        </div>
        <div>
          <Label htmlFor="hr-email">Email (for your confirmation)</Label>
          <Input id="hr-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={160} />
        </div>
      </div>
      <div>
        <Label htmlFor="hr-title">What do you need done? *</Label>
        <Input id="hr-title" value={form.project_title} onChange={(e) => set("project_title", e.target.value)} placeholder="Website and online ordering for my shop" maxLength={160} />
      </div>
      <div>
        <Label htmlFor="hr-description">Describe it *</Label>
        <Textarea id="hr-description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={4000} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="hr-skills">Skills or roles you need</Label>
          <Input id="hr-skills" value={form.skills_needed} onChange={(e) => set("skills_needed", e.target.value)} placeholder="Web developer, designer" maxLength={200} />
        </div>
        <div>
          <Label>Engagement</Label>
          <Select value={form.engagement} onValueChange={(v) => set("engagement", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="project">One project</SelectItem>
              <SelectItem value="ongoing">Ongoing support</SelectItem>
              <SelectItem value="hire">Full-time hire</SelectItem>
              <SelectItem value="intern">Intern or trainee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send hiring request"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        We introduce you to matched talent on WhatsApp. Talent contact details and CVs stay private.
      </p>
    </form>
  );
};

export default HiringRequestForm;
