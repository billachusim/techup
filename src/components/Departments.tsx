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
  ExternalLink,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const departments = [
  {
    id: "web-dev",
    title: "Web Development",
    icon: Code,
    description:
      "Master modern web technologies and frameworks to build stunning, responsive applications.",
    courses: [
      "HTML, CSS & JavaScript Fundamentals",
      "React & Next.js",
      "Node.js & Express",
      "Full-Stack Development",
      "UI/UX Design Basics",
    ],
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    icon: Smartphone,
    description:
      "Create powerful mobile applications for iOS and Android platforms.",
    courses: [
      "React Native Development",
      "Flutter & Dart",
      "iOS Development with Swift",
      "Android Development with Kotlin",
      "Mobile UI/UX Design",
    ],
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    icon: Database,
    description:
      "Learn to analyze, visualize, and derive insights from complex datasets using cutting-edge tools.",
    courses: [
      "Python for Data Science",
      "SQL & Database Management",
      "Data Visualization with Power BI",
      "Statistical Analysis",
      "Machine Learning Fundamentals",
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: Shield,
    description:
      "Protect digital assets and infrastructure with comprehensive security training.",
    courses: [
      "Network Security Fundamentals",
      "Ethical Hacking",
      "Security Operations (SOC)",
      "Incident Response",
      "Security Certifications (CompTIA, CEH)",
    ],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    icon: Brain,
    description:
      "Build intelligent systems and applications using artificial intelligence and ML algorithms.",
    courses: [
      "Introduction to AI",
      "Deep Learning with TensorFlow",
      "Natural Language Processing",
      "Computer Vision",
      "AI Model Deployment",
    ],
  },
  {
    id: "basic-internet-ai",
    title: "Basic Internet & AI Studies",
    icon: Globe,
    description:
      "Start your digital journey with foundational internet skills and AI literacy.",
    courses: [
      "Internet Basics & Digital Literacy",
      "AI Tools for Everyday Use",
      "ChatGPT & AI Assistants",
      "Online Safety & Privacy",
      "Digital Communication Skills",
    ],
  },
  {
    id: "social-media",
    title: "Social Media & Digital Marketing",
    icon: Share2,
    description:
      "Master digital marketing strategies and grow brands across social platforms.",
    courses: [
      "Social Media Strategy",
      "Content Marketing",
      "SEO & SEM",
      "Facebook & Instagram Ads",
      "Analytics & Growth Hacking",
    ],
  },
  {
    id: "content-creation",
    title: "Content Creation & Media",
    icon: Video,
    description:
      "Create engaging multimedia content for digital platforms and audiences.",
    courses: [
      "Video Production & Editing",
      "Photography & Image Editing",
      "Graphic Design with Adobe Suite",
      "Podcast Production",
      "YouTube Content Strategy",
    ],
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    icon: Cloud,
    description:
      "Deploy and manage scalable applications on leading cloud platforms.",
    courses: [
      "AWS Fundamentals",
      "Azure Administration",
      "Google Cloud Platform",
      "DevOps & CI/CD",
      "Cloud Architecture",
    ],
  },
  {
    id: "robotics",
    title: "Robotics & IoT",
    icon: Cpu,
    description:
      "Build and program intelligent robots and connected devices for the future.",
    courses: [
      "Arduino & Raspberry Pi",
      "Robotics Programming",
      "IoT Systems Design",
      "Sensor Integration",
      "Automation Projects",
    ],
  },
];

const Departments = () => {
  return (
    <section id="departments" className="py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our Departments
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a thriving community of innovators. Each department is more than just courses—it's your tribe, your co-working space, your alumni network, and a hub of extracurricular activities. Build skills, forge connections, and grow together.
          </p>
        </div>

        <div className="space-y-4">
          <Accordion type="single" collapsible>
            {departments.map((dept) => (
              <AccordionItem
                key={dept.id}
                value={dept.id}
                className="border border-border rounded-lg bg-card mb-4 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline text-left">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{dept.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dept.description}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pt-4 space-y-4">
                    <div className="space-y-2">
                      {dept.courses.map((course, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-muted-foreground py-1"
                        >
                          • {course}
                        </div>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
                      <a 
                        href="https://chat.whatsapp.com/GCnw88T0nxs5oabYgcqXKt" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Join Community
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Departments;
