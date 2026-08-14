import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Globe, Building2, ExternalLink } from "lucide-react";
import { Job, employmentLabel, locationLabel, salaryLabel } from "@/lib/jobs";
import { platformFor } from "@/data/jobPlatforms";
import ApplyDialog from "@/components/jobs/ApplyDialog";

const JobCard = ({ job }: { job: Job }) => {
  const pay = salaryLabel(job);
  const platform = platformFor(job.source_platform);
  const [applyOpen, setApplyOpen] = useState(false);
  return (
    <article className="bg-card border border-border rounded-lg p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
          {job.source_platform}
        </span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium whitespace-nowrap">
          {employmentLabel(job.employment_type)}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold leading-snug">
          <Link to={`/careers/jobs/${job.slug}`} className="hover:text-primary transition-colors">
            {job.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Building2 size={12} /> {job.company}
        </p>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{job.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          {job.is_remote ? <Globe size={12} /> : <MapPin size={12} />}
          {locationLabel(job)}
        </span>
        {pay && <span className="font-medium text-foreground">{pay}</span>}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Link
          to={`/careers/jobs/${job.slug}`}
          className="text-sm font-medium text-primary hover:underline"
          aria-label={`View details for ${job.title} at ${job.company}`}
        >
          View role →
        </Link>
        {platform ? (
          <button
            type="button"
            onClick={() => setApplyOpen(true)}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Apply for ${job.title} at ${job.company}`}
          >
            Apply
          </button>
        ) : (
          <a
            href={job.source_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            aria-label={`Apply for ${job.title} on ${job.source_platform}`}
          >
            Apply <ExternalLink size={12} />
          </a>
        )}
      </div>

      {platform && (
        <ApplyDialog
          open={applyOpen}
          onOpenChange={setApplyOpen}
          platform={platform}
          jobTitle={job.title}
          jobUrl={job.source_url}
        />
      )}
    </article>
  );
};

export default JobCard;
