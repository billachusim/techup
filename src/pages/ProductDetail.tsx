import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "@/lib/router-compat";
import { apps, getApp, isWebOnly } from "@/data/apps";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/seo";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const app = slug ? getApp(slug) : undefined;
  if (!app) return <NotFound />;

  const others = apps.filter((a) => a.slug !== app.slug);
  const pageUrl = `${SITE_URL}/products/${app.slug}`;
  const appLd = {
    "@context": "https://schema.org",
    "@type": isWebOnly(app) ? "WebApplication" : "MobileApplication",
    name: app.name,
    alternateName: `${app.name}: ${app.tagline}`,
    description: app.summary,
    url: pageUrl,
    operatingSystem: isWebOnly(app)
      ? "Web browser"
      : [app.links.web && "Web", app.links.playstore && "Android", app.links.appstore && "iOS"].filter(Boolean).join(", "),
    applicationCategory: app.category,
    image: app.previewImage ? `${SITE_URL}${app.previewImage}` : undefined,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    installUrl: app.links.playstore ?? app.links.web,
    sameAs: [app.links.web, app.links.playstore, app.links.appstore].filter(Boolean),
    publisher: { "@type": "Organization", name: "Tech Faculty", url: SITE_URL },
    author: { "@type": "Organization", name: app.developer },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: app.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(appLd)}</script>
      <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      <Header />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-link mb-6">
            <ArrowLeft size={14} /> All products
          </Link>

          <Card className="overflow-hidden border-border/50">
            <div className={`h-1.5 bg-gradient-to-r ${app.accent}`} />
            {app.previewImage && (
              <div className="w-full aspect-[2/1] overflow-hidden bg-muted">
                <img src={app.previewImage} alt={`${app.name} preview`} className="w-full h-full object-cover" />
              </div>
            )}
            <CardContent className="p-6 md:p-8 space-y-5">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{app.name}</h1>
                <p className="text-lg text-primary font-medium">{app.tagline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">by {app.developer}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">{app.summary}</p>

              {(app.rating || app.downloads) && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {app.rating && <span className="bg-muted px-2 py-1 rounded">{app.rating}</span>}
                  {app.downloads && <span className="bg-muted px-2 py-1 rounded">{app.downloads} downloads</span>}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {app.links.web && (
                  <Button asChild className="gap-1.5">
                    <a href={app.links.web} target="_blank" rel="noopener noreferrer">
                      {isWebOnly(app) ? `Open ${app.name}` : "Use it on the web"} <ExternalLink size={16} />
                    </a>
                  </Button>
                )}
                {app.links.playstore && (
                  <a href={app.links.playstore} target="_blank" rel="noopener noreferrer" aria-label={`Get ${app.name} on Google Play`} className="inline-block hover:opacity-80">
                    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-[50px] w-auto" />
                  </a>
                )}
                {app.links.appstore && (
                  <a href={app.links.appstore} target="_blank" rel="noopener noreferrer" aria-label={`Download ${app.name} on the App Store`} className="inline-block hover:opacity-80">
                    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-[34px] w-auto mt-2" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 max-w-4xl mt-12" aria-labelledby="features">
          <h2 id="features" className="text-2xl font-bold mb-4">What you can do with {app.name}</h2>
          <ul className="space-y-2">
            {app.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="container mx-auto px-4 max-w-4xl mt-12" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {app.faq.map((f) => (
              <details key={f.q} className="rounded-lg border border-border/50 bg-muted/40 px-4 py-3">
                <summary className="font-semibold cursor-pointer">{f.q}</summary>
                <p className="text-muted-foreground mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-4xl mt-12">
          <h2 className="text-xl font-bold mb-3">More products from us</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/products/${o.slug}`} className="hover:text-link hover:underline">
                  {o.name}: {o.tagline}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetail;
