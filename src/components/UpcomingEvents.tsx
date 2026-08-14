import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import { fetchEvents } from "@/lib/events";

const UpcomingEvents = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 1000 * 60 * 30,
  });

  const featured = events.slice(0, 6);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold">Upcoming Tech Events in Nigeria &amp; Africa</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI and data conferences, developer meetups, hackathons, cybersecurity workshops and free online
            webinars — plus our own Nnewi Tech Meetup and holiday bootcamps. Updated weekly.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-lg border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {featured.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : null}

        <div className="text-center">
          <Link to="/events">
            <Button size="sm" className="gap-2">
              See all tech events <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
