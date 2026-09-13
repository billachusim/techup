import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Search, UserPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { platformBySlug } from "@/data/jobPlatforms";
import { fetchJobs } from "@/lib/jobs";

const ExternalPlatformJobs = () => {
  const { platformSlug } = useParams();
  const platform = platformBySlug(platformSlug);
  const [search, setSearch] = useState("");
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["external-platform-jobs", platformSlug],
    queryFn: () => fetchJobs(),
    enabled: Boolean(platform),
    staleTime: 1000 * 60 * 30,
  });

  const platformJobs = useMemo(() => {
    if (!platform) return [];
    const sources = new Set(platform.match.map((item) => item.toLowerCase()));
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (!sources.has(job.source_platform.toLowerCase())) return false;
      if (!query) return true;
      return `${job.title} ${job.company} ${job.description} ${job.tags.join(" ")} ${job.location ?? ""}`
        .toLowerCase()
        .includes(query);
    });
  }, [jobs, platform, search]);

  if (!platform) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet><title>Platform not found | Tech Faculty</title><meta name="robots" content="noindex" /></Helmet>
        <Header />
        <main className="container mx-auto max-w-3xl px-4 pb-20 pt-32 text-center">
          <h1 className="text-3xl font-bold">Platform not found</h1>
          <Link to="/careers"><Button className="mt-6">Return to Careers</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `${platform.name} Jobs for African Talent`;
  const description = `Browse independent ${platform.name} opportunities and create your platform account through Tech Faculty.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${title} | Tech Faculty`.slice(0, 60)}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://techfaculty.ng/careers/platforms/${platform.slug}`} />
        <link rel="canonical" href={`https://techfaculty.ng/careers/platforms/${platform.slug}`} />
      </Helmet>
      <Header />
      <main className="px-4 pb-20 pt-24">
        <div className="container mx-auto max-w-6xl">
          <Link to="/careers" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft size={14} /> Back to Tech Faculty Careers
          </Link>

          <section className="mb-12 max-w-3xl space-y-5">
            <p className="text-sm font-semibold text-primary">Independent work platform</p>
            <h1 className="text-3xl font-bold md:text-5xl">{platform.name} jobs</h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {platform.blurb} These listings are hosted and managed by {platform.name}, not Tech Faculty.
            </p>
            <a href={platform.signupUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-block">
              <Button size="lg"><UserPlus className="mr-2" size={18} /> Create a {platform.name} account <ExternalLink className="ml-2" size={16} /></Button>
            </a>
          </section>

          <section aria-labelledby="platform-jobs-heading">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="platform-jobs-heading" className="text-2xl font-bold">Available listings</h2>
                <p className="mt-1 text-sm text-muted-foreground">Apply on {platform.name}. Availability can change without notice.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search these jobs" className="pl-9" />
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-56 animate-pulse rounded-lg border border-border bg-card" />)}
              </div>
            ) : platformJobs.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {platformJobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
                {search ? "No listings match your search." : `No current ${platform.name} listings are available. You can still create an account for future opportunities.`}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExternalPlatformJobs;