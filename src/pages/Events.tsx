import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Mic,
  Code,
  Trophy,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const eventTypes = [
  {
    icon: Code,
    title: "Workshops & Bootcamps",
    description: "Hands-on coding workshops, weekend bootcamps, and intensive skill-building sessions for all levels.",
  },
  {
    icon: Mic,
    title: "Speaker Sessions",
    description: "Industry professionals and thought leaders share insights on tech trends, career growth, and innovation.",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    description: "Competitive coding events where teams build solutions to real-world problems within time constraints.",
  },
  {
    icon: Users,
    title: "Community Meetups",
    description: "Regular networking events for tech enthusiasts, freelancers, and professionals in the Nnewi tech ecosystem.",
  },
];

const upcomingEvents = [
  {
    title: "AI Tools for Business — Workshop",
    date: "Coming Soon",
    location: "Tech Faculty HQ, Nnewi",
    type: "Workshop",
    description: "Learn how to leverage AI tools like ChatGPT, automation platforms, and data analytics for your business.",
  },
  {
    title: "Web Development Weekend Bootcamp",
    date: "Coming Soon",
    location: "Tech Faculty HQ, Nnewi",
    type: "Bootcamp",
    description: "Build a full website from scratch in one weekend. Perfect for beginners and aspiring developers.",
  },
  {
    id: "nnewi-tech-meetup",
    title: "Nnewi Tech Meetup",
    date: "Monthly",
    location: "Tech Faculty HQ, Nnewi",
    type: "Meetup",
    description: "Monthly gathering of the Nnewi tech community — product demos, networking, lightning talks, and collaboration.",
    ctaLabel: "Reserve my seat",
    ctaHref: "https://wa.me/2348068597140?text=Hello%2C%20please%20add%20me%20to%20the%20next%20Nnewi%20Tech%20Meetup",
  },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Events - Tech Faculty NG | Workshops, Hackathons & Meetups</title>
        <meta name="description" content="Join Tech Faculty NG community events — workshops, hackathons, speaker sessions, and networking meetups in Nnewi, Anambra State and beyond." />
        <meta property="og:title" content="Events - Tech Faculty NG | Workshops & Hackathons" />
        <meta property="og:description" content="Community tech events — workshops, hackathons, speaker sessions, and networking meetups in Nnewi and South-East Nigeria." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/events" />
        <link rel="canonical" href="https://techfaculty.ng/events" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EventSeries",
          "name": "Tech Faculty NG Community Events",
          "description": "Workshops, hackathons, speaker sessions, and networking meetups organized by Tech Faculty NG in Nnewi, Anambra State.",
          "organizer": { "@type": "Organization", "name": "Tech Faculty NG", "url": "https://techfaculty.ng" },
          "location": { "@type": "Place", "name": "Digital Village, NBTI Zonal Office", "address": { "@type": "PostalAddress", "addressLocality": "Nnewi", "addressRegion": "Anambra State", "addressCountry": "NG" } },
          "url": "https://techfaculty.ng/events"
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tech <span className="text-gradient">Events</span> & Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Workshops, hackathons, speaker sessions, and community meetups — powered by Tech Faculty NG in Nnewi and beyond.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
              <a href="https://wa.me/2348068597140?text=Hello%2C%20I%20want%20to%20know%20about%20upcoming%20Tech%20Faculty%20events" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" size={20} />
                Get Event Updates
              </a>
            </Button>
          </div>
        </section>

        {/* Event Types */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Host</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventTypes.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="border-2 hover:shadow-lg transition-all duration-300 text-center">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-lg bg-accent/10 w-fit mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
            <div className="space-y-6">
              {upcomingEvents.map((event, idx) => (
                <Card key={idx} id={(event as { id?: string }).id} className="border-2 hover:shadow-lg transition-all duration-300 scroll-mt-28">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">{event.type}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0" asChild>
                        <a
                          href={(event as { ctaHref?: string }).ctaHref ?? "https://wa.me/2348068597140?text=I'm%20interested%20in%20the%20event%3A%20"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {(event as { ctaLabel?: string }).ctaLabel ?? "Register Interest"}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Host an Event CTA */}
        <section className="py-24 px-4 text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Want to Host or Sponsor an Event?</h2>
            <p className="text-muted-foreground mb-8">
              Partner with Tech Faculty NG to co-host workshops, sponsor hackathons, or bring tech events to your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
                <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20hosting%20or%20sponsoring%20a%20tech%20event" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={18} />
                  Let's Talk
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:thetechfaculty@gmail.com">
                  Email Us <ArrowRight className="ml-2" size={18} />
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
