import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProductCard from "@/components/store/ProductCard";
import ProductDialog from "@/components/store/ProductDialog";
import {
  storeProducts,
  STORE_CATEGORIES,
  storeWhatsAppUrl,
  formatNaira,
  type StoreProduct,
  type StoreCategory,
} from "@/data/storeProducts";
import { MessageCircle, Truck, MapPin, Banknote, Search, ShieldCheck } from "lucide-react";

const CANONICAL = "https://techfaculty.ng/tech-store";

const faqs = [
  {
    q: "How do I buy from the Tech Faculty tech store?",
    a: "Tap “Order on WhatsApp” on any product. That opens a chat with the product and price already written in the message. We confirm availability, take your delivery address, agree payment, and dispatch. No account or online checkout needed.",
  },
  {
    q: "Do you deliver nationwide in Nigeria?",
    a: "Yes. We deliver to every state in Nigeria through trusted courier partners. Delivery is usually 1–2 working days within the South East and Lagos, and 2–4 working days to other states. Delivery fees depend on your location and the size of the item, and we tell you the exact amount on WhatsApp before you pay.",
  },
  {
    q: "Is pay on delivery available?",
    a: "Yes, pay on delivery is available for most locations and most items. For high-value items such as laptops, we may ask for a part payment to cover logistics, and you pay the balance when the item reaches you. We confirm what applies to your order on WhatsApp.",
  },
  {
    q: "Can I pick up my order instead of paying for delivery?",
    a: "Yes. You can pick up at our Nnewi headquarters or at any Technology Incubation Centre where we operate — including Onitsha, Awka, Enugu, Owerri, Aba, Abakaliki, Abuja, Lagos and other major cities. Pickup is free.",
  },
  {
    q: "What is the Battery Bank power bank and why is it different?",
    a: "Battery Bank is a power bank assembled by our Hardware & Robotics Department in Nnewi. Instead of a sealed battery that dies and becomes waste, you open it and replace the 18650 or AA batteries yourself, so one casing lasts for years. It also comes with a one-year battery replacement guarantee at our centres.",
  },
  {
    q: "Are the laptops new or used?",
    a: "Our student laptops are tested, refurbished business-class machines (commonly called UK-used). Each one is cleaned, battery-checked and set up with Windows, VS Code, Python and Chrome before dispatch, and comes with three months of hardware support from Tech Faculty NG.",
  },
  {
    q: "Do Tech Faculty students get a discount?",
    a: "Yes. Send your Faculty ID in the WhatsApp chat and we apply the current student price on accessories and learning kits before you pay.",
  },
  {
    q: "Can I order in bulk for a school, church or company?",
    a: "Yes. We handle bulk orders of custom phone cases, robotics kits, headsets and laptops for schools, churches, companies and NGOs, with bulk pricing and invoices. Message us with the quantity and we send a quote.",
  },
  {
    q: "Do the products have a warranty?",
    a: "Accessories carry a 7-day replacement window for defects, laptops carry three months of hardware support, and Battery Bank carries a one-year battery replacement guarantee. Keep your receipt or WhatsApp order chat as proof of purchase.",
  },
];

