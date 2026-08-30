import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { AI_FELLOWSHIP_WHATSAPP_URL } from "@/lib/whatsapp";
import aiForEverything from "@/assets/ai-for-everything.jpg";
import nnewiTechMeetup from "@/assets/nnewi-tech-meetup.jpg";
import siwesCover from "@/assets/siwes-featured.jpg";

type Program = {
  title: string;
  badge: string;
  description: string;
  image: string;
  alt: string;
  cta: string;
  href: string;
  external?: boolean;
  icon: typeof ArrowRight;
};

const programs: Program[] = [
  {
    title: "SIWES / Industrial Training",
    badge: "Hot right now",
    description:
      "Accredited IT placement for university students — choose the Learn & Pay track or the Tutor & Earn track, complete real projects, and get your logbook signed.",
    image: siwesCover,
    alt: "SIWES and Industrial Training programme at Tech Faculty",
    cta: "Explore SIWES",
    href: "/siwes",
    icon: ArrowRight,
  },
  {
    title: "AI for Everything",
    badge: "Cohort forming",
    description:
      "Our AI Agents & Data Training Fellowship. Use AI agents to solve real-world tasks, train the models powering intelligent systems and robotics, and earn a certificate on completion.",
    image: aiForEverything,
    alt: "AI for Everything — AI Agents and Data Training Fellowship",
    cta: "Join the AI Fellowship",
    href: AI_FELLOWSHIP_WHATSAPP_URL,
    external: true,
    icon: MessageCircle,
  },
  {
    title: "Nnewi Tech Meetup",
    badge: "Monthly",
    description:
      "The monthly gathering of the Nnewi tech community — product demos, lightning talks, networking, and collaboration at Tech Faculty HQ.",
    image: nnewiTechMeetup,
    alt: "Nnewi Tech Meetup community event poster",
    cta: "See Event Details",
    href: "/events#nnewi-tech-meetup",
    icon: Calendar,
  },
];

const FeaturedPrograms = () => {
  return (
    <section id="featured-programs" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The programs and events our community is joining right now — open to students, professionals, and complete beginners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Card
                key={program.title}
                className="h-full border-2 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[16/9] bg-muted overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded w-fit mb-3">
                    {program.badge}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{program.description}</p>
                  <div className="mt-6">
                    {program.external ? (
                      <JoinWhatsAppButton
                        url={program.href}
                        groupName={program.title}
                        captureSource={`home-featured:${program.title}`}
                        captureContext={program.title}
                        className="w-full bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold hover:opacity-90"
                      >
                        <span className="flex items-center justify-center">
                          <Icon className="mr-2" size={18} />
                          {program.cta}
                        </span>
                      </JoinWhatsAppButton>
                    ) : (
                      <Button variant="outline" className="w-full font-semibold" asChild>
                        <Link to={program.href}>
                          <Icon className="mr-2" size={18} />
                          {program.cta}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;