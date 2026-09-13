import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, Sparkles, Briefcase, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TalentNav from "@/components/talent/TalentNav";
import { Button } from "@/components/ui/button";
import RoleCard from "@/components/talent/RoleCard";
import { fetchPublishedRoles } from "@/lib/talent";
import { useUser } from "@/contexts/UserContext";

const steps = [
  {
    icon: UserCheck,
    title: "Create your profile",
    body: "Sign up, get your Faculty ID, then add your skills, CV, LinkedIn, availability and expected rate. It takes about five minutes and you can keep improving it.",
  },
  {
    icon: Sparkles,
    title: "Get matched",
    body: "Our matching engine scores your profile against every open role. A human reviews each suggestion before it reaches you, so the matches you see are real.",
  },
  {
    icon: Briefcase,
    title: "Do paid work",
    body: "Take on Tech Faculty roles and client projects — mostly remote, for businesses across Nigeria and Africa.",
  },
];

const Talent = () => {
  const { isLoggedIn } = useUser();
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["talent-roles-published"],
    queryFn: () => fetchPublishedRoles(),
    staleTime: 1000 * 60 * 10,
  });

  const joinHref = isLoggedIn ? "/talent/profile" : "/login?next=/talent/profile";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Faculty Talent Pool | Remote Tech Work in Nigeria</title>
        <meta
          name="description"
          content="Join the Tech Faculty talent pool: build one profile, get matched to paid remote and on-site tech work with businesses across Nigeria and Africa. Free to join."
        />
        <meta property="og:title" content="Tech Faculty Talent Pool | Remote Tech Work in Nigeria" />
        <meta property="og:description" content="One profile, matched to paid tech work with businesses across Nigeria and Africa." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/talent" />
        <link rel="canonical" href="https://techfaculty.ng/talent" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Tech Faculty Talent Pool",
          url: "https://techfaculty.ng/talent",
          description:
            "A vetted pool of Nigerian and African tech talent matched to paid remote and on-site work for local and international businesses.",
          provider: { "@type": "Organization", name: "Tech Faculty", url: "https://techfaculty.ng" },
        })}</script>
      </Helmet>
      <Header />

      <main className="pt-20">
        <TalentNav />
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-5xl space-y-6 text-center">
            <h1 className="text-3xl font-bold md:text-5xl">
              Get paid for your skills. <span className="text-gradient">One profile, real projects.</span>
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Tech Faculty Talent connects trained Nigerian and African talent with businesses that need real work
              done — websites, data, design, marketing, support and AI work. Build your profile once, and we match you
              to openings as they come in.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={joinHref}>
                <Button size="lg">Join the talent pool</Button>
              </Link>
              <Link to="/hire">
                <Button size="lg" variant="outline">
                  <Building2 className="mr-2" size={18} /> I want to hire talent
                </Button>
              </Link>
            </div>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck size={14} /> Free to join. Your CV and contact details are never public.
            </p>
          </div>
        </section>

        <section className="border-y border-border bg-card/40 px-4 py-14">
          <div className="container mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-2xl font-bold">How it works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.title} className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <step.icon size={20} className="text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Open roles</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current Tech Faculty openings and approved client projects.
                </p>
              </div>
              <Link to="/careers" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                Browse all openings <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-lg border border-border bg-card" />
                ))}
              </div>
            ) : roles.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => <RoleCard key={role.id} role={role} />)}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
                New roles are added every week. Create your profile now so you are matched the moment one opens.
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border px-4 py-16">
          <div className="container mx-auto max-w-3xl space-y-4 text-center">
            <h2 className="text-2xl font-bold">Already trained with us?</h2>
            <p className="text-muted-foreground">
              Sign in with the account tied to your Faculty ID and your profile starts half-filled.
            </p>
            <Link to={joinHref}>
              <Button size="lg">Build my talent profile</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Talent;
