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

const jobs = [
  { company: "Flutterwave", role: "Junior Software Engineer", location: "Lagos, Nigeria", type: "Full-time Internship", logo: "🦋" },
  { company: "Paystack", role: "Frontend Developer", location: "Lagos, Nigeria", type: "Full-time", logo: "💳" },
  { company: "Andela", role: "Software Developer", location: "Remote (Africa)", type: "Full-time", logo: "🚀" },
  { company: "Kuda Bank", role: "Mobile App Developer", location: "Lagos, Nigeria", type: "Full-time Internship", logo: "🏦" },
  { company: "Interswitch", role: "Backend Engineer", location: "Lagos, Nigeria", type: "Full-time", logo: "💼" },
  { company: "Microsoft Africa", role: "Cloud Solutions Developer", location: "Lagos, Nigeria", type: "Full-time", logo: "☁️" },
  { company: "Google Developer", role: "Associate Developer", location: "Remote (Global)", type: "Contract", logo: "🌐" },
  { company: "MTN Nigeria", role: "Systems Engineer", location: "Abuja, Nigeria", type: "Full-time Internship", logo: "📱" },
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
                "hiringOrganization": { "@type": "Organization", "name": job.company },
                "jobLocation": { "@type": "Place", "address": job.location },
                "employmentType": job.type.includes("Internship") ? "INTERN" : "FULL_TIME"
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
                Companies Ready to Hire You
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our graduates are hired by top Nigerian, African, and global companies. These are just some of the opportunities waiting for you upon graduation.
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
            <Link to="/#see-how-you-are-doing">
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
