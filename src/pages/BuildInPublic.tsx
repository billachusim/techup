import { useState } from "react";
import { Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, EyeOff, Megaphone, Sparkles } from "lucide-react";
import {
  faqs,
  keepPrivate,
  postTemplates,
  routine,
  thirtyDayPlan,
  whatToShare,
  whyPoints,
} from "@/data/buildInPublic";

const TemplateCard = ({ label, text }: { label: string; text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{label}</h3>
          <Button size="sm" variant="outline" onClick={copy} aria-label={`Copy the ${label} template`}>
            {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <pre className="flex-1 whitespace-pre-wrap rounded-lg bg-muted p-3 font-sans text-sm text-muted-foreground">{text}</pre>
      </CardContent>
    </Card>
  );
};

const BuildInPublic = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <section className="border-b bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium">
            <Megaphone className="h-3.5 w-3.5 text-primary" /> Student guide
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Build in public: turn every class into your portfolio
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Employers and clients want to see what you can build, not just a certificate. Share each class task
            as you go, and by the end of your course you will have a public portfolio of real work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="/#free-bootcamp">Start the Free AI Course</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">Go to my class tasks</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold">Why build in public?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {whyPoints.map((p) => (
            <Card key={p.title}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-bold">The routine for every class</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {routine.map((r, i) => (
              <li key={r.step} className="flex gap-4 rounded-xl border bg-background p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{r.step}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold">Copy a post template</h2>
        <p className="mt-2 text-muted-foreground">Replace the parts in curly brackets with your own words.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {postTemplates.map((t) => (
            <TemplateCard key={t.id} label={t.label} text={t.text} />
          ))}
        </div>
      </section>

      <section className="container mx-auto grid max-w-5xl gap-6 px-4 pb-14 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="h-5 w-5 text-primary" /> What to share
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {whatToShare.map((w) => (
                <li key={w} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <EyeOff className="h-5 w-5 text-primary" /> Keep these private
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {keepPrivate.map((k) => (
                <li key={k} className="flex gap-2">
                  <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /> {k}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40">
        <div className="container mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-bold">Your first 30 days</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {thirtyDayPlan.map((w) => (
              <div key={w.week} className="rounded-xl border bg-background p-5">
                <p className="text-sm font-semibold text-primary">{w.week}</p>
                <p className="mt-2 text-sm text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            When you have a few projects, add them to your{" "}
            <Link to="/talent" className="text-link underline">Tech Faculty talent profile</Link> so businesses hiring
            through us can see them, and browse <Link to="/side-hustles" className="text-link underline">side hustles</Link>{" "}
            you can start earning from.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border p-5">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default BuildInPublic;
