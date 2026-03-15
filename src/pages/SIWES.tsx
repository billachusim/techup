import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredibilityBanner from "@/components/CredibilityBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  DollarSign,
  BookOpen,
  Award,
  Users,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const tracks = [
  {
    icon: BookOpen,
    title: "Learn & Pay Track",
    subtitle: "Gain Real-World Experience",
    color: "hsl(217 91% 60%)",
    gradient: "from-blue-500/10 to-indigo-500/10",
    description: "Pay a training fee and gain structured, hands-on tech experience during your IT placement. Perfect for students who want to build real skills beyond what the classroom offers.",
    features: [
      "Structured mentorship from industry professionals",
      "Hands-on projects with real clients and products",
      "Access to all Tech Faculty courses during your placement",
      "Certificate of completion for your institution",
      "Recommendation letter upon successful completion",
      "Portfolio of real projects to showcase to employers",
    ],
  },
  {
    icon: DollarSign,
    title: "Tutor & Earn Track",
    subtitle: "Teach and Get Paid",
    color: "hsl(158 100% 50%)",
    gradient: "from-green-500/10 to-emerald-500/10",
    description: "Already skilled in a tech area? Join as a student tutor — teach other learners, gain teaching experience, and earn money while completing your IT.",
    features: [
      "Get paid for tutoring other students",
      "Build leadership and communication skills",
      "Flexible schedule around your academic calendar",
      "Certificate of completion + tutoring certificate",
      "Strong recommendation letter for future employers",
      "Potential for full-time employment after graduation",
    ],
  },
];

const whatYouGet = [
  { icon: Award, label: "Industry Certificate" },
  { icon: Briefcase, label: "Real Project Experience" },
  { icon: Users, label: "Professional Mentorship" },
  { icon: GraduationCap, label: "IT Completion Letter" },
];

const SIWES = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SIWES & Industrial Training - Tech Faculty NG | IT Placement</title>
        <meta name="description" content="Complete your SIWES/IT placement at Tech Faculty NG. Choose Learn & Pay for mentored experience or Tutor & Earn to teach and get paid. Licensed by FMSTI via NBTI." />
        <meta property="og:title" content="SIWES & Industrial Training - Tech Faculty NG" />
        <meta property="og:description" content="SIWES & IT placements — Learn & Pay for real-world experience or Tutor & Earn while completing your industrial training." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/siwes" />
        <link rel="canonical" href="https://techfaculty.ng/siwes" />
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
            <div className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
              SIWES / Industrial Training
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Do Your <span className="text-gradient">IT</span> With Tech Faculty NG
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Complete your Student Industrial Work Experience Scheme (SIWES) with us. Choose to learn and pay, or tutor and earn — either way, you leave with real skills and experience.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
              <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20a%20student%20interested%20in%20doing%20my%20SIWES%2FIT%20with%20Tech%20Faculty%20NG" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" size={20} />
                Apply Now
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

        {/* Two Tracks */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choose Your Track</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Two pathways to complete your industrial training — pick the one that fits your goals.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tracks.map((track, idx) => {
                const Icon = track.icon;
                return (
                  <Card key={idx} className={`border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${track.gradient}`}>
                    <CardContent className="p-8">
                      <div className="p-3 rounded-lg w-fit mb-4" style={{ backgroundColor: `${track.color}20` }}>
                        <Icon className="h-7 w-7" style={{ color: track.color }} />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{track.title}</h3>
                      <p className="text-sm font-medium mb-4" style={{ color: track.color }}>{track.subtitle}</p>
                      <p className="text-muted-foreground mb-6">{track.description}</p>
                      <div className="space-y-3">
                        {track.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: track.color }} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">What Every Intern Gets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {whatYouGet.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How to Apply */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">How to Apply</h2>
            <div className="space-y-4">
              {[
                "Send us a WhatsApp message or email with your full name, school, department, and preferred track (Learn & Pay or Tutor & Earn).",
                "Include your IT duration (e.g., 3 months, 6 months) and preferred start date.",
                "We'll review your application and schedule an onboarding call within 48 hours.",
                "Once accepted, you'll receive your placement letter and onboarding materials.",
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-background font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm md:text-base pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your IT?</h2>
            <p className="text-muted-foreground mb-8">
              Join dozens of students who've completed their industrial training with Tech Faculty NG and launched their tech careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
                <a href="https://wa.me/2348068597140?text=Hello%2C%20I%20want%20to%20do%20my%20SIWES%2FIT%20with%20Tech%20Faculty%20NG" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={18} />
                  Apply via WhatsApp
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

export default SIWES;
