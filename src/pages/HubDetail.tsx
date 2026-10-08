import { useState } from "react";
import { Link, useParams } from "@/lib/router-compat";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Globe2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COURSE_AREA_DEPARTMENT,
  HUB_CITY_CONTEXT,
  HUBS_DISCLAIMER,
  getHub,
  hubWhatsAppUrl,
  hubsInCity,
} from "@/data/techHubs";
import { campuses, getCampusBySlug } from "@/data/campuses";
import { getCityGuideForCity } from "@/data/internalLinks";
import { VIRTUAL_SIWES } from "@/data/virtualSiwes";
import { HYBRID_FEE, LOWEST_PAID_PLAN, PHYSICAL_FEE, naira } from "@/lib/fees";

const HubDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const hub = slug ? getHub(slug) : undefined;
  const [courseArea, setCourseArea] = useState<string>("Not sure yet");

  if (!hub) return <NotFound />;

  const canonical = `https://techfaculty.ng/hubs/${hub.slug}`;
  const title = `${hub.name} — Courses in ${hub.city}`;
  const description = `${hub.name} in ${hub.city}, ${hub.country}: course areas, learning formats and how Tech Faculty helps you choose a track, enrol and get certified — online, hybrid or in person.`;
  const related = hubsInCity(hub.city, hub.slug);
  const cityGuide = hub.country === "Nigeria" ? getCityGuideForCity(hub.city) : undefined;
  const campus =
    (hub.campusSlug && getCampusBySlug(hub.campusSlug)) ||
    (hub.country === "Nigeria" ? campuses.find((c) => c.city === hub.city) : undefined) ||
    (cityGuide?.nearestCampusSlug ? getCampusBySlug(cityGuide.nearestCampusSlug) : undefined);
  const cityContext = HUB_CITY_CONTEXT[hub.city];

  const faqs = [
    {
      q: `What can I study in ${hub.city}?`,
      a: `In ${hub.city} the course areas most commonly available are ${hub.courseAreas.join(", ")}. Tech Faculty NG teaches all of these as structured tracks with a verifiable certificate. Online study is included in the fee, hybrid adds ${naira(HYBRID_FEE)} and weekly on-site classes add ${naira(PHYSICAL_FEE)}.`,
    },
    {
      q: `Is Tech Faculty the same as ${hub.name}?`,
      a: hub.isTechFaculty
        ? `Yes. ${hub.name} is one of our own campuses, so you enrol with Tech Faculty NG directly, study on site with our mentors and receive a Tech Faculty certificate that employers can verify online. You can also take the same departments online or hybrid if you cannot attend every class in person.`
        : `No. ${hub.name} is an independent hub we list so students can compare every option in ${hub.city}, and we do not claim any affiliation with it. Tech Faculty NG is a separate licensed training institute that advises you on a track, teaches it and issues a verifiable certificate.`,
    },
    {
      q: `How do I start if I am in ${hub.city}?`,
      a: `Message us on WhatsApp with the course you want. We confirm the next cohort, the study mode, the fee and the duration, then send enrolment details the same day. Paid departments start from ${naira(LOWEST_PAID_PLAN)} online and run 10 to 20 weeks, and Basic Internet & AI Studies is free.`,
    },
    {
      q: `Can I do my SIWES or industrial training from ${hub.city}?`,
      a: `Yes. We place SIWES students nationwide. If you cannot attend in person, Virtual SIWES costs ${naira(VIRTUAL_SIWES.placementPriceNGN)} for your full placement, with a mentor, weekly live sessions and a placement letter. Our ${naira(VIRTUAL_SIWES.logbookPriceNGN)} logbook service covers courier pickup, signing, stamping and the company sections of your ITF forms.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": hub.isTechFaculty ? "EducationalOrganization" : "Organization",
      name: hub.name,
      description: hub.focus,
      ...(hub.website ? { url: hub.website } : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: hub.city,
        addressRegion: hub.region,
        addressCountry: hub.country,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
        { "@type": "ListItem", position: 2, name: "Tech Hubs", item: "https://techfaculty.ng/hubs" },
        { "@type": "ListItem", position: 3, name: hub.name, item: canonical },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </>

      <Header />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/hubs" className="hover:text-primary">Tech Hubs</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{hub.city}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={hub.isTechFaculty ? "default" : "secondary"}>{hub.type}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {hub.city}, {hub.region}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" /> {hub.country}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{hub.name}</h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{hub.intro}</p>
          </div>
        </section>

        {/* City context and links to the city guide and nearest campus */}
        {(cityGuide || cityContext || campus) && (
          <section className="container mx-auto px-4 mt-8">
            <div className="max-w-3xl space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              <h2 className="text-xl font-bold text-foreground">Learning tech in {hub.city}</h2>
              {cityGuide && (
                <>
                  <p>Local demand in {hub.city} comes mostly from:</p>
                  <div className="flex flex-wrap gap-2">
                    {cityGuide.sectors.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                  <p>
                    Our{" "}
                    <Link to={`/blog/${cityGuide.slug}`} className="text-primary hover:underline">
                      guide to the {hub.city} tech scene
                    </Link>{" "}
                    covers the courses and first projects that fit those sectors.
                  </p>
                </>
              )}
              {cityContext && (
                <>
                  <p>{cityContext}</p>
                  <p>
                    Every Tech Faculty department also runs online, so you can{" "}
                    <Link to="/departments" className="text-primary hover:underline">
                      study a Tech Faculty course from {hub.city}
                    </Link>
                    . For more options across the continent, see{" "}
                    <Link to="/blog/top-tech-hubs-in-africa-where-to-learn-tech-2026" className="text-primary hover:underline">
                      our guide to Africa&apos;s top tech hubs
                    </Link>
                    .
                  </p>
                </>
              )}
              {campus && !hub.isTechFaculty && (
                <p>
                  {campus.city === hub.city
                    ? "Tech Faculty also has its own campus here: "
                    : `There is no Tech Faculty campus in ${hub.city}; the nearest is `}
                  <Link to={`/locations/${campus.slug}`} className="text-primary hover:underline">
                    the Tech Faculty campus in {campus.city}
                  </Link>
                  .
                </p>
              )}
            </div>
          </section>
        )}

        {/* Apply CTA with preloaded payload */}
        <section className="container mx-auto px-4 mt-8">
          <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Tell us what you want to study in {hub.city}
              </h2>
              <p className="text-muted-foreground mb-5">
                Pick a course area and message us. Your WhatsApp message arrives already
                filled in with the course, the city and this hub, so we can answer with
                the exact cohort, fee and duration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="sm:w-72">
                  <Select value={courseArea} onValueChange={setCourseArea}>
                    <SelectTrigger aria-label="Choose a course area">
                      <SelectValue placeholder="Choose a course area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                      {hub.courseAreas.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button asChild size="lg">
                  <a
                    href={hubWhatsAppUrl(hub, courseArea)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" /> Apply on WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Course areas + formats */}
        <section className="container mx-auto px-4 mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-3">Course areas</h2>
              <ul className="space-y-2">
                {hub.courseAreas.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <Link to={`/departments/${COURSE_AREA_DEPARTMENT[c]}`} className="hover:text-primary hover:underline">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-4">
                Tech Faculty teaches each of these as a certified track — see{" "}
                <Link to="/departments" className="text-primary hover:underline">
                  our departments
                </Link>{" "}
                for modules, duration and outcomes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-lg mb-3">How you can study</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {hub.formats.map((f) => (
                  <Badge key={f} variant="secondary">{f}</Badge>
                ))}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Free foundation bootcamp online, open to any city.</li>
                <li>Hybrid and in-person cohorts at our campuses nationwide.</li>
                <li>SIWES and industrial training placement, including a virtual option.</li>
                <li>Verifiable certificates and routing into remote roles.</li>
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {hub.isTechFaculty && hub.campusSlug && (
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/locations/${hub.campusSlug}`}>
                      <Building2 className="w-3.5 h-3.5" /> {hub.city} campus details
                    </Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link to="/virtual-siwes">Virtual SIWES</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/careers">Remote jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How Tech Faculty helps */}
        <section className="container mx-auto px-4 mt-10">
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                How Tech Faculty helps students in {hub.city}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
                <p>
                  <span className="text-foreground font-semibold">Advisory.</span> We help you
                  compare hubs, courses and modes in {hub.city} for free, then recommend the
                  shortest route to a job-ready skill.
                </p>
                <p>
                  <span className="text-foreground font-semibold">Structured teaching.</span>{" "}
                  Licensed by the Federal Ministry of Science, Technology and Innovation via the
                  National Board for Technology Incubation, with <Link to="/outcomes" className="text-primary hover:underline">over 6,000 students trained</Link> and
                  4+ years of training experience.
                </p>
                <p>
                  <span className="text-foreground font-semibold">Certification.</span> Every
                  completed track ends in a certificate you can verify publicly at{" "}
                  <Link to="/verify" className="text-primary hover:underline">
                    techfaculty.ng/verify
                  </Link>
                  .
                </p>
                <p>
                  <span className="text-foreground font-semibold">Placement.</span> SIWES
                  placement, logbook signing and a weekly-updated board of remote AI and tech
                  roles for graduates.
                </p>
              </div>
              {hub.website && (
                <p className="text-sm mt-5">
                  <a
                    href={hub.website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit the {hub.name} website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 mt-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <Card key={f.q}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="container mx-auto px-4 mt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Other options in {hub.city}</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {related.map((r) => (
                <Card key={r.slug}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">
                      <Link to={`/hubs/${r.slug}`} className="hover:text-primary transition-colors">
                        {r.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{r.focus}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 mt-10">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/hubs">
                All tech hubs <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/locations">Our campuses</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6 max-w-3xl">{HUBS_DISCLAIMER}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HubDetail;
