import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Building2, Globe, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { useUser } from "@/contexts/UserContext";
import ApplySteps from "@/components/jobs/ApplySteps";
import { platformFor } from "@/data/jobPlatforms";
import {
  fetchJobBySlug,
  employmentLabel,
  locationLabel,
  salaryLabel,
  jobPostingSchema,
} from "@/lib/jobs";

const JobDetail = () => {
  const { slug = "" } = useParams();
  const { isLoggedIn, facultyId } = useUser();
  const [showForm, setShowForm] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", slug],
    queryFn: () => fetchJobBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 px-4 container mx-auto max-w-3xl">
          <div className="h-8 w-2/3 bg-card border border-border rounded animate-pulse mb-4" />
          <div className="h-48 bg-card border border-border rounded animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Job not found | Tech Faculty Careers</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header />
        <main className="pt-32 px-4 container mx-auto max-w-3xl text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">This role is no longer listed</h1>
          <p className="text-muted-foreground">
            It may have been filled or removed from the source platform.
          </p>
          <Link to="/careers"><Button>Browse open roles</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const pay = salaryLabel(job);
  const platform = platformFor(job.source_platform);
  const title = `${job.title} at ${job.company}`;
  const description = job.description.slice(0, 155);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${title} | Tech Faculty Jobs`.slice(0, 60)}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://techfaculty.ng/careers/jobs/${job.slug}`} />
        <link rel="canonical" href={`https://techfaculty.ng/careers/jobs/${job.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jobPostingSchema(job))}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
            { "@type": "ListItem", position: 2, name: "Careers", item: "https://techfaculty.ng/careers" },
            { "@type": "ListItem", position: 3, name: title, item: `https://techfaculty.ng/careers/jobs/${job.slug}` },
          ],
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-24 pb-20 px-4">
        <article className="container mx-auto max-w-3xl space-y-8">
          <Link to="/careers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft size={14} /> Back to all jobs
          </Link>

          <header className="space-y-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Sourced from {job.source_platform}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 size={14} /> {job.company}</span>
              <span className="flex items-center gap-1">
                {job.is_remote ? <Globe size={14} /> : <MapPin size={14} />} {locationLabel(job)}
              </span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                {employmentLabel(job.employment_type)}
              </span>
              {pay && <span className="font-medium text-foreground">{pay}</span>}
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">About this role</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</div>
          </section>

          {job.tags?.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Skills mentioned</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span key={t} className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground">{t}</span>
                ))}
              </div>
            </section>
          )}

          <section className="border border-border rounded-lg p-6 bg-card space-y-4">
            <h2 className="text-lg font-semibold">Apply for this role</h2>
            <p className="text-sm text-muted-foreground">
              Applications are handled on {job.source_platform}. Follow the steps below to apply.
            </p>

            {platform ? (
              <ApplySteps platform={platform} jobUrl={job.source_url} jobTitle={job.title} />
            ) : (
              <a href={job.source_url} target="_blank" rel="noopener noreferrer nofollow" className="block">
                <Button className="w-full sm:w-auto">
                  Apply on {job.source_platform} <ExternalLink size={14} className="ml-2" />
                </Button>
              </a>
            )}

            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Tech Faculty graduates can also send us their profile so our placement team can support the application.
              </p>
              {isLoggedIn && facultyId ? (
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  Send my profile to placement team
                </Button>
              ) : (
                <Link to="/#get-started">
                  <Button variant="outline" size="sm">Get a Faculty ID for placement support</Button>
                </Link>
              )}
            </div>
          </section>
        </article>
      </main>
      <Footer />

      {showForm && facultyId && (
        <JobApplicationForm
          facultyId={facultyId}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default JobDetail;
