import { useState } from "react";
import {
  Code,
  Database,
  Shield,
  Brain,
  Share2,
  Video,
  Cloud,
  Cpu,
  ChevronDown,
  Smartphone,
  Globe,
  MessageCircle,
  Search,
  CheckCircle2,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const departments = [
  {
    id: "web-dev",
    title: "Web Development",
    icon: Code,
    category: "tech",
    color: "hsl(var(--primary))",
    gradient: "from-blue-500/10 to-purple-500/10",
    description:
      "Master modern web technologies and frameworks to build stunning, responsive applications.",
    courses: [
      "HTML, CSS & JavaScript Fundamentals",
      "React & Next.js",
      "Node.js & Express",
      "Full-Stack Development",
      "UI/UX Design Basics",
    ],
    enrollment: "2,400+",
    duration: "12-16 weeks",
    difficulty: "Beginner to Advanced",
    trending: true,
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    icon: Smartphone,
    category: "tech",
    color: "hsl(221 83% 53%)",
    gradient: "from-indigo-500/10 to-cyan-500/10",
    description:
      "Create powerful mobile applications for iOS and Android platforms.",
    courses: [
      "React Native Development",
      "Flutter & Dart",
      "iOS Development with Swift",
      "Android Development with Kotlin",
      "Mobile UI/UX Design",
    ],
    enrollment: "1,800+",
    duration: "14-18 weeks",
    difficulty: "Intermediate",
    trending: false,
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    icon: Database,
    category: "tech",
    color: "hsl(142 76% 36%)",
    gradient: "from-green-500/10 to-emerald-500/10",
    description:
      "Learn to analyze, visualize, and derive insights from complex datasets using cutting-edge tools.",
    courses: [
      "Python for Data Science",
      "SQL & Database Management",
      "Data Visualization with Power BI",
      "Statistical Analysis",
      "Machine Learning Fundamentals",
    ],
    enrollment: "3,200+",
    duration: "12-16 weeks",
    difficulty: "Beginner to Advanced",
    trending: true,
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: Shield,
    category: "security",
    color: "hsl(0 84% 60%)",
    gradient: "from-red-500/10 to-orange-500/10",
    description:
      "Protect digital assets and infrastructure with comprehensive security training.",
    courses: [
      "Network Security Fundamentals",
      "Ethical Hacking",
      "Security Operations (SOC)",
      "Incident Response",
      "Security Certifications (CompTIA, CEH)",
    ],
    enrollment: "1,500+",
    duration: "16-20 weeks",
    difficulty: "Intermediate to Advanced",
    trending: true,
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    icon: Brain,
    category: "tech",
    color: "hsl(280 89% 64%)",
    gradient: "from-purple-500/10 to-pink-500/10",
    description:
      "Build intelligent systems and applications using artificial intelligence and ML algorithms.",
    courses: [
      "Introduction to AI",
      "Deep Learning with TensorFlow",
      "Natural Language Processing",
      "Computer Vision",
      "AI Model Deployment",
    ],
    enrollment: "2,100+",
    duration: "16-20 weeks",
    difficulty: "Advanced",
    trending: true,
  },
  {
    id: "basic-internet-ai",
    title: "Basic Internet & AI Studies",
    icon: Globe,
    category: "beginner",
    color: "hsl(200 94% 46%)",
    gradient: "from-sky-500/10 to-blue-500/10",
    description:
      "Start your digital journey with foundational internet skills and AI literacy.",
    courses: [
      "Internet Basics & Digital Literacy",
      "AI Tools for Everyday Use",
      "ChatGPT & AI Assistants",
      "Online Safety & Privacy",
      "Digital Communication Skills",
    ],
    enrollment: "4,500+",
    duration: "4-6 weeks",
    difficulty: "Beginner",
    trending: false,
  },
  {
    id: "social-media",
    title: "Social Media & Digital Marketing",
    icon: Share2,
    category: "creative",
    color: "hsl(330 81% 60%)",
    gradient: "from-pink-500/10 to-rose-500/10",
    description:
      "Master digital marketing strategies, content creation, and grow brands across social platforms.",
    courses: [
      "Social Media Strategy",
      "Content Marketing",
      "Video Production & Editing",
      "Photography & Image Editing",
      "Graphic Design Basics",
      "SEO & SEM",
      "Facebook & Instagram Ads",
      "Analytics & Growth Hacking",
      "Podcast Production",
      "YouTube Content Strategy",
    ],
    enrollment: "3,800+",
    duration: "10-14 weeks",
    difficulty: "Beginner to Intermediate",
    trending: true,
  },
  {
    id: "design",
    title: "Design",
    icon: Video,
    category: "creative",
    color: "hsl(280 100% 70%)",
    gradient: "from-violet-500/10 to-purple-500/10",
    description:
      "Master the art of visual design, user experience, and product design principles.",
    courses: [
      "Graphic Design with Adobe Suite",
      "UI/UX Design Fundamentals",
      "Product Design",
      "Figma & Design Tools",
      "Design Systems & Prototyping",
    ],
    enrollment: "2,600+",
    duration: "12-16 weeks",
    difficulty: "Beginner to Advanced",
    trending: false,
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    icon: Cloud,
    category: "tech",
    color: "hsl(210 100% 56%)",
    gradient: "from-blue-400/10 to-indigo-400/10",
    description:
      "Deploy and manage scalable applications on leading cloud platforms.",
    courses: [
      "AWS Fundamentals",
      "Azure Administration",
      "Google Cloud Platform",
      "DevOps & CI/CD",
      "Cloud Architecture",
    ],
    enrollment: "1,900+",
    duration: "14-18 weeks",
    difficulty: "Intermediate to Advanced",
    trending: false,
  },
  {
    id: "robotics",
    title: "Robotics & IoT",
    icon: Cpu,
    category: "tech",
    color: "hsl(45 93% 47%)",
    gradient: "from-yellow-500/10 to-orange-500/10",
    description:
      "Build and program intelligent robots and connected devices for the future.",
    courses: [
      "Arduino & Raspberry Pi",
      "Robotics Programming",
      "IoT Systems Design",
      "Sensor Integration",
      "Automation Projects",
    ],
    enrollment: "1,200+",
    duration: "16-20 weeks",
    difficulty: "Intermediate to Advanced",
    trending: false,
  },
];

const categories = [
  { id: "all", label: "All Departments" },
  { id: "tech", label: "Technology" },
  { id: "creative", label: "Creative" },
  { id: "security", label: "Security" },
  { id: "beginner", label: "Beginner Friendly" },
];

const Departments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.courses.some((course) =>
        course.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      activeCategory === "all" || dept.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="departments" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our Departments
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join a thriving community of innovators. Each department is more than just courses—it's your tribe, your co-working space, your alumni network, and a hub of extracurricular activities.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search departments or courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs sm:text-sm">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Departments Grid */}
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No departments found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDepartments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Card
                  key={dept.id}
                  className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br ${dept.gradient}`}
                >
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value={dept.id} className="border-none">
                        <AccordionTrigger className="hover:no-underline pb-4">
                          <div className="flex items-start gap-4 text-left flex-1">
                            <div
                              className="p-3 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                              style={{ backgroundColor: `${dept.color}20` }}
                            >
                              <Icon
                                className="h-6 w-6 transition-colors duration-300"
                                style={{ color: dept.color }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold">
                                  {dept.title}
                                </h3>
                                {dept.trending && (
                                  <Badge
                                    variant="secondary"
                                    className="gap-1 text-xs"
                                  >
                                    <TrendingUp className="h-3 w-3" />
                                    Trending
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {dept.description}
                              </p>
                              {/* Metadata */}
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {dept.enrollment}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {dept.duration}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {dept.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 space-y-4 border-t">
                            <div>
                              <p className="text-sm font-semibold mb-3">
                                What You'll Learn:
                              </p>
                              <div className="space-y-2">
                                {dept.courses.map((course, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <CheckCircle2
                                      className="h-4 w-4 mt-0.5 flex-shrink-0"
                                      style={{ color: dept.color }}
                                    />
                                    <span>{course}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              style={{
                                backgroundColor: dept.color,
                                color: "white",
                              }}
                              asChild
                            >
                              <a
                                href="https://chat.whatsapp.com/D8kuxWVZRTKKeAx6ERjSqc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                              >
                                Join {dept.title} Community
                                <MessageCircle size={14} />
                              </a>
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Departments;
