import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ExternalLink,
  Globe,
  MapPin,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchEventBySlug,
  fetchEvents,
  categoryLabel,
  dateLabel,
  formatLabel,
  locationLabel,
  priceLabel,
  eventSchema,
  eventUrl,
} from "@/lib/events";
import EventCard from "@/components/events/EventCard";

const EventDetail = () => {
  const { slug = "" } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
    enabled: !!slug,
  });

  const { data: all = [] } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 px-4 container mx-auto max-w-3xl">
          <div className="h-8 w-2/3 bg-card border border-border rounded animate-pulse mb-4" />
          <div className="h-48 bg-card border border-border rounded animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Event not found | Tech Faculty Events</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header />
        <main className="pt-32 px-4 container mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">This event is no longer listed</h1>
          <p className="text-muted-foreground">
            It may have ended or been removed by the organiser.
          </p>
          <Link to="/events"><Button>Browse upcoming tech events</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const price = priceLabel(event);
  const online = event.format === "VIRTUAL";
  const place = locationLabel(event);
  const title = `${event.title} — ${place} | Tech Events`;
  const description = `${event.title}: ${categoryLabel(event.category).toLowerCase()} in ${place}, ${dateLabel(event)}. ${event.description}`
    .replace(/\s+/g, " ")
    .slice(0, 158);

  const related = all
    .filter((e) => e.slug !== event.slug)
    .filter((e) => e.city === event.city || e.category === event.category || e.format === event.format)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={eventUrl(event)} />
        <meta name="twitter:card" content="summary_large_image" />
        {event.image_url && <meta property="og:image" content={event.image_url} />}
        <link rel="canonical" href={eventUrl(event)} />
        <script type="application/ld+json">{JSON.stringify(eventSchema(event))}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
            { "@type": "ListItem", position: 2, name: "Tech Events", item: "https://techfaculty.ng/events" },
            { "@type": "ListItem", position: 3, name: event.title, item: eventUrl(event) },
          ],
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/events" className="hover:text-primary">Tech Events</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{categoryLabel(event.category)}</span>
          </nav>

          <header className="space-y-3">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              {categoryLabel(event.category)} · {formatLabel(event.format)}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{event.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Building2 size={14} /> Organised by {event.organizer}
            </p>
          </header>

          {event.image_url && (
            <img
              src={event.image_url}
              alt={`${event.title} event cover`}
              loading="lazy"
              className="w-full rounded-lg border border-border object-cover max-h-80"
            />
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card border border-border rounded-lg p-5 text-sm">
            <div>
              <dt className="text-muted-foreground flex items-center gap-1 mb-1"><CalendarDays size={14} /> Date &amp; time</dt>
              <dd className="font-medium">{dateLabel(event)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-1 mb-1">
                {online ? <Globe size={14} /> : <MapPin size={14} />} Location
              </dt>
              <dd className="font-medium">
                {event.venue_name ? `${event.venue_name}, ` : ""}{place}
                {event.address && <span className="block text-muted-foreground font-normal">{event.address}</span>}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-1 mb-1"><Ticket size={14} /> Admission</dt>
              <dd className="font-medium">{price ?? "See organiser's page"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground mb-1">Listed via</dt>
              <dd className="font-medium">{event.is_featured ? "Tech Faculty NG" : event.source_platform}</dd>
            </div>
          </dl>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">About this event</h2>
            {event.description.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
            ))}
          </section>

          {event.tags.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Topics</h2>
              <ul className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <li key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{tag}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">How to attend</h2>
            <p className="text-sm text-muted-foreground">
              Registration is handled by the organiser
              {event.is_featured ? " (Tech Faculty NG)" : ` on ${event.source_platform}`}. Open the official
              page to reserve a place, confirm the final date, and check any joining instructions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold">
                <a
                  href={event.source_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`Register for ${event.title} on the organiser's website`}
                >
                  Register for this event <ExternalLink size={16} className="ml-2" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={`https://wa.me/2348068597140?text=${encodeURIComponent(`Hello, I have a question about this event: ${event.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask us about it
                </a>
              </Button>
            </div>
          </section>

          {related.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold">Related tech events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {related.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link to="/events"><ArrowLeft size={16} className="mr-2" /> All tech events</Link>
            </Button>
            <Button variant="outline" asChild><Link to="/locations">Campuses near you</Link></Button>
            <Button variant="outline" asChild><Link to="/careers">AI &amp; remote jobs</Link></Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
