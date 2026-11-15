import { Link, useParams } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import ServiceBriefForm from "@/components/services/ServiceBriefForm";
import { Badge } from "@/components/ui/badge";
import { HOW_IT_WORKS, SERVICE_FAQS } from "@/components/services/serviceCopy";
import { SITE_URL } from "@/lib/seo";
import { naira } from "@/lib/fees";
import {
  businessPrice,
  getService,
  getServiceCategory,
  servicesInCategory,
} from "@/data/services";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const svc = slug ? getService(slug) : undefined;
  if (!svc) return <NotFound />;
  const cat = getServiceCategory(svc.category)!;
  const price = businessPrice(svc);
  const related = servicesInCategory(svc.category)
    .filter((x) => x.slug !== svc.slug)
    .slice(0, 6);
  const faqs = [...svc.faqs, ...SERVICE_FAQS];
  const url = `${SITE_URL}/services/${svc.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: svc.name,
      serviceType: cat.name,
      description: svc.summary,
      url,
      provider: {
        "@type": "Organization",
        name: "Tech Faculty NG",
        url: SITE_URL,
      },
      areaServed: { "@type": "Country", name: "Nigeria" },
      offers: {
        "@type": "Offer",
        priceCurrency: "NGN",
        price,
        description: `From ${naira(price)} ${svc.unit}`,
        url,
      },
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Services",
          item: `${SITE_URL}/services`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: cat.name,
          item: `${SITE_URL}/services/category/${cat.slug}`,
        },
        { "@type": "ListItem", position: 3, name: svc.name, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <Header />
      <main className="pt-20">
        <section className="px-4 py-12">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <nav className="text-sm text-muted-foreground">
                <Link to="/services" className="hover:text-link">
                  Services
                </Link>{" "}
                ›{" "}
                <Link
                  to={`/services/category/${cat.slug}`}
                  className="hover:text-link"
                >
                  {cat.name}
                </Link>
              </nav>
              <h1 className="text-3xl font-bold md:text-4xl">
                {svc.name} in Nigeria
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {svc.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="text-base">
                  From {naira(price)} {svc.unit}
                </Badge>
                <Badge variant="outline">
                  <Clock size={14} className="mr-1" /> {svc.turnaround}
                </Badge>
                <Badge variant="outline">Pay per task. No contract.</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Good for:</strong> {svc.forWho}
              </p>

              <div>
                <h2 className="mb-3 text-xl font-semibold">What you get</h2>
                <ul className="space-y-2">
                  {svc.deliverables.map((d) => (
                    <li key={d} className="flex gap-2 text-sm">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-primary"
                      />{" "}
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">How it works</h2>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {HOW_IT_WORKS.map((step, i) => (
                    <li key={step}>
                      <strong className="text-foreground">{i + 1}.</strong>{" "}
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-semibold">Questions</h2>
                <div className="space-y-4">
                  {faqs.map((f) => (
                    <div key={f.q}>
                      <h3 className="font-medium">{f.q}</h3>
                      <p className="text-sm text-muted-foreground">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Users size={18} /> Want to earn doing this?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We are taking on {svc.hustleTitle.toLowerCase()}s across
                  Nigeria. Pay per task, paid weekly.
                </p>
                <Link
                  to={`/side-hustles/${svc.slug}`}
                  className="mt-2 inline-flex items-center text-sm font-medium text-link hover:underline"
                >
                  See the side hustle <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <ServiceBriefForm
                serviceName={svc.name}
                priceFrom={price}
                unit={svc.unit}
              />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-border px-4 py-10">
            <div className="container mx-auto max-w-6xl">
              <h2 className="mb-4 text-xl font-semibold">
                More {cat.name.toLowerCase()} services
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/services/${r.slug}`}
                    className="rounded-lg border border-border p-4 hover:border-primary"
                  >
                    <div className="font-medium">{r.name}</div>
                    <div className="text-sm text-muted-foreground">
                      From {naira(businessPrice(r))} {r.unit}
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to={`/blog/${cat.blogSlug}`}
                className="mt-4 inline-block text-sm text-link hover:underline"
              >
                Read: our guide to {cat.name.toLowerCase()} for small businesses
                →
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
