import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, FileText, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import {
  SUCCESS_KIT,
  formatNaira,
  freeChecklist,
  kitContents,
  kitFaqs,
} from "@/data/successKit";

const SuccessKit = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>SIWES Success Kit — Templates, Logbook &amp; Report Pack</title>
      <meta
        name="description"
        content="Land and finish your SIWES placement properly: free 7-step checklist plus the SIWES Success Kit — placement email templates, student CV, logbook pack and report outline."
      />
      <meta property="og:title" content="SIWES Success Kit | Tech Faculty NG" />
      <meta
        property="og:description"
        content="Free SIWES placement checklist plus a complete digital kit of templates, logbook pack and technical report outline for Nigerian students."
      />
      <meta property="og:type" content="product" />
      <meta property="og:url" content="https://techfaculty.ng/siwes-success-kit" />
      <link rel="canonical" href="https://techfaculty.ng/siwes-success-kit" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: SUCCESS_KIT.name,
          description:
            "Digital kit for Nigerian students on SIWES/industrial training: placement email templates, student CV templates, logbook and weekly report pack, technical report outline, ITF allowance tracker and IT host directory.",
          brand: { "@type": "Brand", name: "Tech Faculty NG" },
          category: "Educational digital download",
          url: "https://techfaculty.ng/siwes-success-kit",
          offers: {
            "@type": "Offer",
            price: SUCCESS_KIT.priceNGN,
            priceCurrency: "NGN",
            availability: "https://schema.org/InStock",
            url: "https://techfaculty.ng/siwes-success-kit",
          },
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: kitFaqs.map((f) => ({
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
            { "@type": "ListItem", position: 2, name: "SIWES", item: "https://techfaculty.ng/siwes" },
            {
              "@type": "ListItem",
              position: 3,
              name: SUCCESS_KIT.name,
              item: "https://techfaculty.ng/siwes-success-kit",
            },
          ],
        })}
      </script>
    </Helmet>

    <Header />

    <main className="pt-20">
      {/* Hero */}
      <section className="py-14 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <div className="inline-block bg-primary/10 text-primary font-semibold text-xs px-3 py-1.5 rounded-full mb-5">
              For Nigerian students on SIWES / IT
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Stop photocopying documents. <span className="text-gradient">Do SIWES properly.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
              {SUCCESS_KIT.tagline} Start with the free 7-step placement checklist, then get the full
              kit of templates, logbook pack and report outline used by students we've placed since
              2022.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Button size="lg" asChild>
                <a href="#free-checklist">
                  <FileText size={18} className="mr-2" />
                  Get the free checklist
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#get-the-kit">
                  Get the full kit — {formatNaira(SUCCESS_KIT.priceNGN)}
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              Built by an FMSTI-licensed training institute that hosts SIWES students across five
              centres.
            </p>
          </div>

          {/* Free checklist preview */}
          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-1">Free preview: the 7-step checklist</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Read it here. Enter your details below and we'll send the printable version.
              </p>
              <ol className="space-y-4">
                {freeChecklist.map((item, i) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm leading-snug">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Free capture */}
      <section id="free-checklist" className="py-14 px-4 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Send me the free checklist</h2>
          <p className="text-muted-foreground mb-6">
            Printable one-pager, free. Choose email or WhatsApp — whichever you actually check.
          </p>
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <LeadCaptureForm
              interest="free_checklist"
              source="page:siwes-success-kit"
              submitLabel="Send me the checklist"
              whatsappMessage="Hello Tech Faculty, please send me the free SIWES placement checklist."
            />
          </div>
        </div>
      </section>

      {/* Paid kit */}
      <section id="get-the-kit" className="py-16 px-4 scroll-mt-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              The complete {SUCCESS_KIT.name}
            </h2>
            <p className="text-muted-foreground">
              Seven resources that cover the whole placement — from the first cold email to the final
              technical report and the job conversation afterwards.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {kitContents.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm leading-snug">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Offer card */}
            <Card className="border-2 border-primary/40 lg:sticky lg:top-24">
              <CardContent className="p-6 space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">One-time payment, yours to keep</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold">
                      {formatNaira(SUCCESS_KIT.priceNGN)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatNaira(SUCCESS_KIT.compareAtNGN)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Introductory student price. Digital download — no shipping.
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-sm mb-1">Reserve your kit</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Leave your details and we confirm your order with payment details. Nothing is
                    charged here.
                  </p>
                  <LeadCaptureForm
                    interest="success_kit"
                    source="page:siwes-success-kit-offer"
                    submitLabel="Reserve my kit"
                    compact
                    whatsappMessage={`Hello Tech Faculty, I want to order the ${SUCCESS_KIT.name} (${formatNaira(SUCCESS_KIT.priceNGN)}).`}
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://wa.me/${SUCCESS_KIT.whatsappNumber}?text=${encodeURIComponent(
                        `Hello Tech Faculty, I have a question about the ${SUCCESS_KIT.name}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Ask a question on WhatsApp
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Questions students ask</h2>
          <Accordion type="single" collapsible className="w-full">
            {kitFaqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">Need the placement itself?</h2>
          <p className="text-muted-foreground">
            We host SIWES students across Nnewi, Onitsha/Awada, Enugu, Aba and Owerri on our Learn &amp;
            Pay and Tutor &amp; Earn tracks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/siwes">
                Explore SIWES placements <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/opportunities">Browse opportunities board</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default SuccessKit;
