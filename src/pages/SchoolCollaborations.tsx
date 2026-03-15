import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredibilityBanner from "@/components/CredibilityBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Code,
  Brain,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const programs = [
  {
    icon: Code,
    title: "Python & Computer Vision Bootcamp",
    description: "Intensive hands-on bootcamp bringing industry-standard Python programming and computer vision skills directly to your campus.",
    duration: "2–4 weeks",
  },
  {
    icon: Brain,
    title: "AI & Machine Learning Workshop",
    description: "Introduce students to artificial intelligence, machine learning fundamentals, and practical AI tools they can use immediately.",
    duration: "1–2 weeks",
  },
  {
    icon: BookOpen,
    title: "Curriculum Integration",
    description: "Work with your faculty to integrate modern tech skills into existing course structures — from data science to cybersecurity.",
    duration: "Semester-long",
  },
  {
    icon: Award,
    title: "Student Certification Program",
    description: "Students earn industry-recognized certificates upon completing our programs, boosting their employability post-graduation.",
    duration: "Per program",
  },
];

const howItWorks = [
  { step: "1", title: "Reach Out", description: "Your institution contacts us to discuss goals and student needs." },
  { step: "2", title: "Custom Program Design", description: "We design a tailored program matching your curriculum and student level." },
  { step: "3", title: "On-Campus or Virtual Delivery", description: "Our instructors deliver the program on your campus or online." },
  { step: "4", title: "Certification & Follow-Up", description: "Students receive certificates and join our alumni network for ongoing support." },
];

const benefits = [
  "Licensed by FMSTI/NBTI — meets regulatory standards",
  "Practical, hands-on training — not just theory",
  "Industry-recognized certificates for students",
  "Flexible scheduling around academic calendar",
  "Experienced instructors with industry background",
  "Internship pipeline for top-performing students",
  "Custom programs for any department or faculty",
  "Affordable institutional pricing",
];

const SchoolCollaborations = () => {
  return (
    <div className="min-h-screen bg-background">
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
              Bring <span className="text-gradient">Tech Education</span> to Your Campus
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Tech Faculty NG partners with universities and schools to deliver practical, industry-relevant technology training directly to students.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
              <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20a%20school%20collaboration%20with%20Tech%20Faculty%20NG" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" size={20} />
                Start a Collaboration
              </a>
            </Button>
          </div>
        </section>

        {/* Credibility */}
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-4xl">
            <CredibilityBanner compact />
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Programs We Offer Schools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program, idx) => {
                const Icon = program.icon;
                return (
                  <Card key={idx} className="border-2 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-accent/10 w-fit shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-1">{program.title}</h3>
                          <p className="text-xs text-primary font-medium mb-2">{program.duration}</p>
                          <p className="text-sm text-muted-foreground">{program.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-background font-bold text-xl flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Why Schools Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Partner With Tech Faculty NG</h2>
            <p className="text-muted-foreground mb-8">
              Let's design a technology education program that fits your institution's goals and schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
                <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20a%20school%20collaboration" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={18} />
                  WhatsApp Us
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

export default SchoolCollaborations;
