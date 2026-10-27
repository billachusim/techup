import { Link } from "@/lib/router-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LastUpdated from "@/components/LastUpdated";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, MapPin, MessageCircle } from "lucide-react";
import { campuses } from "@/data/campuses";
import { departments } from "@/data/departments";
import { SIWES_COURSES_UPDATED, SIWES_GUIDES, siwesCourseGuides, siwesCourses } from "@/data/siwesCourses";
import { VIRTUAL_SIWES, formatNaira } from "@/data/virtualSiwes";
import { SIWES_MAX_DISCOUNT_PCT } from "@/lib/fees";

const SITE = "https://techfaculty.ng";
const PAGE_URL = `${SITE}/siwes/courses`;

const deptTitle = (s: string) => departments.find((d) => d.slug === s)?.title ?? s;

const faqs = [
  {
    q: "Can I do SIWES in a tech company if I don't study computer science?",
    a: "Often, yes. Schools accept a host that is real, registered, relevant to your course and willing to supervise you. Engineering, mass communication, statistics, business and OTM students can all do relevant work in a tech setting, from embedded systems to content, data and digital office work. Your department makes the final decision, so confirm with your SIWES coordinator first.",
  },
  {
    q: "How much does SIWES at Tech Faculty NG cost for my course?",
    a: `The same for every course. On-site SIWES has no separate placement fee: on Learn & Pay you pay your department's regular course fee with up to ${SIWES_MAX_DISCOUNT_PCT}% off for SIWES students, and Tutor & Earn pays you. Virtual SIWES costs ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} for the full placement, plus ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} for the logbook service.`,
  },
  {
    q: "My course is not listed. Can I still apply?",
    a: "Yes. Message us on WhatsApp with your course and what your department expects, and we tell you honestly whether the work we can supervise is relevant. If it is not, we say so, so you can find a better host in time.",
  },
];

const SiwesCourses = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: PAGE_URL,
    dateModified: SIWES_COURSES_UPDATED,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SIWES placements by course of study",
    url: PAGE_URL,
    itemListElement: siwesCourses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.h1,
      url: `${SITE}/siwes/courses/${c.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "SIWES", item: `${SITE}/siwes` },
      { "@type": "ListItem", position: 3, name: "By course", item: PAGE_URL },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <>
        <script type="application/ld+json">{JSON.stringify(listSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </>
      <Header />
      <main className="pt-20">
        <section className="px-4 pt-8 pb-10">
          <div className="container mx-auto max-w-5xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/siwes" className="hover:text-primary">SIWES</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">By course</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">SIWES placements by course of study</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-4">
              A tech placement is not only for computer science students. Pick your course to see the real work you would do
              at Tech Faculty NG, what your logbook could say, what to confirm with your SIWES coordinator, and whether doing
              it online makes sense.
            </p>
            <LastUpdated date={SIWES_COURSES_UPDATED} />
          </div>
        </section>

        {/* Courses */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siwesCourses.map((c) => (
                <Link key={c.slug} to={`/siwes/courses/${c.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <p className="text-lg font-semibold mb-1">{c.name}</p>
                      <p className="text-xs text-muted-foreground mb-3">{c.alsoFor.join(" · ")}</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {c.projects.slice(0, 2).map((p) => p.title).join(", ")} and more.
                      </p>
                      <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                        See the placement <ArrowRight size={14} />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {siwesCourseGuides.map((g) => (
                <Link key={g.slug} to={`/blog/${g.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <p className="text-lg font-semibold mb-1">{g.name}</p>
                      <p className="text-xs text-muted-foreground mb-3">{g.alsoFor}</p>
                      <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                        <BookOpen size={14} /> Read the full guide
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* At a glance */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">At a glance: your course and the work that fits it</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-3 font-semibold">Course</th>
                    <th className="p-3 font-semibold">Example project</th>
                    <th className="p-3 font-semibold">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {siwesCourses.map((c) => (
                    <tr key={c.slug} className="border-t border-border align-top">
                      <td className="p-3">
                        <Link to={`/siwes/courses/${c.slug}`} className="text-primary hover:underline">{c.name}</Link>
                      </td>
                      <td className="p-3 text-muted-foreground">{c.projects[0].title}</td>
                      <td className="p-3">
                        <Link to={`/departments/${c.projects[0].department}`} className="hover:text-primary">
                          {deptTitle(c.projects[0].department)}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Costs */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-5xl grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="font-semibold">On site: no placement fee</p>
                <p className="text-sm text-muted-foreground">
                  Learn &amp; Pay students pay their department's regular course fee with up to {SIWES_MAX_DISCOUNT_PCT}% off for
                  SIWES. Tutor &amp; Earn students get paid.
                </p>
                <Link to="/siwes" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                  How on-site SIWES works <ArrowRight size={14} />
                </Link>
              </CardContent>
            </Card>
            <Card className="border-primary/40">
              <CardContent className="p-6 space-y-2">
                <p className="font-semibold">Online: Virtual SIWES {formatNaira(VIRTUAL_SIWES.placementPriceNGN)}</p>
                <p className="text-sm text-muted-foreground">
                  Full placement from any Nigerian city, plus {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} for logbook signing,
                  stamping and two-way courier delivery.
                </p>
                <Link to="/virtual-siwes" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                  How Virtual SIWES works <ArrowRight size={14} />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* By city */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-2">SIWES near you</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Every centre takes SIWES students each session. Each city page lists the institutions we commonly host from.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {campuses.map((c) => (
                <Link
                  key={c.slug}
                  to={`/locations/${c.slug}#siwes`}
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/50 hover:text-primary"
                >
                  <MapPin size={14} className="shrink-0" /> SIWES in {c.city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Guides */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">SIWES guides</h2>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm">
              {Object.entries(SIWES_GUIDES).map(([slug, label]) => (
                <li key={slug}>
                  <Link to={`/blog/${slug}`} className="text-primary hover:underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 pb-12">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold mb-4">Questions about SIWES by course</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <Card key={f.q}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold mb-3">Not sure your course fits?</h2>
            <p className="text-muted-foreground mb-6">
              Tell us your course and what your department expects. We reply with an honest answer.
            </p>
            <Button size="lg" asChild>
              <a
                href={`https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Tech Faculty NG, I want to do my SIWES/IT with you. My course is: ",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} className="mr-2" /> Ask on WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SiwesCourses;