const TechStore = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StoreCategory | "All">("All");
  const [active, setActive] = useState<StoreProduct | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return storeProducts.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.keywords.some((keyword) => keyword.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const cheapest = Math.min(...storeProducts.map((p) => p.price));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech Faculty NG Tech Store — Affordable Tech Products in Nigeria",
    numberOfItems: storeProducts.length,
    itemListElement: storeProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.shortDescription,
        category: product.category,
        brand: { "@type": "Brand", name: "Tech Faculty NG" },
        image: product.images.map((image) =>
          image.src.startsWith("http") ? image.src : `https://techfaculty.ng${image.src}`,
        ),
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "NGN",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: CANONICAL,
          areaServed: { "@type": "Country", name: "Nigeria" },
          seller: { "@type": "Organization", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
        },
      },
    })),
  };

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Tech Faculty NG Tech Store",
    description:
      "Affordable tech products in Nigeria — locally assembled power banks, student laptops, laptop accessories, custom phone cases and robotics kits. Order on WhatsApp with nationwide delivery and pay on delivery.",
    url: CANONICAL,
    telephone: "+2348068597140",
    currenciesAccepted: "NGN",
    paymentAccepted: "Cash on delivery, Bank transfer",
    priceRange: `${formatNaira(cheapest)}+`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Technology Incubation Centre, NBTI South-East Zonal Office",
      addressLocality: "Nnewi",
      addressRegion: "Anambra",
      postalCode: "435101",
      addressCountry: "NG",
    },
    areaServed: { "@type": "Country", name: "Nigeria" },
    parentOrganization: { "@type": "Organization", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng" },
      { "@type": "ListItem", position: 2, name: "Tech Store", item: CANONICAL },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Store Nigeria — Power Banks, Laptops & Accessories | Tech Faculty</title>
        <meta
          name="description"
          content="Buy affordable tech in Nigeria: locally assembled Battery Bank power banks, student laptops, laptop accessories, custom phone cases and robotics kits. Order on WhatsApp — nationwide delivery, pay on delivery."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Tech Store Nigeria — Power Banks, Laptops & Accessories" />
        <meta
          property="og:description"
          content="Affordable tech products in Naira, assembled and printed in Nigeria. Order on WhatsApp with nationwide delivery and pay on delivery."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tech Store Nigeria — Power Banks, Laptops & Accessories" />
        <meta
          name="twitter:description"
          content="Buy power banks, laptops, accessories and robotics kits in Naira. Order on WhatsApp, pay on delivery, nationwide."
        />
        <script type="application/ld+json">{JSON.stringify(storeSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 py-10">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Tech Store</span>
          </nav>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              Prices in Naira · Order on WhatsApp
            </Badge>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              Tech Store — Affordable Tech Gear in Nigeria
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The everyday tech Nigerians actually search for: our locally assembled Battery Bank power bank,
              tested student laptops, laptop accessories, custom phone cases printed in Nigeria, and robotics
              kits from our Hardware &amp; Robotics department. Pick what you need, message us on WhatsApp, and
              we deliver.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-primary" /> Nationwide delivery
              </span>
              <span className="flex items-center gap-2">
                <Banknote size={16} className="text-primary" /> Pay on delivery available
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Pickup at Technology Incubation Centres
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" /> Tested before dispatch
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a
                  href={storeWhatsAppUrl(
                    "Hello Tech Faculty, I want to buy from your tech store. Please send me what is currently available and prices.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2" size={18} /> Chat with a sales rep
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/locations">Find a pickup centre</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Search & filter */}
        <section className="container mx-auto px-4" aria-label="Search and filter products">
          <div className="rounded-xl border border-border/70 bg-card p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search power bank, laptop, phone case, headset…"
                aria-label="Search products"
                className="pl-9"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["All", ...STORE_CATEGORIES] as const).map((option) => (
                <Button
                  key={option}
                  size="sm"
                  variant={category === option ? "default" : "outline"}
                  onClick={() => setCategory(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="container mx-auto px-4 py-10" aria-label="Products">
          <h2 className="mb-6 text-2xl font-bold">
            {category === "All" ? "All products" : category}{" "}
            <span className="text-base font-normal text-muted-foreground">({filtered.length})</span>
          </h2>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground">
                Nothing matches that search. Tell us what you need on WhatsApp and we will source it for you.
              </p>
              <Button asChild className="mt-4">
                <a
                  href={storeWhatsAppUrl(
                    `Hello Tech Faculty, I am looking for: ${query || "a specific tech product"}. Can you source it for me?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2" size={18} /> Request it on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} onOpenDetails={setActive} />
              ))}
            </div>
          )}
        </section>

        {/* How ordering works */}
        <section className="container mx-auto px-4 py-10" aria-label="How ordering works">
          <h2 className="text-2xl font-bold">How ordering works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Message us on WhatsApp",
                body: "Tap “Order on WhatsApp” on any product. The product name and price are already in the message — just hit send.",
              },
              {
                step: "2",
                title: "Confirm details & payment",
                body: "We confirm stock, delivery cost to your location, and how you want to pay: bank transfer, or pay on delivery where available.",
              },
              {
                step: "3",
                title: "Delivery or free pickup",
                body: "We dispatch nationwide within 1–4 working days, or you collect free at any Technology Incubation Centre near you.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border/70 bg-card p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Delivery & pickup */}
        <section className="container mx-auto px-4 py-10" aria-label="Delivery, payment and pickup">
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-6 md:p-8">
            <h2 className="text-2xl font-bold">Delivery, payment &amp; pickup</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Truck size={18} className="text-primary" /> Nationwide delivery
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We ship to all 36 states and the FCT. 1–2 working days across the South East and Lagos, 2–4
                  working days elsewhere. You get the exact delivery fee before you pay anything.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Banknote size={18} className="text-primary" /> Pay on delivery
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pay on delivery is available for most locations and items. For high-value items like laptops we
                  may take a part payment for logistics, and you settle the balance on arrival.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <MapPin size={18} className="text-primary" /> Free centre pickup
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Collect free from our Nnewi headquarters or any Technology Incubation Centre we operate from —
                  Onitsha, Awka, Enugu, Owerri, Aba, Abakaliki, Abuja, Lagos and more.{" "}
                  <Link to="/locations" className="text-primary underline">
                    See all centres
                  </Link>
                  .
                </p>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Studying with us? Send your Faculty ID in the chat to get the current student price on accessories
              and learning kits.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-10" aria-label="Frequently asked questions">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-10">
          <div className="rounded-2xl border border-border/70 bg-card p-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to order?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Send one message and we handle the rest — availability, delivery to your address or free pickup, and
              payment on delivery where available.
            </p>
            <Button asChild size="lg" className="mt-6">
              <a
                href={storeWhatsAppUrl(
                  "Hello Tech Faculty, I want to place an order from your tech store. Please help me.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2" size={18} /> Order on WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>

      <ProductDialog product={active} onOpenChange={(open) => !open && setActive(null)} />
      <Footer />
    </div>
  );
};

export default TechStore;
