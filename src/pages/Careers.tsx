import { Helmet } from "react-helmet-async";
import { Briefcase, MapPin, ExternalLink, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { useUser } from "@/contexts/UserContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/jobs/JobCard";
import PlatformPartners from "@/components/jobs/PlatformPartners";
import { fetchJobs, employmentLabel, jobPostingSchema } from "@/lib/jobs";
import { Link } from "react-router-dom";

type PartnerJob = {
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

const partnerJobs: PartnerJob[] = [
  { company: "Flutterwave", role: "Junior Software Engineer", location: "Lagos, Nigeria", type: "Full-time Internship", logo: "🦋", description: "Junior Software Engineer role at Flutterwave Lagos. Build and maintain payment infrastructure used across Africa. Open to Tech Faculty NG graduates with foundational software engineering skills.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "8, Providence Street, Lekki Phase 1", postalCode: "106104" },
  { company: "Paystack", role: "Frontend Developer", location: "Lagos, Nigeria", type: "Full-time", logo: "💳", description: "Frontend Developer role at Paystack Lagos. Ship React-based merchant dashboards and checkout experiences. Strong JavaScript, React, and accessibility knowledge required.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "126 Joel Ogunnaike Street, Ikeja GRA", postalCode: "101233" },
  { company: "Andela", role: "Software Developer", location: "Remote (Africa)", type: "Full-time", logo: "🚀", description: "Remote Software Developer role at Andela for engineers across Africa. Match with global clients to build full-stack web and mobile applications. Strong English communication required.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "281 Herbert Macaulay Way, Yaba", postalCode: "101212" },
  { company: "Kuda Bank", role: "Mobile App Developer", location: "Lagos, Nigeria", type: "Full-time Internship", logo: "🏦", description: "Mobile App Developer internship at Kuda Bank Lagos. Contribute to the Kuda mobile banking app using React Native and modern mobile tooling.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "1 Kudi Drive, Victoria Island", postalCode: "101241" },
  { company: "Interswitch", role: "Backend Engineer", location: "Lagos, Nigeria", type: "Full-time", logo: "💼", description: "Backend Engineer role at Interswitch Lagos. Design and ship scalable payment APIs powering millions of transactions across Nigeria and Africa.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "1648C Oko Awo Close, Victoria Island", postalCode: "101241" },
  { company: "Microsoft Africa", role: "Cloud Solutions Developer", location: "Lagos, Nigeria", type: "Full-time", logo: "☁️", description: "Cloud Solutions Developer role at Microsoft Africa Development Center, Lagos. Build Azure-based solutions for enterprise customers across the continent.", city: "Lagos", region: "Lagos", country: "NG", streetAddress: "Kingsway Building, 51 Marina", postalCode: "101241" },
  { company: "Google Developer", role: "Associate Developer", location: "Remote (Global)", type: "Contract", logo: "🌐", description: "Remote Associate Developer contract via Google Developer ecosystem. Build and document developer tools, sample code, and Google Cloud integrations for a global audience.", city: "Abuja", region: "FCT", country: "NG", streetAddress: "Plot 1261, Bishop Oluwole Street", postalCode: "900001" },
  { company: "MTN Nigeria", role: "Systems Engineer", location: "Abuja, Nigeria", type: "Full-time Internship", logo: "📱", description: "Systems Engineer internship at MTN Nigeria Abuja. Support core telecom systems, monitoring, and automation across one of Africa's largest mobile networks.", city: "Abuja", region: "FCT", country: "NG", streetAddress: "Plot 1261, Bishop Oluwole Street", postalCode: "900001" },
];

const partnerSchema = (jobs: PartnerJob[]) => jobs.map((job, i) => ({
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
}));

const Careers = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const { isLoggedIn, facultyId } = useUser();

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [type, setType] = useState("all");
  const [workplace, setWorkplace] = useState("all");

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobs(),
    staleTime: 1000 * 60 * 30,
  });

  const platforms = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.source_platform))).sort(),
    [jobs],
  );
  const platformCounts = useMemo(
    () =>
      jobs.reduce<Record<string, number>>((acc, j) => {
        acc[j.source_platform] = (acc[j.source_platform] ?? 0) + 1;
        return acc;
      }, {}),
    [jobs],
  );
  const types = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.employment_type))).sort(),
    [jobs],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((j) => {
      if (platform !== "all" && j.source_platform !== platform) return false;
      if (type !== "all" && j.employment_type !== type) return false;
      if (workplace === "remote" && !j.is_remote) return false;
      if (workplace === "onsite" && j.is_remote) return false;
      if (!q) return true;
      return `${j.title} ${j.company} ${j.description} ${j.tags.join(" ")} ${j.location ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [jobs, search, platform, type, workplace]);

  const lastUpdated = useMemo(() => {
    if (!jobs.length) return null;
    const newest = jobs.reduce((max, j) => (j.last_seen_at > max ? j.last_seen_at : max), jobs[0].last_seen_at);
    return new Date(newest).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }, [jobs]);

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
        <title>Remote AI &amp; Tech Jobs Board | Tech Faculty Careers</title>
        <meta name="description" content="Live remote AI and tech jobs from Mercor, Turing, Micro1, Mindrift, Outlier and more — updated weekly, filtered for roles open to Nigeria and Africa. Apply free." />
        <meta property="og:title" content="Remote AI &amp; Tech Jobs Board | Tech Faculty Careers" />
        <meta property="og:description" content="Live remote AI and tech jobs from the top AI work platforms, updated weekly and filtered for Nigeria and Africa." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/careers" />
        <link rel="canonical" href="https://techfaculty.ng/careers" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Remote AI and Tech Jobs Board",
          "description": "Weekly-updated board of remote AI and technology jobs from leading AI work platforms, plus curated partner roles for Tech Faculty graduates.",
          "url": "https://techfaculty.ng/careers",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Open roles",
            "numberOfItems": filtered.length + partnerJobs.length,
            "itemListElement": [
              ...partnerSchema(partnerJobs),
              ...filtered.slice(0, 40).map((job, i) => ({
                "@type": "ListItem",
                "position": partnerJobs.length + i + 1,
                "item": jobPostingSchema(job),
              })),
            ],
          }
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold">
                Remote AI &amp; Tech Jobs, <span className="text-gradient">Updated Weekly</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We track the leading AI and remote work platforms — Mercor, Turing, Micro1, Mindrift, Outlier, Handshake AI and more — and surface the tech roles open to Nigerian and African talent. 87% of our graduates secure tech roles within six months.
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <RefreshCw size={14} />
                {lastUpdated ? `Listings refreshed ${lastUpdated}` : "Listings refresh every week"}
              </p>
            </div>

            <PlatformPartners
              counts={platformCounts}
              onViewRoles={(name) => {
                setPlatform(name);
                setSearch("");
                setType("all");
                setWorkplace("all");
                document.getElementById("live-opportunities")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />

            {/* Filters */}
            <div className="grid gap-3 md:grid-cols-4 mb-8">
              <div className="relative md:col-span-2">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search role, skill or company"
                  className="pl-9"
                  aria-label="Search jobs"
                />
              </div>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger aria-label="Filter by platform"><SelectValue placeholder="Platform" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All platforms</SelectItem>
                  {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger aria-label="Filter by role type"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {types.map((t) => <SelectItem key={t} value={t}>{employmentLabel(t)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={workplace} onValueChange={setWorkplace}>
                  <SelectTrigger aria-label="Filter by workplace"><SelectValue placeholder="Where" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Anywhere</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Live feed */}
            <div className="mb-16 scroll-mt-24" id="live-opportunities">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Live opportunities</h2>
                <span className="text-sm text-muted-foreground">{filtered.length} open roles</span>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-56 rounded-lg border border-border bg-card animate-pulse" />
                  ))}
                </div>
              ) : filtered.length ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="text-center border border-border rounded-lg p-10 bg-card">
                  <p className="text-muted-foreground">
                    {jobs.length
                      ? "No roles match those filters yet. Try widening your search."
                      : "The next weekly import is on its way — check back shortly, or browse our partner roles below."}
                  </p>
                </div>
              )}
            </div>

            {/* Curated partner roles */}
            <div className="mb-12">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Partner roles for our graduates</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Roles from our 50+ hiring partners. Apply with your Faculty ID and we forward your profile.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {partnerJobs.map((job, index) => (
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
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Want the skills these roles ask for? Start with a Tech Faculty program.
              </p>
              <Link to="/#pricing">
                <Button size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-white hover:opacity-90">
                  <Briefcase className="mr-2" size={20} />
                  Explore Our Programs
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
