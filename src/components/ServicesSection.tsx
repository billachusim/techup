import { Link } from "react-router-dom";
import { Building2, GraduationCap, Calendar, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Business Partnerships",
    description: "Corporate training, AI workshops, and business digitization programs for organizations.",
    icon: Building2,
    href: "/business-partnerships",
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "hsl(217 91% 60%)",
  },
  {
    title: "School Collaborations",
    description: "University bootcamps, curriculum integration, and student certification programs.",
    icon: GraduationCap,
    href: "/school-collaborations",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "hsl(280 100% 70%)",
  },
  {
    title: "Events",
    description: "Community tech workshops, hackathons, speaker sessions, and networking events.",
    icon: Calendar,
    href: "/events",
    gradient: "from-orange-500/10 to-yellow-500/10",
    iconColor: "hsl(25 95% 53%)",
  },
  {
    title: "SIWES / Industrial Training",
    description: "IT placements for university students — Learn & Pay or Tutor & Earn tracks.",
    icon: Briefcase,
    href: "/siwes",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "hsl(158 100% 50%)",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Beyond <span className="text-gradient">Training</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tech Faculty NG partners with businesses, schools, and communities to bring technology education and innovation to every level.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.href} to={service.href} className="group">
                <Card className={`h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${service.gradient}`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div
                      className="p-3 rounded-lg w-fit mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${service.iconColor}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: service.iconColor }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{service.description}</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary mt-4 group-hover:gap-2 transition-all">
                      Explore {service.title} <ArrowRight size={14} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
