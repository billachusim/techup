import { Link, Navigate, useParams } from "@/lib/router-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LastUpdated from "@/components/LastUpdated";
import VirtualSiwesOffer from "@/components/siwes/VirtualSiwesOffer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, X } from "lucide-react";
import { departments } from "@/data/departments";
import { SIWES_COURSES_UPDATED, SIWES_GUIDES, getSiwesCourse, siwesCourses } from "@/data/siwesCourses";
import { VIRTUAL_SIWES, formatNaira } from "@/data/virtualSiwes";
import { LOWEST_PAID_PLAN, SIWES_MAX_DISCOUNT_PCT } from "@/lib/fees";

const SITE = "https://techfaculty.ng";

const SiwesCourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const course = slug ? getSiwesCourse(slug) : undefined;

  if (!course) return <Navigate to="/siwes/courses" replace />;

  const url = `${SITE}/siwes/courses/${course.slug}`;
  const deptTitle = (s: string) => departments.find((d) => d.slug === s)?.title ?? s;
  const whatsappHref = `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(
    `Hello Tech Faculty NG, I study ${course.name} and I want to do my SIWES/IT with you. Please send me the details.`,
  )}`;
  const others = siwesCourses.filter((c) => c.slug !== course.slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url,
    dateModified: SIWES_COURSES_UPDATED,
    mainEntity: course.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "SIWES", item: `${SITE}/siwes` },
      { "@type": "ListItem", position: 3, name: "By course", item: `${SITE}/siwes/courses` },
      { "@type": "ListItem", position: 4, name: course.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </>
      <Header />
      <main className="pt-20">
        <section className="px-4 pt-8">
          <div className="container mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/siwes" className="hover:text-primary">SIWES</Link>
              <span className="mx-2">/</span>
              <Link to="/siwes/courses" className="hover:text-primary">By course</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{course.name}</span>
            </nav>
            <Link to="/siwes/courses">
              <Button variant="ghost" size="sm" className="-ml-2 mb-4">
                <ArrowLeft size={16} className="mr-1" /> All courses
              </Button>
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{course.h1}</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">{course.shortAnswer}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-muted-foreground self-center">Also for:</span>
              {course.alsoFor.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
            <LastUpdated date={SIWES_COURSES_UPDATED} className="mb-6" />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} className="mr-2" /> Apply on WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#virtual-siwes">Do it online instead <ArrowRight size={18} className="ml-2" /></a>
              </Button>
            </div>
          </div>
        </section>

        {/* Why it fits */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Why tech work counts as industrial training for your course</h2>
            <p className="text-muted-foreground leading-relaxed">{course.whyItFits}</p>
            <div className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 p-5 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Check with your SIWES coordinator first</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{course.coordinatorCheck}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-2">What you would actually do</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Real work for real clients, reviewed by a mentor every week. Each project runs inside one of our departments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.projects.map((p) => (
                <Card key={p.title} className="h-full">
                  <CardContent className="p-5">
                    <p className="font-semibold mb-2">{p.title}</p>
                    <p className="text-sm text-muted-foreground mb-3">{p.detail}</p>
                    <Link to={`/departments/${p.department}`} className="text-xs text-primary font-medium hover:underline">
                      {deptTitle(p.department)} department
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Logbook */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-2">What your logbook could say</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Weak entries describe attendance. Strong entries describe work your supervisor can sign honestly. These are examples
              of the kind of entry this placement produces.
            </p>
            <div className="space-y-4">
              {course.logbook.map((l) => (
                <div key={l.strong} className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm flex gap-2">
                    <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span><span className="font-semibold">Weak: </span>{l.weak}</span>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span><span className="font-semibold">Strong: </span>{l.strong}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              More on this in our guide to{" "}
              <Link to="/blog/siwes-logbook-mistakes-nigeria-fix" className="text-primary hover:underline">
                SIWES logbook mistakes and how to fix them
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Skills and tools you leave with</h2>
            <div className="flex flex-wrap gap-2">
              {course.skills.map((s) => (
                <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">{s}</Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Ways to do it */}
        <section className="px-4 pb-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">On site or online, and what each costs</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="font-semibold">On site at a Tech Faculty centre</p>
                  <p className="text-sm text-muted-foreground">
                    No separate placement fee. On Learn &amp; Pay you pay your department's regular course fee, from{" "}
                    {formatNaira(LOWEST_PAID_PLAN)}, with up to {SIWES_MAX_DISCOUNT_PCT}% off for SIWES students. On Tutor &amp;
                    Earn, if you are already skilled enough to teach, we pay you.
                  </p>
                  <Link to="/locations" className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                    Find a centre near you <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
              <Card className="border-primary/40">
                <CardContent className="p-5 space-y-2">
                  <p className="font-semibold">Online with Virtual SIWES</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNaira(VIRTUAL_SIWES.placementPriceNGN)} for your full IT, plus{" "}
                    {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} for logbook signing, stamping and two-way courier delivery.
                    Virtual SIWES is charged because it covers online supervision and the waybill.
                  </p>
                  <p className="text-sm text-muted-foreground">{course.virtualFit}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <div id="virtual-siwes" className="px-4 scroll-mt-24">
          <div className="container mx-auto max-w-4xl">
            <VirtualSiwesOffer source={course.slug} channel="siwes-course" />
          </div>
        </div>

        {/* Guides */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">SIWES guides to read next</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {course.guides.map((g) => (
                <Link key={g} to={`/blog/${g}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-5">
                      <p className="font-semibold">{SIWES_GUIDES[g] ?? g}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">{course.name} SIWES questions</h2>
            <div className="space-y-4">
              {course.faqs.map((f) => (
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

        {/* Other courses */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">SIWES for other courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map((c) => (
                <Link key={c.slug} to={`/siwes/courses/${c.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-5">
                      <p className="font-semibold mb-1">{c.name}</p>
                      <p className="text-sm text-muted-foreground">{c.alsoFor.slice(0, 3).join(", ")}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Link to="/siwes/courses" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline mt-4">
              See every course, including computer science <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SiwesCourseDetail;
