import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Cloud, Rocket, MessageSquare, Layout, Database, Globe } from "lucide-react";
import heroImage from "@/assets/lovable-hero.jpg";

// Update this single constant to swap in your Lovable referral / affiliate URL
const LOVABLE_REFERRAL_URL = "https://lovable.dev/?via=YOUR_REFERRAL_CODE";

const Lovable = () => {
  return (
    <>
      <Helmet>
        <title>Build Apps with Lovable | Tech Faculty</title>
        <meta
          name="description"
          content="Tech Faculty recommends Lovable — the AI platform we use to build production web apps. Describe what you want, ship in minutes."
        />
        <link rel="canonical" href="https://techfaculty.ng/lovable" />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4">
                <Sparkles size={14} /> Recommended by Tech Faculty
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Build Apps with AI — Powered by Lovable
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Lovable is the AI platform we use to ship real production apps —
                including parts of this very website. Describe what you want, iterate in
                plain English, and publish in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 gap-2">
                  <a href={LOVABLE_REFERRAL_URL} target="_blank" rel="noopener noreferrer">
                    Start Building on Lovable <ArrowRight size={16} />
                  </a>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <img
                src={heroImage}
                alt="Build apps with AI on Lovable"
                width={1280}
                height={736}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* What you can build */}
        <section className="container mx-auto px-4 max-w-6xl mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">What you can build</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Globe, label: "Marketing sites" },
              { icon: Layout, label: "Dashboards" },
              { icon: Database, label: "SaaS products" },
              { icon: Rocket, label: "Internal tools" },
            ].map(({ icon: Icon, label }) => (
              <Card key={label} className="border-border/60">
                <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-medium">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Lovable */}
        <section className="container mx-auto px-4 max-w-6xl mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Why Lovable</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: MessageSquare, title: "Chat to code", desc: "Describe features in plain English and watch them appear in your live preview." },
              { icon: Cloud, title: "Full-stack with Cloud", desc: "Database, auth, storage and edge functions built in — no separate setup." },
              { icon: Zap, title: "Instant publish", desc: "Ship to a free .lovable.app domain or connect your own custom domain." },
              { icon: Rocket, title: "Real production code", desc: "React, TypeScript and Tailwind under the hood — own your code on GitHub." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border/60">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 max-w-5xl mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Describe", desc: "Tell Lovable what you want to build in your own words." },
              { n: "2", title: "Iterate", desc: "See changes live and refine through chat — no setup." },
              { n: "3", title: "Publish", desc: "One click to share or connect your own domain." },
            ].map(({ n, title, desc }) => (
              <Card key={n} className="border-border/60">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background flex items-center justify-center mx-auto font-bold">
                    {n}
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 max-w-4xl mt-20">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] p-10 text-center text-background">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to build with AI?</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Sign up for Lovable through our link and start shipping today.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <a href={LOVABLE_REFERRAL_URL} target="_blank" rel="noopener noreferrer">
                Start Building on Lovable <ArrowRight size={16} />
              </a>
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Disclosure: We may earn a referral reward when you sign up through our link.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Lovable;