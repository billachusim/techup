import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CredibilityBanner from "@/components/CredibilityBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Heart,
  Globe,
  Users,
  GraduationCap,
  Building2,
  MapPin,
  MessageCircle,
} from "lucide-react";

const stats = [
  { value: "5,000+", label: "Students Trained" },
  { value: "10+", label: "Departments" },
  { value: "50+", label: "Partner Companies" },
  { value: "3+", label: "Years Running" },
];

const values = [
  {
    icon: Target,
    title: "Practical Skills First",
    description: "We focus on hands-on, project-based learning that prepares students for real jobs — not just theory.",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "We're building a tech ecosystem in Nnewi and South-East Nigeria, one student, one business at a time.",
  },
  {
    icon: Globe,
    title: "Global Standards, Local Impact",
    description: "Industry-recognized certifications and curricula designed to compete on the world stage.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About Us - Tech Faculty NG | Our Mission & Story</title>
        <meta name="description" content="Learn about Tech Faculty NG — licensed by the Federal Ministry of Science, Technology & Innovation via NBTI. Training the next generation of tech professionals from Nnewi, Anambra State, Nigeria." />
        <meta property="og:title" content="About Us - Tech Faculty NG | Our Mission & Story" />
        <meta property="og:description" content="Licensed by FMSTI via NBTI. Training the next generation of tech professionals in Nigeria from Nnewi, Anambra State." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/about" />
        <link rel="canonical" href="https://techfaculty.ng/about" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Tech Faculty NG",
          "description": "Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation via the National Board for Technology Incubation (NBTI). Based in Nnewi, Anambra State, we train, certify, and employ the next generation of tech professionals.",
          "mainEntity": {
            "@type": "EducationalOrganization",
            "name": "Tech Faculty NG",
            "url": "https://techfaculty.ng",
            "foundingDate": "2022",
            "numberOfEmployees": { "@type": "QuantitativeValue", "value": 25 },
            "alumni": { "@type": "QuantitativeValue", "name": "Graduates", "value": 500 },
            "areaServed": { "@type": "Country", "name": "Nigeria" },
            "address": { "@type": "PostalAddress", "addressLocality": "Nnewi", "addressRegion": "Anambra State", "addressCountry": "NG" },
            "accreditation": "Licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) via the National Board for Technology Incubation (NBTI)",
            "sameAs": [
              "https://twitter.com/TechFacultyNG",
              "https://www.linkedin.com/company/techfaculty"
            ]
          },
          "url": "https://techfaculty.ng/about"
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
              About <span className="text-gradient">Tech Faculty NG</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to train, certify, and employ the next generation of tech professionals in Nigeria — starting from Nnewi, Anambra State.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Tech Faculty NG was born from a simple observation: the South-East of Nigeria is full of entrepreneurial energy, but many young people and businesses lack access to quality technology education and digital skills training.
              </p>
              <p>
                Based at the Digital Village in Nnewi, Anambra State, we started as a small training center and have grown into a comprehensive tech education platform serving thousands of students across multiple departments — from Web Development and Data Science to AI, Cybersecurity, and Digital Marketing.
              </p>
              <p>
                Today, we don't just train individuals. We partner with universities to bring bootcamps to campuses, help businesses digitize their operations, host community tech events, and provide SIWES/IT placements for university students seeking real-world experience.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">What Drives Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <Card key={idx} className="border-2 text-center">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Credibility */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Our Partnership</h2>
            <CredibilityBanner />
          </div>
        </section>

        {/* Location */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Visit Us</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Digital Village, NBTI Zonal Office, Nnewi, Anambra State, Nigeria
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background font-semibold" asChild>
              <a href="https://wa.me/2348068597140" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" size={18} />
                Get in Touch
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
