import { Link } from "@/lib/router-compat";
import { GraduationCap, Award, Briefcase, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { departments } from "@/data/departments";

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const HowItWorks = () => {
  const features = [
    {
      step: "01",
      icon: GraduationCap,
      title: "Get Trained",
      description: `Hands-on projects with industry experts across ${departments.length} tech departments.`,
      hint: "Explore courses & pricing",
      to: "/#pricing",
      onClick: scrollTo("pricing"),
    },
    {
      step: "02",
      icon: Award,
      title: "Get Certified",
      description: "A Tech Faculty NG certificate, licensed by FMSTI through NBTI, that any employer can verify online.",
      hint: "Verify a certificate",
      to: "/verify",
    },
    {
      step: "03",
      icon: Briefcase,
      title: "Get Employed",
      description: "100+ partner companies hire graduates who perform. Top students earn from month 3.",
      hint: "Browse jobs & talent",
      to: "/careers",
    },
  ];

  const cardClass =
    "group relative flex flex-col h-full bg-card border border-border rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            From L
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">earn</span>
            er to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Earn</span>
            er; <span className="text-primary">3</span> Steps in <span className="text-primary">3</span> Months.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            <Link to="/outcomes" className="underline hover:text-primary">Over 6,000 students</Link> trained.
            Learn, get certified, and start earning from month 3.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-6">
          <div
            aria-hidden
            className="hidden md:block absolute top-14 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"
          />
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              onClick={f.onClick}
              aria-label={`${f.title}: ${f.hint}`}
              className={cardClass}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center bg-card">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-mono text-muted-foreground">{f.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{f.description}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {f.hint}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg font-semibold text-primary-foreground"
          >
            Start my 3-month glow-up
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
