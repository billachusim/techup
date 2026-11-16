import { Link, useParams } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import VisitorStateLine from "@/components/VisitorStateLine";
import { Badge } from "@/components/ui/badge";
import { HUSTLE_STEPS } from "@/components/services/serviceCopy";
import { SITE_URL } from "@/lib/seo";
import { naira } from "@/lib/fees";
import { talentWhatsAppUrl } from "@/lib/talent";
import {
  OPENINGS_PER_SERVICE,
  SERVICES,
  SERVICE_CATEGORIES,
  getService,
  getServiceCategory,
  servicesInCategory,
  talentPay,
} from "@/data/services";

/** Date the side hustles were first listed; used for JobPosting.datePosted. */
const LISTED_ON = "2026-11-15";

const HustleDetail = ({ slug }: { slug: string }) => {
  const svc = getService(slug);
  if (!svc) return <NotFound />;
  const cat = getServiceCategory(svc.category)!;
  const pay = talentPay(svc);
  const waMessage = `Hello Tech Faculty, I want to apply for the ${svc.hustleTitle} side hustle (pay per task).`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: `${svc.hustleTitle} (Pay per Task)`,
    description: `<p>Earn ${naira(pay)} per task as a ${svc.hustleTitle} with Tech Faculty. Businesses order "${svc.name}" (${svc.unit}); you deliver and get paid weekly.</p><p>What you need:</p><ul>${svc.hustleNeeds
      .map((n) => `<li>${n}</li>`)
      .join("")}</ul>`,
    datePosted: LISTED_ON,
    employmentType: ["CONTRACTOR", "PART_TIME"],
    hiringOrganization: {
      "@type": "Organization",
      name: "Tech Faculty NG",
      sameAs: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Nigeria" },
    totalJobOpenings: OPENINGS_PER_SERVICE,
    directApply: true,
    url: `${SITE_URL}/side-hustles/${svc.slug}`,
  };

  return (
    <section className="px-4 py-12">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <div className="container mx-auto max-w-3xl space-y-6">
        <nav className="text-sm text-muted-foreground">
          <Link to="/side-hustles" className="hover:text-link">
            Side hustles
          </Link>{" "}
          › {cat.name}
        </nav>
        <h1 className="text-3xl font-bold md:text-4xl">
          {svc.hustleTitle}: pay-per-task side hustle in Nigeria
        </h1>
        <VisitorStateLine>{(st) => `Open to talent in ${st}: remote tasks plus field work in your area`}</VisitorStateLine>
        <div className="flex flex-wrap gap-3">
          <Badge className="text-base">Earn {naira(pay)} per task</Badge>
          <Badge variant="outline">Paid weekly</Badge>
          <Badge variant="outline">{OPENINGS_PER_SERVICE} openings</Badge>
          <Badge variant="outline">Remote or in your city</Badge>
        </div>
        <p className="leading-relaxed text-muted-foreground">
          Small businesses order{" "}
          <Link
            to={`/services/${svc.slug}`}
            className="text-link hover:underline"
          >
            {svc.name.toLowerCase()}
          </Link>{" "}
          from Tech Faculty ({svc.unit}). You do the work, a Tech Faculty
          manager checks it, and you are paid for every approved task. Take as
          many tasks as you can handle around school, work or business.
        </p>
        <div>
          <h2 className="mb-2 text-xl font-semibold">A typical task</h2>
          <ul className="space-y-1.5">
            {svc.deliverables.map((d) => (
              <li key={d} className="flex gap-2 text-sm">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-link" />{" "}
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">What you need</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {svc.hustleNeeds.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">How to start</h2>
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            {HUSTLE_STEPS.map((s, i) => (
              <li key={s}>
                <strong className="text-foreground">{i + 1}.</strong> {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/talent">
            <Button>
              Apply: join the talent pool{" "}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <a
            href={talentWhatsAppUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <MessageCircle size={16} className="mr-2" /> Apply on WhatsApp
            </Button>
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          No skills yet? Learn them first with a{" "}
          <Link to="/departments" className="text-link hover:underline">
            Tech Faculty course
          </Link>
          , then start earning.
        </p>
      </div>
    </section>
  );
};

const HustleIndex = () => (
  <section className="px-4 py-12">
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold md:text-4xl">
          Pay-per-task <span className="text-gradient">side hustles</span> in
          Nigeria
        </h1>
        <VisitorStateLine>{(st) => `Open to talent in ${st}: remote tasks plus field work in your area`}</VisitorStateLine>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {SERVICES.length} ways to earn from small tasks for real businesses:
          video editing, social media, flyer distribution, app testing, data
          entry, cybersecurity and more. Earn {naira(5_000)} to {naira(10_000)}{" "}
          per task, paid weekly, with {OPENINGS_PER_SERVICE} openings per side
          hustle.
        </p>
        <Link to="/talent">
          <Button>
            Join the talent pool (free){" "}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
      {SERVICE_CATEGORIES.map((c) => (
        <div key={c.slug}>
          <h2 className="mb-3 text-xl font-semibold">{c.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {servicesInCategory(c.slug).map((s) => (
              <Link
                key={s.slug}
                to={`/side-hustles/${s.slug}`}
                className="rounded-lg border border-border bg-card p-4 hover:border-link"
              >
                <div className="font-medium text-link">{s.hustleTitle}</div>
                <div className="text-sm text-foreground">
                  Earn {naira(talentPay(s))} per task · paid weekly
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <p className="text-sm text-muted-foreground">
        Running a business?{" "}
        <Link to="/services" className="text-link hover:underline">
          Order any of these as a service
        </Link>
        .
      </p>
    </div>
  </section>
);

/** /side-hustles and /side-hustles/$slug. */
const SideHustles = () => {
  const { slug } = useParams<{ slug?: string }>();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {slug ? <HustleDetail slug={slug} /> : <HustleIndex />}
      </main>
      <Footer />
    </div>
  );
};

export default SideHustles;
