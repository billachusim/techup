import { useMemo, useState } from "react";
import { Link, useParams } from "@/lib/router-compat";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import ServiceBriefForm from "@/components/services/ServiceBriefForm";
import { Input } from "@/components/ui/input";
import { HOW_IT_WORKS } from "@/components/services/serviceCopy";
import { SITE_URL } from "@/lib/seo";
import { naira } from "@/lib/fees";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  businessPrice,
  getServiceCategory,
  servicesInCategory,
  type Service,
} from "@/data/services";

const ServiceCard = ({ s }: { s: Service }) => (
  <Link
    to={`/services/${s.slug}`}
    className="flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
  >
    <span className="font-medium">{s.name}</span>
    <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
      {s.summary}
    </span>
    <span className="mt-2 text-sm font-semibold text-primary">
      From {naira(businessPrice(s))} {s.unit}
    </span>
  </Link>
);

/**
 * /services (all categories) and /services/category/$slug (one category hub).
 * The category comes from the route param when present.
 */
const Services = () => {
  const { slug } = useParams<{ slug?: string }>();
  const cat = slug ? getServiceCategory(slug) : undefined;
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return null;
    return SERVICES.filter((s) =>
      `${s.name} ${s.summary} ${s.keywords.join(" ")}`
        .toLowerCase()
        .includes(term),
    );
  }, [q]);

  if (slug && !cat) return <NotFound />;

  const list = cat ? servicesInCategory(cat.slug) : SERVICES;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat
      ? `${cat.name} services`
      : "Pay-per-task services for small businesses",
    itemListElement: list.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/services/${s.slug}`,
      name: s.name,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <Header />
      <main className="pt-20">
        <section className="px-4 py-12">
          <div className="container mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px]">
            <div className="space-y-5">
              {cat && (
                <nav className="text-sm text-muted-foreground">
                  <Link to="/services" className="hover:text-link">
                    Services
                  </Link>{" "}
                  › {cat.name}
                </nav>
              )}
              <h1 className="text-3xl font-bold md:text-4xl">
                {cat ? (
                  <>{cat.name} services for small businesses</>
                ) : (
                  <>
                    Get work done{" "}
                    <span className="text-gradient">without hiring anyone</span>
                  </>
                )}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {cat
                  ? cat.intro
                  : `${SERVICES.length}+ pay-per-task services for Nigerian small businesses: videos, social media, field reps, websites, app testing and cybersecurity. Tell us what you need, we assign vetted Tech Faculty talent, and you pay per task delivered.`}
              </p>
              <ul className="space-y-2">
                {HOW_IT_WORKS.map((step) => (
                  <li
                    key={step}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-primary"
                    />{" "}
                    {step}
                  </li>
                ))}
              </ul>
              {cat && (
                <Link
                  to={`/blog/${cat.blogSlug}`}
                  className="inline-flex items-center text-sm font-medium text-link hover:underline"
                >
                  Read the guide <ArrowRight size={14} className="ml-1" />
                </Link>
              )}
            </div>
            <ServiceBriefForm />
          </div>
        </section>

        <section className="border-t border-border px-4 py-10">
          <div className="container mx-auto max-w-6xl space-y-10">
            {!cat && (
              <div className="relative max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <Input
                  className="pl-9"
                  placeholder="Search services: video, flyers, pen test…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            )}

            {filtered ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <ServiceCard key={s.slug} s={s} />
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No match. Send a brief anyway and we will tell you if we can
                    do it.
                  </p>
                )}
              </div>
            ) : (
              (cat ? [cat] : SERVICE_CATEGORIES).map((c) => (
                <div key={c.slug}>
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-semibold">{c.name}</h2>
                    {!cat && (
                      <Link
                        to={`/services/category/${c.slug}`}
                        className="shrink-0 text-sm text-link hover:underline"
                      >
                        All {c.name.toLowerCase()} →
                      </Link>
                    )}
                  </div>
                  {!cat && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      {c.tagline}
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {servicesInCategory(c.slug).map((s) => (
                      <ServiceCard key={s.slug} s={s} />
                    ))}
                  </div>
                </div>
              ))
            )}

            <div className="rounded-lg border border-border bg-muted/40 p-5 text-sm">
              Looking for paid work instead? Every service here is also a{" "}
              <Link
                to="/side-hustles"
                className="font-medium text-link hover:underline"
              >
                pay-per-task side hustle
              </Link>
              , paid weekly. Need someone full time?{" "}
              <Link
                to="/hire"
                className="font-medium text-link hover:underline"
              >
                Hire talent
              </Link>
              .
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
