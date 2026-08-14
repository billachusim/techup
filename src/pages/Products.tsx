import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Smartphone } from "lucide-react";
import dearClaireCover from "@/assets/dear-claire-cover.png.asset.json";
import aiclopediaCover from "@/assets/aiclopedia-cover.png.asset.json";
import alterEgoCover from "@/assets/alter-ego-cover.png.asset.json";
import eavesdropCover from "@/assets/eavesdrop-cover.png.asset.json";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

type Platform = "playstore" | "appstore";

interface Product {
  name: string;
  tagline: string;
  description: string;
  platforms: Platform[];
  links: {
    playstore?: string;
    appstore?: string;
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
    tagline: "Secret Diary Chat",
    description:
      "Speak freely, get real advice, feel understood. Write or record your day in a 100% anonymous secret diary and receive kind, honest perspectives. Or be like Claire — follow other diaries, give positive advice, and earn Loves you can convert to cash.",
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.mobymagic.clairediary",
      appstore: "https://apps.apple.com/ng/app/dear-claire-secret-diary-chat/id1635333304",
    },
    accent: "from-pink-500 to-rose-600",
    previewImage: dearClaireCover.url,
    rating: "4.5★",
    downloads: "1M+",
    developer: "Social Faculty",
  },
  {
    name: "Alter Ego",
    tagline: "Private Self Map",
    description:
      "You are not one personality — you are many. Map your inner identities across 8 key dimensions, consult your inner council before you decide, and check in daily. 100% local: no account, no cloud, no tracking.",
    platforms: ["playstore", "appstore"],
    links: {
      appstore: "https://apps.apple.com/app/alter-ego-know-all-yourselves/id6759404823",
      playstore: "https://play.google.com/store/apps/details?id=com.socialfaculty.alter_ego",
    },
    accent: "from-violet-500 to-purple-600",
    previewImage: alterEgoCover.url,
    developer: "Social Faculty",
  },
  {
    name: "Eavesdrop",
    tagline: "Live Stories",
    description:
      "Some conversations weren't meant for you. Listen live to real people, join thousands of rooms on every topic, raise your hand to speak, or book and host your own conversation.",
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.socialfaculty.eavesdrop",
      appstore: "https://apps.apple.com/us/app/eavesdrop-live-stories/id6759225893",
    },
    accent: "from-emerald-500 to-teal-600",
    previewImage: eavesdropCover.url,
    developer: "Social Faculty",
  },
  {
    name: "AI Clopedia",
    tagline: "Ask AI Anything",
    description:
      "Your AI-powered encyclopedia. Browse featured questions, get answers the way you'll never forget, see an image for every question, and follow your curiosity through your own question history.",
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.socialfaculty.AiClopedia",
      appstore: "https://apps.apple.com/us/app/ai-clopedia-ask-ai-anything/id6447000971",
    },
    accent: "from-blue-500 to-cyan-600",
    previewImage: aiclopediaCover.url,
    developer: "Social Faculty",
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
      <div className="w-full aspect-[2/1] overflow-hidden bg-muted">
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
        <meta property="og:title" content="Software Products — Tech Faculty NG" />
        <meta
          property="og:description"
          content="Apps and platforms built by Tech Faculty NG: Dear Claire, Alter Ego, PalmShop.ng, Tiny People AI, Lovable, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/products" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Software Products — Tech Faculty NG",
          description:
            "Portfolio of software products built by Tech Faculty NG including Dear Claire, Alter Ego, PalmShop.ng, Tiny People AI, and Lovable.",
          url: "https://techfaculty.ng/products",
          hasPart: products.map((p) => ({
            "@type": "SoftwareApplication",
            name: p.name,
            description: p.description,
            applicationCategory: "Application",
            operatingSystem: p.platforms.join(", "),
          })),
        })}</script>
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

        {/* Our Partners */}
        <section className="container mx-auto px-4 max-w-6xl mt-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={14} /> Our Partners
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Tools we partner with</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              World-class platforms we've teamed up with to bring more value to our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden group hover:shadow-lg transition-all border-border/50">
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-teal-600" />
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">Tiny People AI</h3>
                  <p className="text-sm text-primary font-medium">Your personal AI agent on WhatsApp, Telegram & iMessage</p>
                  <p className="text-xs text-muted-foreground mt-0.5">by Natura Inc · Partnered with Tech Faculty</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've partnered with Natura Inc to bring Tiny People AI to users across
                  Nigeria and Africa — a powerful AI agent you talk to from the apps you already use.
                </p>
                <Button asChild size="sm" className="gap-1.5">
                  <Link to="/tinypeople">
                    Learn more <ExternalLink size={14} />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-lg transition-all border-border/50">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600" />
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">Lovable</h3>
                  <p className="text-sm text-primary font-medium">Build production apps with AI</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Recommended by Tech Faculty</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lovable is the AI platform we use to ship real production apps. Describe what
                  you want, iterate in plain English, and publish in minutes.
                </p>
                <Button asChild size="sm" className="gap-1.5">
                  <Link to="/lovable">
                    Learn more <ExternalLink size={14} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Products;
