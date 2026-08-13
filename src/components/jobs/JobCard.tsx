import { Link } from "react-router-dom";
import { MapPin, Globe, Building2 } from "lucide-react";
import { Job, employmentLabel, locationLabel, salaryLabel } from "@/lib/jobs";

const JobCard = ({ job }: { job: Job }) => {
  const pay = salaryLabel(job);
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

      <Link
        to={`/careers/jobs/${job.slug}`}
        className="text-sm font-medium text-primary hover:underline"
        aria-label={`View details and apply for ${job.title} at ${job.company}`}
      >
        View role &amp; apply →
      </Link>
    </article>
  );
};

export default JobCard;
