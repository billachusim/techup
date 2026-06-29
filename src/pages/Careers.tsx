import { Helmet } from "react-helmet-async";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

type Job = {
  company: string;
  role: string;
  location: string;
  type: string;
  logo: string;
  description: string;
  city: string;
  region: string;
  country: string;
  streetAddress: string;
  postalCode: string;
};

const POSTED_DATE = "2026-06-01";
const VALID_THROUGH = "2026-12-31";

const jobs: Job[] = [
  { company: "Flutterwave", role: "Junior Software Engineer", location: "Lagos, Nigeria", type: "Full-time Internship", logo: "🦋", description: "Junior Software Engineer role at Flutterwave Lagos. Build and maintain payment infrastructure used across Africa. Open to Tech Faculty NG graduates with foundational software engineering skills.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "8, Providence Street, Lekki Phase 1", postalCode: "106104" },
  { company: "Paystack", role: "Frontend Developer", location: "Lagos, Nigeria", type: "Full-time", logo: "💳", description: "Frontend Developer role at Paystack Lagos. Ship React-based merchant dashboards and checkout experiences. Strong JavaScript, React, and accessibility knowledge required.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "126 Joel Ogunnaike Street, Ikeja GRA", postalCode: "101233" },
  { company: "Andela", role: "Software Developer", location: "Remote (Africa)", type: "Full-time", logo: "🚀", description: "Remote Software Developer role at Andela for engineers across Africa. Match with global clients to build full-stack web and mobile applications. Strong English communication required.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "281 Herbert Macaulay Way, Yaba", postalCode: "101212" },
  { company: "Kuda Bank", role: "Mobile App Developer", location: "Lagos, Nigeria", type: "Full-time Internship", logo: "🏦", description: "Mobile App Developer internship at Kuda Bank Lagos. Contribute to the Kuda mobile banking app using React Native and modern mobile tooling.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "1 Kudi Drive, Victoria Island", postalCode: "101241" },
  { company: "Interswitch", role: "Backend Engineer", location: "Lagos, Nigeria", type: "Full-time", logo: "💼", description: "Backend Engineer role at Interswitch Lagos. Design and ship scalable payment APIs powering millions of transactions across Nigeria and Africa.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "1648C Oko Awo Close, Victoria Island", postalCode: "101241" },
  { company: "Microsoft Africa", role: "Cloud Solutions Developer", location: "Lagos, Nigeria", type: "Full-time", logo: "☁️", description: "Cloud Solutions Developer role at Microsoft Africa Development Center, Lagos. Build Azure-based solutions for enterprise customers across the continent.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "Kingsway Building, 51 Marina", postalCode: "101241" },
  { company: "Google Developer", role: "Associate Developer", location: "Remote (Global)", type: "Contract", logo: "🌐", description: "Remote Associate Developer contract via Google Developer ecosystem. Build and document developer tools, sample code, and Google Cloud integrations for a global audience.", city: "Abuja", region: "FCT", country: "NG", streetAddress: "Plot 1261, Bishop Oluwole Street", postalCode: "900001" },
  { company: "MTN Nigeria", role: "Systems Engineer", location: "Abuja, Nigeria", type: "Full-time Internship", logo: "📱", description: "Systems Engineer internship at MTN Nigeria Abuja. Support core telecom systems, monitoring, and automation across one of Africa's largest mobile networks.", city: "Abuja", region: "FCT", country: "NG", streetAddress: "Plot 1261, Bishop Oluwole Street", postalCode: "900001" },
];

const Careers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const { isLoggedIn, facultyId } = useUser();

  const handleApply = (company: string) => {
    setSelectedJob(company);
    if (isLoggedIn && facultyId) {
      setShowJobForm(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Careers - Tech Faculty NG | Job Opportunities for Graduates</title>
        <meta name="description" content="87% of Tech Faculty graduates land tech roles within 6 months. Explore jobs at Flutterwave, Paystack, Andela, Microsoft, Google and 50+ partner companies." />
        <meta property="og:title" content="Careers - Tech Faculty NG | Job Opportunities for Graduates" />
        <meta property="og:description" content="87% of Tech Faculty graduates land tech roles within 6 months. Explore jobs at top Nigerian and global tech companies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/careers" />
        <link rel="canonical" href="https://techfaculty.ng/careers" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Career Opportunities for Tech Faculty Graduates",
          "description": "Job placement page for Tech Faculty NG graduates. 87% employment rate within 6 months across 50+ partner companies.",
          "url": "https://techfaculty.ng/careers",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Available Job Opportunities",
            "numberOfItems": jobs.length,
          "itemListElement": jobs.map((job, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "JobPosting",
              "title": job.role,
              "description": job.description,
              "datePosted": POSTED_DATE,
              "validThrough": VALID_THROUGH,
              "employmentType": job.type.includes("Internship") ? "INTERN" : (job.type.includes("Contract") ? "CONTRACTOR" : "FULL_TIME"),
              "hiringOrganization": {
                "@type": "Organization",
                "name": job.company,
                "sameAs": `https://www.google.com/search?q=${encodeURIComponent(job.company)}`
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": job.streetAddress,
                  "addressLocality": job.city,
                  "addressRegion": job.region,
                  "postalCode": job.postalCode,
                  "addressCountry": job.country
                }
              },
              ...(job.location.toLowerCase().includes("remote") ? {
                "jobLocationType": "TELECOMMUTE",
                "applicantLocationRequirements": { "@type": "Country", "name": "Nigeria" }
              } : {}),
              "baseSalary": {
                "@type": "MonetaryAmount",
                "currency": "NGN",
                "value": {
                  "@type": "QuantitativeValue",
                  "minValue": job.type.includes("Internship") ? 150000 : 400000,
                  "maxValue": job.type.includes("Internship") ? 300000 : 1200000,
                  "unitText": "MONTH"
                }
              }
            }
          }))
          }
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold">
                Companies Ready to <span className="text-gradient">Hire You</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                87% of our graduates secure tech roles within six months. Our 50+ partner companies — from Flutterwave to Microsoft Africa — actively recruit from our talent pool. According to the <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">World Economic Forum (2025)</a>, Africa's tech talent demand will grow 25% annually through 2030.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {jobs.map((job, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{job.logo}</div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {job.type}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.company}</h3>
                      <p className="text-sm font-medium text-foreground">{job.role}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin size={12} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleApply(job.company)}
                    >
                      Apply Now
                      <ExternalLink size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                These opportunities and hundreds more are available to our graduates
              </p>
              <Link to="/#pricing">
                <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-white hover:opacity-90">
                  <Briefcase className="mr-2" size={20} />
                  Start Your Journey Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to {selectedJob}</DialogTitle>
            <DialogDescription>Please log in to apply for this position.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              You need to be logged in with your Faculty ID to submit job applications.
              If you don't have an account yet, you can sign up and get started!
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Link to="/#get-started">
              <Button onClick={() => setIsDialogOpen(false)}>Go to Login/Signup</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showJobForm && facultyId && (
        <JobApplicationForm
          facultyId={facultyId}
          onClose={() => setShowJobForm(false)}
          onSuccess={() => { setShowJobForm(false); setSelectedJob(""); }}
        />
      )}
    </div>
  );
};

export default Careers;
