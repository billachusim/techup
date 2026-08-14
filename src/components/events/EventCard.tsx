import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Globe, Ticket, Building2 } from "lucide-react";
import {
  TechEvent,
  categoryLabel,
  dateLabel,
  formatLabel,
  locationLabel,
  priceLabel,
} from "@/lib/events";

const EventCard = ({ event }: { event: TechEvent }) => {
  const price = priceLabel(event);
  const online = event.format === "VIRTUAL";
  return (
    <article
      id={event.slug}
      className="bg-card border border-border rounded-lg p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow flex flex-col scroll-mt-28"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          {event.is_featured ? "Tech Faculty" : event.source_platform}
        </span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium whitespace-nowrap">
          {categoryLabel(event.category)}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold leading-snug">
          <Link to={`/events/${event.slug}`} className="hover:text-primary transition-colors">
            {event.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Building2 size={12} /> {event.organizer}
        </p>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{event.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays size={12} /> {dateLabel(event)}
        </span>
        <span className="flex items-center gap-1">
          {online ? <Globe size={12} /> : <MapPin size={12} />}
          {locationLabel(event)} · {formatLabel(event.format)}
        </span>
        {price && (
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Ticket size={12} /> {price}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Link
          to={`/events/${event.slug}`}
          className="text-sm font-medium text-primary hover:underline"
          aria-label={`Full details for ${event.title}`}
        >
          Event details →
        </Link>
        <a
          href={event.source_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          aria-label={`Register for ${event.title} on ${event.source_platform}`}
        >
          Register
        </a>
      </div>
    </article>
  );
};

export default EventCard;