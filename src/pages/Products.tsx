import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Monitor, Apple, Smartphone } from "lucide-react";
import palmshopPreview from "@/assets/palmshop-preview.jpg";

type Platform = "playstore" | "appstore" | "web" | "windows" | "mac";

interface Product {
  name: string;
  tagline: string;
  description: string;
  platforms: Platform[];
  links: {
    playstore?: string;
    appstore?: string;
    web?: string;
    windows?: string;
    mac?: string;
  };
  accent: string;
  previewImage?: string;
  rating?: string;
  downloads?: string;
  developer: string;
}

const products: Product[] = [
  {
    name: "Dear Claire",
    tagline: "Secret Confession — Anonymous Diary",
    description:
      "Open up. Write or record your daily situations and get advice in an anonymous secret diary. Or be like Claire — follow someone's diary sessions and comment positive advice to earn Loves convertible to cash.",
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.mobymagic.clairediary",
      appstore: "#",
    },
    accent: "from-pink-500 to-rose-600",
    rating: "4.5★",
    downloads: "10,000+",
    developer: "Social Faculty",
  },
  {
    name: "Alter Ego",
    tagline: "Know All Yourselves",
    description:
      "You are not one personality — you are many. Discover who's running your life today. Alter Ego uses localised intelligence to reveal your strongest alter egos and lets them guide you.",
    platforms: ["playstore", "appstore"],
    links: {
      appstore: "https://apps.apple.com/app/alter-ego-know-all-yourselves/id6759404823",
      playstore: "#",
    },
    accent: "from-violet-500 to-purple-600",
    developer: "Social Faculty",
  },
  {
    name: "Eavesdrop",
    tagline: "Live Conversations",
    description:
      "Tune into live conversations, discover trending topics, and engage with real-time discussions happening around you. A new way to connect and communicate.",
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "#",
      appstore: "#",
    },
    accent: "from-emerald-500 to-teal-600",
    developer: "Social Faculty",
  },
  {
    name: "AiClopedia",
    tagline: "Ask AI Anything",
    description:
      "Your AI-powered encyclopedia — explore, discover, and learn about any topic with intelligent answers. A gateway to the world of knowledge powered by artificial intelligence.",
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "#",
      appstore: "#",
    },
    accent: "from-blue-500 to-cyan-600",
    developer: "Social Faculty",
  },
  {
    name: "PalmShop.ng",
    tagline: "Integrated POS & Payment App",
    description:
      "A multi-platform point-of-sale and payment solution for businesses. Accept payments, manage inventory, and run your business from anywhere — on web, mobile, or desktop.",
    platforms: ["web", "playstore", "appstore", "windows", "mac"],
    links: {
      web: "https://palmshop.ng",
      playstore: "#",
      appstore: "#",
      windows: "#",
      mac: "#",
    },
    accent: "from-orange-500 to-amber-600",
    previewImage: palmshopPreview,
    developer: "Tech Faculty",
  },
  {
    name: "ExamsAI.ng",
    tagline: "AI-Powered Exam Preparation",
    description:
      "Prepare smarter with AI-generated practice questions, study guides, and performance analytics. Designed for Nigerian students and examination bodies.",
    platforms: ["web"],
    links: {
      web: "https://examsai.ng",
    },
    accent: "from-indigo-500 to-blue-600",
    developer: "Tech Faculty",
  },
];

const PlayStoreBadge = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block transition-opacity hover:opacity-80 ${href === "#" ? "opacity-50 pointer-events-none" : ""}`}
    aria-label="Get it on Google Play"
  >
    <img
      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      alt="Get it on Google Play"
      className="h-[50px] w-auto"
    />
  </a>
);

const AppStoreBadge = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block transition-opacity hover:opacity-80 ${href === "#" ? "opacity-50 pointer-events-none" : ""}`}
    aria-label="Download on the App Store"
  >
    <img
      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
      alt="Download on the App Store"
      className="h-[34px] w-auto mt-2"
    />
  </a>
);

const ProductCard = ({ product }: { product: Product }) => (
  <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
    {/* Accent bar */}
    <div className={`h-1.5 bg-gradient-to-r ${product.accent}`} />

    {product.previewImage && (
      <div className="w-full aspect-video overflow-hidden bg-muted">
        <img
          src={product.previewImage}
          alt={`${product.name} preview`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
    )}

    <CardContent className="p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-sm text-primary font-medium">{product.tagline}</p>
        <p className="text-xs text-muted-foreground mt-0.5">by {product.developer}</p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {(product.rating || product.downloads) && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {product.rating && <span className="bg-muted px-2 py-1 rounded">{product.rating}</span>}
          {product.downloads && <span className="bg-muted px-2 py-1 rounded">{product.downloads} downloads</span>}
        </div>
      )}

      {/* Store badges */}
      <div className="flex flex-wrap items-center gap-2">
        {product.links.playstore && <PlayStoreBadge href={product.links.playstore} />}
        {product.links.appstore && <AppStoreBadge href={product.links.appstore} />}
      </div>

      {/* Web & Desktop buttons */}
      <div className="flex flex-wrap gap-2">
        {product.links.web && (
          <Button size="sm" variant="outline" asChild className="gap-1.5">
            <a href={product.links.web} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} /> Visit Website
            </a>
          </Button>
        )}
        {product.links.windows && (
          <Button size="sm" variant="outline" asChild className={`gap-1.5 ${product.links.windows === "#" ? "opacity-50 pointer-events-none" : ""}`}>
            <a href={product.links.windows} target="_blank" rel="noopener noreferrer">
              <Monitor size={14} /> Windows
            </a>
          </Button>
        )}
        {product.links.mac && (
          <Button size="sm" variant="outline" asChild className={`gap-1.5 ${product.links.mac === "#" ? "opacity-50 pointer-events-none" : ""}`}>
            <a href={product.links.mac} target="_blank" rel="noopener noreferrer">
              <Apple size={14} /> macOS
            </a>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Software Products — Tech Faculty NG</title>
        <meta
          name="description"
          content="Explore software products built by Tech Faculty — apps and platforms used by thousands including Dear Claire, Alter Ego, PalmShop.ng, and more."
        />
        <link rel="canonical" href="https://techfaculty.ng/products" />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <Smartphone size={14} /> Software Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Software Products
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Apps and platforms built by Tech Faculty — from social apps with
            100,000+ downloads to business tools powering commerce across Nigeria.
          </p>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>

          {/* Coming soon note */}
          <p className="text-center text-sm text-muted-foreground mt-12">
            More products coming soon. Some download links are pending store
            approval — check back for updates.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Products;
