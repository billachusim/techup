import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { MapPin, Search, Navigation, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredibilityBanner from "@/components/CredibilityBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CampusMap from "@/components/locations/CampusMap";
import { campuses, zones, directionsUrl, type CampusZone } from "@/data/campuses";

const Locations = () => {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<CampusZone | "All">("All");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campuses.filter((c) => {
      if (zone !== "All" && c.zone !== zone) return false;
      if (!q) return true;
      return (
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    });
  }, [query, zone]);

  const hq = campuses.find((c) => c.isHeadquarters)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech Faculty Campuses in Nigeria",
    itemListElement: campuses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "EducationalOrganization",
        name: `Tech Faculty — ${c.name}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: c.address,
          addressLocality: c.city,
          addressRegion: c.state,
          addressCountry: "NG",
        },
        geo: { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Faculty Campuses in Nigeria — Find a Campus Near You</title>
        <meta
          name="description"
          content="Tech Faculty operates physically inside Technology Incubation Centres nationwide via our partnership with the National Board for Technology Incubation."
        />
        <meta property="og:title" content="Tech Faculty Campuses in Nigeria" />
        <meta
          property="og:description"
          content="Find a Tech Faculty campus in your city — nationwide presence through Technology Incubation Centres."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/locations" />
        <link rel="canonical" href="https://techfaculty.ng/locations" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Nationwide presence</Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              A Tech Faculty campus in every city that matters.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Through our partnership with the{" "}
              <span className="text-foreground font-semibold">National Board for Technology Incubation</span>, under the{" "}
              <span className="text-foreground font-semibold">Federal Ministry of Science, Technology and Innovation</span>,
              Tech Faculty operates physically inside Technology Incubation Centres across Nigeria — giving
              students in-person labs, mentors and exam venues in their own city, not just online.
            </p>
          </div>
        </section>

        {/* HQ callout */}
        <section className="container mx-auto px-4 mt-10">
          <Card className="border-primary/40 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                  Main Campus / Headquarters
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Technology Incubation Centre, Nnewi
                </h2>
                <p className="text-muted-foreground mb-4">
                  {hq.address}. Our Nnewi campus also serves as the South-East
                  zonal headquarters for the Technology Incubation Centre network.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <a href={directionsUrl(hq)} target="_blank" rel="noopener noreferrer">
                      <Navigation className="w-4 h-4" /> Get directions
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Locator */}
        <section className="container mx-auto px-4 mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Campus locator</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Search by city or state, or filter by geopolitical zone.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search e.g. Owerri, Anambra…"
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              size="sm"
              variant={zone === "All" ? "default" : "outline"}
              onClick={() => setZone("All")}
            >
              All zones
            </Button>
            {zones.map((z) => (
              <Button
                key={z}
                size="sm"
                variant={zone === z ? "default" : "outline"}
                onClick={() => setZone(z)}
              >
                {z}
              </Button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6">
            {/* List */}
            <div className="space-y-3 lg:max-h-[480px] lg:overflow-y-auto lg:pr-2">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No campuses match that search.
                </p>
              )}
              {filtered.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`cursor-pointer transition-colors ${
                    activeId === c.id ? "border-primary ring-1 ring-primary/40" : "hover:border-primary/40"
                  }`}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm md:text-base leading-tight">
                          {c.name}
                        </h3>
                        {c.isHeadquarters && (
                          <Badge variant="default" className="text-[10px]">HQ</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{c.address}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{c.zone}</Badge>
                        <a
                          href={directionsUrl(c)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" /> Directions
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map */}
            <div className="min-h-[480px]">
              <CampusMap activeId={activeId} onSelect={setActiveId} />
            </div>
          </div>
        </section>

        {/* Partnership */}
        <section className="container mx-auto px-4 mt-16">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              How we're everywhere at once
            </h2>
            <p className="text-muted-foreground">
              Our partnership with the National Board for Technology Incubation, an agency of the Federal
              Ministry of Science, Technology and Innovation, lets Tech Faculty operate inside the same
              federally-run Technology Incubation Centres that host Nigeria's innovation ecosystem — so
              wherever the government has built a centre, our students already have a campus.
            </p>
          </div>
          <CredibilityBanner />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Locations;