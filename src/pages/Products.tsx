import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Smartphone } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Sparkles } from "lucide-react";
import { apps as products, type AppProduct as Product } from "@/data/apps";

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

      <Link to={`/products/${product.slug}`} className="inline-block text-sm font-medium text-primary hover:underline">
        About {product.name}, features and FAQ →
      </Link>
    </CardContent>
  </Card>
);

const Products = () => {
  return (
    <>
      <>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Software Products — Tech Faculty NG",
          description:
            "Portfolio of mobile apps built by Tech Faculty NG including Dear Claire, Alter Ego, Eavesdrop and AI Clopedia.",
          url: "https://techfaculty.ng/products",
          hasPart: products.map((p) => ({
            "@type": "SoftwareApplication",
            name: p.name,
            description: p.description,
            applicationCategory: "Application",
            operatingSystem: "iOS, Android",
            url: `https://techfaculty.ng/products/${p.slug}`,
          })),
        })}</script>
      </>

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
            Mobile apps built by Tech Faculty and Social Faculty — social, AI and
            self-discovery apps used by over a million people worldwide, live on the
            App Store and Google Play.
          </p>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4 max-w-6xl" aria-labelledby="our-apps">
          <h2 id="our-apps" className="text-2xl md:text-3xl font-bold mb-6">Apps built by Tech Faculty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-12">
            More products coming soon.
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
                    Learn more about Tiny People AI <ExternalLink size={14} />
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
                    Learn more about Lovable <ExternalLink size={14} />
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
