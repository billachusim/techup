import { Check, Sparkles, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pricingPlans = [
  {
    name: "Bootcamp Starter",
    icon: Sparkles,
    price: "Free",
    description: "Perfect for beginners exploring tech careers",
    features: [
      "Intro to Programming",
      "HTML & CSS Basics",
      "Git & GitHub Fundamentals",
      "Tech Career Guidance",
      "Community Access",
      "Self-Paced Learning",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Developer Pro",
    icon: Zap,
    price: "$299",
    period: "/3 months",
    description: "Comprehensive web development mastery",
    features: [
      "Full-Stack Web Development",
      "React & Node.js",
      "Database Management",
      "REST APIs & GraphQL",
      "Portfolio Projects",
      "Work & Earn Program",
      "Job Placement Support",
      "Industry Certifications",
    ],
    cta: "Enrol Now",
    popular: true,
  },
  {
    name: "Data Wizard",
    icon: Rocket,
    price: "$349",
    period: "/3 months",
    description: "Master data science and analytics",
    features: [
      "Python & SQL Mastery",
      "Data Visualization",
      "Statistical Analysis",
      "Machine Learning Basics",
      "Real-World Projects",
      "Work & Earn Program",
      "Job Placement Support",
      "Certifications Included",
    ],
    cta: "Start Learning",
    popular: false,
  },
  {
    name: "Security Shield",
    icon: Rocket,
    price: "$399",
    period: "/4 months",
    description: "Become a cybersecurity expert",
    features: [
      "Network Security",
      "Ethical Hacking",
      "SOC Operations",
      "Incident Response",
      "CompTIA & CEH Prep",
      "Work & Earn Program",
      "Job Placement Support",
      "Hands-On Labs",
    ],
    cta: "Tech Up",
    popular: false,
  },
  {
    name: "AI Innovator",
    icon: Rocket,
    price: "$449",
    period: "/4 months",
    description: "Build cutting-edge AI solutions",
    features: [
      "Deep Learning & Neural Networks",
      "TensorFlow & PyTorch",
      "NLP & Computer Vision",
      "AI Model Deployment",
      "Real AI Projects",
      "Work & Earn Program",
      "Job Placement Support",
      "Research Papers Access",
    ],
    cta: "Start Now",
    popular: false,
  },
  {
    name: "Cloud Architect",
    icon: Rocket,
    price: "$379",
    period: "/3 months",
    description: "Master cloud platforms and DevOps",
    features: [
      "AWS, Azure & GCP",
      "Cloud Architecture",
      "DevOps & CI/CD",
      "Kubernetes & Docker",
      "Cloud Certifications",
      "Work & Earn Program",
      "Job Placement Support",
      "Hands-On Projects",
    ],
    cta: "Register",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible packages designed for every career goal. All paid plans include
            our 100% ROI guarantee.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <Card
                key={idx}
                className={`relative bg-card border-border ${
                  plan.popular ? "border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="mx-auto p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold text-gradient">
                    {plan.price}
                    {plan.period && (
                      <span className="text-lg text-muted-foreground font-normal">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-6">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => window.open("https://forms.gle/example", "_blank")}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need a Custom Package?
              </h3>
              <p className="text-muted-foreground mb-6">
                Looking for corporate training or a personalized learning path? Book a
                call with our team to create the perfect plan for your goals.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-primary-foreground hover:opacity-90"
                onClick={() => window.open("https://calendly.com/example", "_blank")}
              >
                Book a Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
