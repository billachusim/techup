import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MessageCircle, ArrowRight, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/events/EventCard";
import {
  fetchEvents,
  eventSchema,
  EVENT_CATEGORIES,
  EVENT_FORMATS,
} from "@/lib/events";

const PAGE_TITLE = "Tech Events in Nigeria 2026 — AI, Data & Developer Conferences";
const PAGE_DESCRIPTION =
  "Find upcoming tech events in Nigeria and Africa: AI and data conferences, developer meetups, hackathons, cybersecurity workshops, remote work summits and free online webinars, updated weekly.";

const FAQS = [
  {
    q: "What tech events are happening in Nigeria in 2026?",
    a: "This page lists upcoming technology events across Nigeria and Africa — AI and data science conferences, developer meetups, hackathons, cybersecurity workshops, product and design sessions, remote work summits and free online webinars. The listings refresh every week from public event platforms, and Tech Faculty's own meetups, workshops and holiday bootcamps are included.",
  },
  {
    q: "Are there free tech events and webinars I can attend?",
    a: "Yes. Use the price filter to show only free events. Community meetups such as the Nnewi Tech Meetup, Google Developer Group sessions and most online webinars are free to attend; you only need to register on the organiser's page.",
  },
  {
    q: "How do I register for an event listed here?",
    a: "Open the event's page on this site to read the full details, then use the register link to go straight to the organiser's official registration or ticket page. Tech Faculty does not collect ticket payments for events we do not organise.",
  },
  {
    q: "Does Tech Faculty host its own tech events?",
    a: "Yes. We run the monthly Nnewi Tech Meetup at the Technology Incubation Centre in Nnewi, practical AI workshops for business owners, and holiday tech bootcamps for kids and teenagers across our campuses in Nnewi, Onitsha, Enugu, Owerri, Aba and other Nigerian cities.",
  },
  {
    q: "Can I list or co-host an event with Tech Faculty?",
    a: "Yes. Community organisers, companies and developer groups can co-host or sponsor events with us, or send an event for inclusion in this directory. Message us on WhatsApp or email thetechfaculty@gmail.com with the event details and registration link.",
  },
];

const Events = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("all");
  const [city, setCity] = useState("all");
  const [price, setPrice] = useState("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 1000 * 60 * 30,
  });

  const cities = useMemo(
    () => Array.from(new Set(events.map((e) => e.city).filter(Boolean) as string[])).sort(),
    [events],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (e.is_featured) return false;
      if (category !== "all" && e.category !== category) return false;
      if (format !== "all" && e.format !== format) return false;
      if (city !== "all" && e.city !== city) return false;
      if (price === "free" && !e.is_free) return false;
      if (!q) return true;
      return `${e.title} ${e.description} ${e.organizer} ${e.city ?? ""} ${e.tags.join(" ")}`
        .toLowerCase()
        .includes(q);
    });
  }, [events, search, category, format, city, price]);

  const featured = events.filter((e) => e.is_featured);

  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category, format, city, price]);
  const visibleEvents = filtered.slice(0, visibleCount);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setFormat("all");
    setCity("all");
    setPrice("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/events" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://techfaculty.ng/events" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: "https://techfaculty.ng/events",
          inLanguage: "en-NG",
          isPartOf: { "@type": "WebSite", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
          about: [
            { "@type": "Thing", name: "Tech events Nigeria" },
            { "@type": "Thing", name: "AI conferences Africa" },
            { "@type": "Thing", name: "Developer meetups Nigeria" },
            { "@type": "Thing", name: "Hackathons Nigeria" },
          ],
        })}</script>
        {events.length > 0 && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Upcoming tech events in Nigeria and Africa",
            numberOfItems: events.slice(0, 25).length,
            itemListElement: events.slice(0, 25).map((event, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: eventSchema(event),
            })),
          })}</script>
        )}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
            { "@type": "ListItem", position: 2, name: "Tech Events", item: "https://techfaculty.ng/events" },
          ],
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Tech Events</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold mb-5">
              Tech <span className="text-gradient">Events</span> in Nigeria &amp; Africa
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              AI and data conferences, developer meetups, hackathons, cybersecurity workshops, remote work
              summits and free online webinars — refreshed every week, with registration links straight to
              each organiser.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
                <a href="https://wa.me/2348068597140?text=Hello%2C%20I%20want%20to%20know%20about%20upcoming%20Tech%20Faculty%20events" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={20} />
                  Get event updates
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#upcoming">
                  <Calendar className="mr-2" size={18} /> Browse upcoming events
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Tech Faculty events */}
        {featured.length > 0 && (
          <section className="py-12 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Tech Faculty events</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Meetups, workshops and holiday bootcamps we run ourselves across our campuses in Nnewi,
                Onitsha, Enugu, Owerri, Aba, Abuja, Lagos and other Nigerian cities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featured.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Directory */}
        <section id="upcoming" className="py-16 px-4 scroll-mt-24">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Upcoming tech events</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Aggregated weekly from public event platforms including Eventbrite, Meetup, Luma, Google
              Developer Groups and African tech media. Filter by city, format, category or price.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
              <div className="relative lg:col-span-2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, topics, organisers"
                  className="pl-9"
                  aria-label="Search tech events"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger aria-label="Filter by event category"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {EVENT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger aria-label="Filter by event format"><SelectValue placeholder="Format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All formats</SelectItem>
                  {EVENT_FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger aria-label="Filter by city"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cities</SelectItem>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={price} onValueChange={setPrice}>
                  <SelectTrigger aria-label="Filter by price"><SelectValue placeholder="Price" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any price</SelectItem>
                    <SelectItem value="free">Free only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-56 bg-card border border-border rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-muted-foreground">
                  No events match those filters yet. New listings are added every Monday.
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  <RefreshCw size={16} className="mr-2" /> Clear filters
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} event
                  {filtered.length === 1 ? "" : "s"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {visibleEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <div className="mt-8 text-center">
                    <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                      See more events ({filtered.length - visibleCount} left)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Tech events in Nigeria — questions answered</h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-2xl font-bold">Keep going after the event</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" asChild><Link to="/departments">Explore our departments</Link></Button>
              <Button variant="outline" asChild><Link to="/locations">Find a campus near you</Link></Button>
              <Button variant="outline" asChild><Link to="/careers">Browse AI &amp; remote jobs</Link></Button>
              <Button variant="outline" asChild><Link to="/blog">Read the blog</Link></Button>
            </div>
          </div>
        </section>

        {/* Host CTA */}
        <section className="py-20 px-4 text-center bg-muted/30">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Hosting, sponsoring or listing an event?</h2>
            <p className="text-muted-foreground mb-8">
              Partner with Tech Faculty to co-host workshops, sponsor a hackathon, or get your Nigerian or
              African tech event listed in this directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
                <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20hosting%2C%20sponsoring%20or%20listing%20a%20tech%20event" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={18} /> Talk to us on WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:thetechfaculty@gmail.com">
                  Email the events team <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
