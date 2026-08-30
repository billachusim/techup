import { useState } from "react";
import { Link } from "react-router-dom";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  Globe,
  MessageCircle,
  Search,
  Share2,
  Shield,
  Smartphone,
  TrendingUp,
  Video,
} from "lucide-react";
import { departments } from "@/data/departments";

const icons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code,
  Smartphone,
  Database,
  Shield,
  Brain,
  Globe,
  Share2,
  Video,
  Cloud,
  Cpu,
};

const DepartmentsSection = () => {
  const [query, setQuery] = useState("");

  const filtered = departments.filter((dept) => {
    const q = query.toLowerCase();
    return (
      dept.title.toLowerCase().includes(q) ||
      dept.tagline.toLowerCase().includes(q) ||
      dept.courses.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <section id="departments" className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Departments</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Ten departments built around AI for everything — from complete beginner to job-ready engineer. Open one for a
            quick look, then enter the department for the full curriculum, tools, and salaries.
          </p>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search departments or courses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
                aria-label="Search departments or courses"
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No departments found matching your search.
          </p>
        ) : (
          <Accordion type="single" collapsible className="divide-y rounded-lg border">
            {filtered.map((dept) => {
              const Icon = icons[dept.icon] ?? Code;
              return (
                <AccordionItem key={dept.id} value={dept.id} className="border-0 px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                      <span
                        className="p-2 rounded-md flex-shrink-0"
                        style={{ backgroundColor: `${dept.color}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: dept.color }} />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{dept.title}</h3>
                          {dept.trending && (
                            <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
                              <TrendingUp className="h-2.5 w-2.5" /> Trending
                            </Badge>
                          )}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" /> {dept.duration}
                        </span>
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pb-4 space-y-4">
                      <p className="text-sm text-muted-foreground">{dept.tagline}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dept.courses.slice(0, 4).map((course) => (
                          <div key={course} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: dept.color }} />
                            <span>{course}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link to={`/departments/${dept.slug}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Enter {dept.title} department
                            <ArrowRight size={14} className="ml-2" />
                          </Button>
                        </Link>
                        <JoinWhatsAppButton
                          size="sm"
                          url={COMMUNITY_WHATSAPP_URL}
                          groupName="the Tech Faculty WhatsApp community"
                          captureSource="home-departments"
                          captureContext={dept.title}
                          className="flex-1"
                        >
                          <span className="flex items-center justify-center gap-2">
                            Join Community <MessageCircle size={14} />
                          </span>
                        </JoinWhatsAppButton>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        <div className="flex justify-center mt-8">
          <Link to="/departments">
            <Button variant="outline" size="lg">
              Browse all departments <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;