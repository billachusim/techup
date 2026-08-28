import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredibilityBanner from "@/components/CredibilityBanner";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Monitor,
  Truck,
  Stamp,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  VIRTUAL_SIWES,
  formatNaira,
  placementIncludes,
  logbookIncludes,
  virtualSteps,
  virtualFaqs,
} from "@/data/virtualSiwes";

const TITLE = "Virtual SIWES Nigeria — Online IT, Logbook Signed";
const DESCRIPTION =
  "Do your SIWES or IT online from any Nigerian city with a licensed host. We review, fill, sign and stamp your logbook, then waybill it back to you — ₦45,000 + ₦15,000.";
const URL = "https://techfaculty.ng/virtual-siwes";

const VirtualSIWES = () => {
  const placementWhatsApp = `Hello Tech Faculty, I want to do Virtual SIWES (online IT). Please send the payment details for the ${formatNaira(
    VIRTUAL_SIWES.placementPriceNGN,
  )} placement fee.`;
  const logbookWhatsApp = `Hello Tech Faculty, I want to book the logbook review, signing and waybill service (${formatNaira(
    VIRTUAL_SIWES.logbookPriceNGN,
  )}). Please send the payment and pickup details.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="virtual SIWES, online SIWES Nigeria, online industrial training Nigeria, SIWES logbook signing, IT logbook stamp, remote IT placement Nigeria"
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Virtual SIWES and IT Logbook Signing Service",
            serviceType: "Online industrial training placement (SIWES/IT)",
            description:
              "Fully online SIWES/IT placement for Nigerian students, with logbook review, filling, signing and stamping handled by two-way courier delivery to our Nnewi headquarters.",
            url: URL,
            areaServed: { "@type": "Country", name: "Nigeria" },
            audience: { "@type": "EducationalAudience", educationalRole: "student" },
            provider: {
              "@type": "EducationalOrganization",
              name: "Tech Faculty NG",
              url: "https://techfaculty.ng",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Technology Incubation Centre",
                addressLocality: "Nnewi",
                addressRegion: "Anambra",
                postalCode: "435101",
                addressCountry: "NG",
              },
            },
            offers: [
              {
                "@type": "Offer",
                name: "Virtual IT placement (full duration)",
                price: VIRTUAL_SIWES.placementPriceNGN,
                priceCurrency: "NGN",
                availability: "https://schema.org/InStock",
                url: URL,
              },
              {
                "@type": "Offer",
                name: "Logbook review, signing, stamping and two-way delivery",
                price: VIRTUAL_SIWES.logbookPriceNGN,
                priceCurrency: "NGN",
                availability: "https://schema.org/InStock",
                url: URL,
              },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: virtualFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
              { "@type": "ListItem", position: 2, name: "SIWES & IT", item: "https://techfaculty.ng/siwes" },
              { "@type": "ListItem", position: 3, name: "Virtual SIWES", item: URL },
            ],
          })}
        </script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted/40">
              <Monitor size={14} /> Online IT placement · open nationwide
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Virtual SIWES in Nigeria — do your IT online, and we sign, stamp and{" "}
              <span className="text-gradient">waybill your logbook back</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              You should not lose a session because there is no approved IT host in your town.
              Complete your industrial training online with a licensed technology institute, do real
              project work every week, then send your logbook and ITF forms to our headquarters by
              delivery. We review, fill, sign and stamp everything and waybill it straight back to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <a href="#reserve-virtual-it">
                  Reserve a virtual IT slot <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#logbook-service">Book logbook signing</a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Virtual IT placement {formatNaira(VIRTUAL_SIWES.placementPriceNGN)} · Logbook service{" "}
              {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} (both waybill legs included)
            </p>
          </div>
        </section>

        <CredibilityBanner />

        {/* Who it's for */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Who virtual IT is built for
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "You are far from any centre",
                  body: "Your school is in a state where we have no campus yet, or relocating for six months is simply not affordable. You work with the same mentors online.",
                },
                {
                  icon: Clock,
                  title: "You are already working or teaching",
                  body: "Part-time, sandwich and working students keep their job and still complete supervised IT, with weekly sessions scheduled around them.",
                },
                {
                  icon: ShieldCheck,
                  title: "Your placement fell through",
                  body: "The company that promised you a slot went quiet weeks before resumption. We can issue an acceptance letter quickly so your session is not wasted.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="border-border">
                    <CardContent className="p-6 space-y-3">
                      <div className="p-3 rounded-xl bg-primary/10 w-fit">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* The two offers */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              What it costs and what you get
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10 text-sm md:text-base">
              Both fees are paid before we start — the placement fee before onboarding, the logbook
              fee before pickup. You submit the form, we send payment details on WhatsApp or email,
              and nothing is ever charged automatically.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Virtual IT placement</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn &amp; Pay or Tutor &amp; Earn, fully online
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold">
                    {formatNaira(VIRTUAL_SIWES.placementPriceNGN)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / full IT duration
                    </span>
                  </p>
                  <ul className="space-y-2">
                    {placementIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <a href="#reserve-virtual-it">Reserve my slot</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Stamp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Logbook &amp; documents service</h3>
                      <p className="text-sm text-muted-foreground">
                        Reviewed, filled, signed, stamped and delivered back
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold">
                    {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / logbook, delivery both ways included
                    </span>
                  </p>
                  <ul className="space-y-2">
                    {logbookIncludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="#logbook-service">Book the pickup</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              How virtual IT and the waybill process work
            </h2>
            <ol className="space-y-6">
              {virtualSteps.map((step, idx) => (
                <li key={step.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-background font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Trust / compliance */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Why your school can accept this placement
            </h2>
            <div className="grid gap-6 md:grid-cols-2 text-sm leading-relaxed">
              <div className="space-y-3">
                <p>
                  Tech Faculty NG is a licensed technology training institute operating under the
                  Federal Ministry of Science, Technology &amp; Innovation via the National Board for
                  Technology Incubation. Our headquarters sits inside the{" "}
                  <strong>{VIRTUAL_SIWES.hqAddress}</strong>, and we run centres in 21 Nigerian
                  cities, so your coordinator can verify a real address, a real licence and real
                  supervisors.
                </p>
                <p>
                  We complete SPE-1, ITF Form 8 and place-of-attachment forms alongside the logbook,
                  and your acceptance letter is written to match exactly what your department
                  approved — remote, hybrid or on site.
                </p>
              </div>
              <div className="space-y-3">
                <p className="flex items-start gap-2">
                  <Truck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Delivery both ways.</strong> Courier pickup from your city and the return
                    waybill are inside the {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} fee — you
                    never travel to Nnewi.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Turnaround.</strong> {VIRTUAL_SIWES.turnaround}, plus courier time. Tell
                    us your submission deadline and we prioritise it.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <strong>Verifiable records.</strong> Attendance, supervision notes and your
                    completion certificate are all documented and verifiable.
                  </span>
                </p>
                <p>
                  Prefer to be in a room with people? Compare our{" "}
                  <Link to="/siwes" className="underline hover:text-primary">
                    on-site SIWES and IT placement tracks
                  </Link>{" "}
                  or find your nearest{" "}
                  <Link to="/locations" className="underline hover:text-primary">
                    Tech Faculty campus
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Forms */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">
            <div id="reserve-virtual-it" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold">Reserve your virtual IT slot</h2>
              <p className="text-sm text-muted-foreground">
                Cohorts are capped so every intern gets mentor time. Submit this and we reply with
                payment details for the {formatNaira(VIRTUAL_SIWES.placementPriceNGN)} placement fee.
              </p>
              <div className="rounded-lg border border-border bg-card p-5">
                <LeadCaptureForm
                  interest="virtual_siwes"
                  source="/virtual-siwes#reserve"
                  submitLabel="Reserve my virtual IT slot"
                  compact
                  whatsappMessage={placementWhatsApp}
                  extraFields={[
                    { id: "department", label: "Course / department", placeholder: "e.g. Computer Science" },
                    { id: "duration", label: "IT duration", placeholder: "e.g. 6 months", required: true },
                    { id: "start", label: "Preferred start date", placeholder: "e.g. September 2026" },
                    {
                      id: "track",
                      label: "Preferred track",
                      placeholder: "Learn & Pay or Tutor & Earn",
                      required: true,
                    },
                  ]}
                />
              </div>
            </div>

            <div id="logbook-service" className="scroll-mt-24 space-y-4">
              <h2 className="text-2xl font-bold">Book logbook review &amp; signing</h2>
              <p className="text-sm text-muted-foreground">
                For virtual interns and anyone who completed IT with us and needs their logbook
                reviewed, filled, signed and stamped. {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)},
                pickup and return delivery included.
              </p>
              <div className="rounded-lg border border-border bg-card p-5">
                <LeadCaptureForm
                  interest="logbook_service"
                  source="/virtual-siwes#logbook"
                  submitLabel="Book my logbook pickup"
                  compact
                  whatsappMessage={logbookWhatsApp}
                  extraFields={[
                    {
                      id: "pickup",
                      label: "Pickup city and address",
                      placeholder: "e.g. Owerri — 12 Wetheral Road",
                      required: true,
                    },
                    {
                      id: "documents",
                      label: "Logbook / forms to be signed",
                      placeholder: "e.g. ITF logbook + SPE-1 + Form 8",
                    },
                    {
                      id: "deadline",
                      label: "Your school submission deadline",
                      placeholder: "e.g. 30 October 2026",
                      required: true,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Virtual SIWES questions students actually ask
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {virtualFaqs.map((faq, idx) => (
                <AccordionItem key={faq.q} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left text-sm md:text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-2xl space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Don't let a logbook decide your session
            </h2>
            <p className="text-muted-foreground">
              Message a coordinator now and we'll tell you honestly whether virtual IT fits your
              school's rules before you pay a naira.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <a
                  href={`https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(placementWhatsApp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2" size={18} />
                  Chat with a coordinator
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/siwes-success-kit">
                  Get the SIWES Success Kit <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VirtualSIWES;
