import { Link } from "@/lib/router-compat";
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
  Monitor,
  Stamp,
} from "lucide-react";
import LastUpdated from "@/components/LastUpdated";
import { VIRTUAL_SIWES, formatNaira } from "@/data/virtualSiwes";

/** When this page's copy last changed. Bump it when you edit the page. */
const SIWES_UPDATED = "2026-10-08";

const tracks = [
  {
    icon: BookOpen,
    title: "Learn & Pay Track",
    subtitle: "Gain Real-World Experience",
    color: "hsl(217 91% 60%)",
    gradient: "from-blue-500/10 to-indigo-500/10",
    description: "Gain structured, hands-on tech experience during your IT placement, paying only the regular course fee for your department, with no separate SIWES fee. Perfect for students who want to build real skills beyond what the classroom offers.",
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

const siwesFaqs = [
  {
    q: "How much does SIWES with Tech Faculty NG cost?",
    a: `There is no separate SIWES fee for on-site placements. On the Learn & Pay track you pay only the regular course fee for your department, and Tutor & Earn pays you instead. Virtual SIWES is charged because it includes courier delivery of your logbook and kit: ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} for the full placement and ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} for the logbook service.`,
  },
  {
    q: "How long is a SIWES placement at Tech Faculty NG?",
    a: "As long as your school requires. Most students come for three or six months, and you tell us your IT duration and start date when you apply. Your placement letter, mentor schedule and project work are planned around that duration, and you leave with an IT completion letter and a certificate.",
  },
  {
    q: "Is Tech Faculty NG accepted for SIWES and ITF paperwork?",
    a: "Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation through NBTI, and over 120 students have completed SIWES with us since 2022. We complete the company sections of your ITF SPE-1 and Form 8, but your school decides which hosts it accepts, so confirm with your SIWES coordinator first.",
  },
  {
    q: "What is the difference between Learn & Pay and Tutor & Earn?",
    a: "Learn & Pay is for students who want structured mentorship and real client projects, and you pay only the regular course fee for your department. Tutor & Earn is for students already skilled in a tech area: you teach other learners and get paid while completing your IT. Both tracks end with a certificate and a recommendation letter.",
  },
  {
    q: "How do I apply for SIWES at Tech Faculty NG?",
    a: "Send a WhatsApp message to 0806 859 7140 or email thetechfaculty@gmail.com with your name, school, department, preferred track, IT duration and start date. We review your application and schedule an onboarding call within 48 hours, then send your placement letter and onboarding materials once you are accepted.",
  },
];

const SIWES = () => {
  return (
    <div className="min-h-screen bg-background">
      <>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalProgram",
          "name": "SIWES & Industrial Training Placement",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Tech Faculty NG",
            "url": "https://techfaculty.ng",
            "accreditation": "Licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) via NBTI"
          },
          "description": "Student Industrial Work Experience Scheme (SIWES) placements with two tracks: Learn & Pay for structured mentorship, or Tutor & Earn for skilled students to teach and get paid. Over 120 interns placed since 2022.",
          "educationalProgramMode": "onsite",
          "occupationalCategory": ["Software Development", "Data Science", "Cybersecurity", "AI/ML", "Digital Marketing"],
          "programType": "Internship",
          "timeToComplete": "P3M",
          "offers": [
            { "@type": "Offer", "name": "Learn & Pay Track", "description": "Structured mentorship with hands-on projects; regular course fee, no separate SIWES fee" },
            { "@type": "Offer", "name": "Tutor & Earn Track", "description": "Teach other students and earn during your IT placement" }
          ],
          "url": "https://techfaculty.ng/siwes"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: "https://techfaculty.ng/siwes",
          dateModified: SIWES_UPDATED,
          mainEntity: siwesFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
      </>
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
              Over 120 university students have completed their SIWES/IT placement with us since 2022.
              Our program is regulated under Federal Ministry of Education policies.
              No separate SIWES fee on site. Choose Learn &amp; Pay or Tutor &amp; Earn — either way, you leave with real skills, a certificate, and industry connections.
            </p>
            <LastUpdated date={SIWES_UPDATED} className="-mt-4 mb-8" />
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

        {/* Virtual option */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              Can&apos;t attend in person? Do it virtually
            </h2>
            <p className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-10">
              Both tracks — Learn &amp; Pay and Tutor &amp; Earn — also run fully online for students
              anywhere in Nigeria, and we handle your logbook by delivery so you never travel.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/30">
                <CardContent className="p-6 space-y-3">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Virtual IT placement — ₦45,000</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Placement letter for your school, weekly live sessions, a mentor, real project
                    work, attendance records and your completion certificate — all online.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit">
                    <Stamp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Logbook service — ₦15,000</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We arrange courier pickup of your logbook and ITF forms, review and complete the
                    entries, sign and stamp them, then waybill everything back to you. On-site interns
                    can use this too.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button size="lg" variant="outline" asChild>
                <Link to="/virtual-siwes">
                  See how Virtual SIWES works <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
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
                "Prefer to stay in your city? Tell us you want the virtual IT track and we onboard you online instead.",
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

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">SIWES questions, answered</h2>
            <div className="space-y-4">
              {siwesFaqs.map((f) => (
                <Card key={f.q}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your IT?</h2>
            <p className="text-muted-foreground mb-8">
              Join 120+ students who've completed their industrial training with Tech Faculty NG and launched their tech careers. The <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">World Economic Forum (2025)</a> projects Africa's tech talent demand will grow 25% annually — start building your career now.
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
