import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import { ArrowRight, Building2, Globe2, MapPin, MessageCircle, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COURSE_AREAS,
  HUBS_DISCLAIMER,
  directoryWhatsAppUrl,
  hubCities,
  hubCountries,
  hubWhatsAppUrl,
  techHubs,
} from "@/data/techHubs";

const CANONICAL = "https://techfaculty.ng/hubs";

const Hubs = () => {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [courseArea, setCourseArea] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return techHubs.filter((h) => {
      if (country !== "All" && h.country !== country) return false;
      if (city !== "All" && h.city !== city) return false;
      if (courseArea !== "All" && !h.courseAreas.includes(courseArea as never)) return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.focus.toLowerCase().includes(q) ||
        h.courseAreas.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [query, country, city, courseArea]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Tech hubs and training institutes in Nigeria and Africa",
      numberOfItems: techHubs.length,
      itemListElement: techHubs.map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://techfaculty.ng/hubs/${h.slug}`,
        name: h.name,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
        { "@type": "ListItem", position: 2, name: "Tech Hubs", item: CANONICAL },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Hubs in Nigeria & Africa — Directory by City</title>
        <meta
          name="description"
          content="Find tech hubs, innovation centres and training institutes across Nigeria and Africa by city and course area. Tell us what you want to study and we help you enrol."
        />
        <meta property="og:title" content="Tech Hubs in Nigeria & Africa — Directory by City" />
        <meta
          property="og:description"
          content="A curated directory of tech hubs and training institutes across Nigeria and Africa, searchable by city and course area."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <link rel="canonical" href={CANONICAL} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">The hub of hubs</Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Tech hubs and training institutes across Nigeria and Africa
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Our mission is to move Nigerians and Africans into the AI future — wherever
              they live. So we do not only teach at our own campuses: we keep a curated
              directory of the hubs, innovation centres and institutes people can learn
              in, city by city. Tell us the course and the city, and we help you choose a
              route and enrol — online, hybrid or in person.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <a href={directoryWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" /> Talk to us on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/locations">
                  <Building2 className="w-4 h-4" /> Our own campuses
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/departments">
                  Browse courses <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 mt-10">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hub, city or skill"
                className="pl-9"
                aria-label="Search tech hubs"
              />
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger aria-label="Filter by country">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All countries</SelectItem>
                {hubCountries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger aria-label="Filter by city">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All cities</SelectItem>
                {hubCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={courseArea} onValueChange={setCourseArea}>
              <SelectTrigger aria-label="Filter by course area">
                <SelectValue placeholder="Course area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All course areas</SelectItem>
                {COURSE_AREAS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
            {techHubs.length} listings.
          </p>
        </section>

        {/* Results */}
        <section className="container mx-auto px-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((hub) => (
              <Card key={hub.slug} className="flex flex-col">
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Badge variant={hub.isTechFaculty ? "default" : "secondary"} className="text-xs">
                      {hub.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe2 className="w-3 h-3" /> {hub.country}
                    </span>
                  </div>
                  <h2 className="font-semibold leading-snug mb-1">
                    <Link to={`/hubs/${hub.slug}`} className="hover:text-primary transition-colors">
                      {hub.name}
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3" /> {hub.city}, {hub.region}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{hub.focus}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hub.courseAreas.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/hubs/${hub.slug}`}>
                        View hub <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <a href={hubWhatsAppUrl(hub)} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-3.5 h-3.5" /> Apply on WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <Card className="mt-6">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No listing matches that search yet — but we can still place you.
                </p>
                <Button asChild>
                  <a href={directoryWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> Ask us on WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="container mx-auto px-4 mt-12">
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-3">
                Anywhere you are, there is a study route
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                If there is no hub near you, distance is no longer the blocker. Our online
                and hybrid tracks run nationwide and across Africa, our{" "}
                <Link to="/virtual-siwes" className="text-primary hover:underline">
                  virtual SIWES and logbook service
                </Link>{" "}
                covers students on industrial training, and our{" "}
                <Link to="/careers" className="text-primary hover:underline">
                  remote jobs board
                </Link>{" "}
                is where graduates go next. Message us with your city and the course you
                want, and we will map the shortest path.
              </p>
              <p className="text-xs text-muted-foreground">{HUBS_DISCLAIMER}</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Hubs;
