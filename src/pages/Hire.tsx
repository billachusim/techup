import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TalentNav from "@/components/talent/TalentNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseList, talentWhatsAppUrl } from "@/lib/talent";

const benefits = [
  "Vetted Nigerian and African talent, matched to your brief in 48 hours",
  "Remote by default, on-site available in Anambra, Lagos and Abuja",
  "Start with one small project — no retainer, no platform fee to you",
  "A Tech Faculty project manager oversees delivery end to end",
];

const Hire = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    company: "", contact_name: "", email: "", phone: "", city: "", country: "Nigeria",
    project_title: "", description: "", skills_needed: "", budget_text: "", timeline: "", engagement: "project",
  });

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.contact_name.trim() || !form.phone.trim() || !form.project_title.trim() || !form.description.trim()) {
      toast({ title: "Please fill the required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("business_briefs").insert({
        company: form.company.trim().slice(0, 160),
        contact_name: form.contact_name.trim().slice(0, 120),
        email: form.email.trim() || null,
        phone: form.phone.trim().slice(0, 40),
        city: form.city.trim().slice(0, 80) || null,
        country: form.country.trim() || "Nigeria",
        project_title: form.project_title.trim().slice(0, 160),
        description: form.description.trim().slice(0, 4000),
        skills_needed: parseList(form.skills_needed),
        budget_text: form.budget_text.trim().slice(0, 160) || null,
        timeline: form.timeline.trim().slice(0, 160) || null,
        engagement: form.engagement,
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      toast({
        title: "Could not send your brief",
        description: err instanceof Error ? err.message : "Please try again or message us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const waMessage = `Hello Tech Faculty, I want to hire talent for my business${form.company ? ` (${form.company})` : ""}.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hire Vetted Tech Talent in Nigeria | Tech Faculty</title>
        <meta
          name="description"
          content="Tell us what your business needs and we match you with vetted Nigerian tech talent — developers, data analysts, designers, marketers and support — remote or on-site."
        />
        <meta property="og:title" content="Hire Vetted Tech Talent in Nigeria | Tech Faculty" />
        <meta property="og:description" content="Send a brief and get matched with vetted Nigerian tech talent in 48 hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/hire" />
        <link rel="canonical" href="https://techfaculty.ng/hire" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Hire vetted tech talent",
          serviceType: "Tech talent placement and project delivery",
          provider: { "@type": "Organization", name: "Tech Faculty", url: "https://techfaculty.ng" },
          areaServed: [{ "@type": "Country", name: "Nigeria" }, { "@type": "Place", name: "Africa" }],
          description:
            "Tech Faculty matches businesses in Nigeria and Africa with vetted developers, data analysts, designers, marketers and support talent for remote and on-site work.",
        })}</script>
      </Helmet>
      <Header />

      <main className="pt-20">
        <TalentNav />
        <section className="px-4 py-14">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold md:text-4xl">
                Need tech work done? <span className="text-gradient">We have the people.</span>
              </h1>
              <p className="leading-relaxed text-muted-foreground">
                Tech Faculty trains and vets tech talent across Nigeria and Africa. Tell us the problem — a website that
                does not convert, records still on paper, a dashboard nobody built, marketing nobody runs — and we match
                the right people to it.
              </p>
              <p className="text-sm">
                <Link to="/talent/pool" className="font-medium text-primary hover:underline">
                  Browse the talent directory →
                </Link>
              </p>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" /> {b}
                  </li>
                ))}
              </ul>
              <a href={talentWhatsAppUrl(waMessage)} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <MessageCircle className="mr-2" size={18} /> Rather talk on WhatsApp
                </Button>
              </a>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              {done ? (
                <div className="space-y-4 py-8 text-center">
                  <CheckCircle2 className="mx-auto text-primary" size={40} />
                  <h2 className="text-xl font-semibold">Brief received</h2>
                  <p className="text-sm text-muted-foreground">
                    Our team reviews every brief and comes back within two working days with a shortlist. For a faster
                    reply, send us the same details on WhatsApp.
                  </p>
                  <a href={talentWhatsAppUrl(waMessage)} target="_blank" rel="noopener noreferrer">
                    <Button><MessageCircle className="mr-2" size={18} /> Message us now</Button>
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <h2 className="text-lg font-semibold">Tell us what you need</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="company">Business name *</Label>
                      <Input id="company" value={form.company} onChange={(e) => set("company", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="contact_name">Your name *</Label>
                      <Input id="contact_name" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone or WhatsApp *</Label>
                      <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="project_title">What do you need done? *</Label>
                    <Input id="project_title" value={form.project_title} onChange={(e) => set("project_title", e.target.value)} placeholder="Website and online ordering for my shop" />
                  </div>
                  <div>
                    <Label htmlFor="description">Describe it *</Label>
                    <Textarea id="description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="skills_needed">Skills or roles you think you need</Label>
                    <Input id="skills_needed" value={form.skills_needed} onChange={(e) => set("skills_needed", e.target.value)} placeholder="Web developer, designer" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="budget_text">Budget</Label>
                      <Input id="budget_text" value={form.budget_text} onChange={(e) => set("budget_text", e.target.value)} placeholder="₦300,000" />
                    </div>
                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input id="timeline" value={form.timeline} onChange={(e) => set("timeline", e.target.value)} placeholder="4 weeks" />
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
                    {submitting ? "Sending…" : "Send my brief"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Looking for work instead? <Link to="/talent" className="text-primary hover:underline">Join the talent pool</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Hire;
