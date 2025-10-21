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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <section id="departments" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Explore Our <span className="text-gradient">Departments</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of tech disciplines and start your
            journey to expertise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <AccordionItem
                  key={dept.id}
                  value={dept.id}
                  className="border border-border rounded-lg bg-card overflow-hidden hover:border-primary/50 transition-all"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                    <div className="flex items-center gap-4 text-left w-full">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{dept.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold mb-3 text-primary">
                        Courses Included:
                      </h4>
                      <ul className="space-y-2">
                        {dept.courses.map((course, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-muted-foreground"
                          >
                            <ChevronDown className="text-primary mt-1 rotate-[-90deg]" size={16} />
                            <span>{course}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Departments;
