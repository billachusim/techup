import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredibilityBanner from "@/components/CredibilityBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  Brain,
  Monitor,
  Wrench,
  GraduationCap,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const offerings = [
  {
    icon: Brain,
    title: "AI & Technology Workshops",
    description: "2–5 day intensive workshops to help your team understand and adopt AI tools, automation, and emerging tech for business growth.",
  },
  {
    icon: Users,
    title: "Corporate Staff Training",
    description: "Customized training programs for employees — from basic digital literacy to advanced data analytics and cybersecurity.",
  },
  {
    icon: Monitor,
    title: "Business Digitization",
    description: "End-to-end support in digitizing your business operations, from online presence to internal process automation.",
  },
  {
    icon: Wrench,
    title: "IT Support & Infrastructure",
    description: "Ongoing IT support, network setup, device management, and tech maintenance for your business.",
  },
  {
    icon: GraduationCap,
    title: "Talent Pipeline",
    description: "Access our pool of trained, certified graduates ready to join your workforce — pre-screened and industry-ready.",
  },
  {
    icon: Building2,
    title: "Custom Software Solutions",
    description: "Web apps, mobile apps, and automation tools built to your specifications by our development team.",
  },
];

const benefits = [
  "Government-licensed training provider (FMSTI/NBTI)",
  "Customized programs tailored to your industry",
  "Flexible delivery — on-site, virtual, or hybrid",
  "Certificates of completion for all participants",
  "Post-training support and consultation",
  "Bulk pricing for organizations",
];

const BusinessPartnerships = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Business Partnerships | Tech Faculty NG</title>
        <meta name="description" content="Partner with Tech Faculty NG for corporate training, AI workshops, business digitization, and tech talent pipelines. FMSTI-licensed, based in Nnewi, Nigeria." />
        <meta property="og:title" content="Business Partnerships - Tech Faculty NG" />
        <meta property="og:description" content="Corporate training, AI workshops, and business digitization. Licensed by the Federal Ministry of Science, Technology & Innovation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/business-partnerships" />
        <link rel="canonical" href="https://techfaculty.ng/business-partnerships" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Business Partnerships & Corporate Training",
          "provider": { "@type": "Organization", "name": "Tech Faculty NG" },
          "description": "Corporate training programs, AI integration workshops, business digitization services, and talent pipeline solutions for Nigerian businesses.",
          "areaServed": { "@type": "Country", "name": "Nigeria" },
          "serviceType": ["Corporate Training", "AI Workshops", "Business Digitization", "Talent Pipeline"],
          "url": "https://techfaculty.ng/business-partnerships"
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
              Empower Your <span className="text-gradient">Business</span> with Technology
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Partner with Tech Faculty NG to upskill your workforce, digitize operations, and stay ahead with AI and emerging technologies.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
              <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20a%20business%20partnership%20with%20Tech%20Faculty%20NG" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" size={20} />
                Discuss a Partnership
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

        {/* Offerings */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Offer Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Card key={idx} className="border-2 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
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

        {/* Benefits */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Why Partner With Us</h2>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how Tech Faculty NG can help your organization thrive in the digital age.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
                <a href="https://wa.me/2348068597140?text=Hello%2C%20I'm%20interested%20in%20a%20business%20partnership" target="_blank" rel="noopener noreferrer">
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

export default BusinessPartnerships;
