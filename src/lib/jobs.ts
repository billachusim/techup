import { supabase } from "@/integrations/supabase/client";

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  source_platform: string;
  source_url: string;
  description: string;
  employment_type: string;
  is_remote: boolean;
  location: string | null;
  country: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_unit: string | null;
  tags: string[];
  posted_at: string | null;
  last_seen_at: string;
};

const AFRICA_HINTS = ["nigeria", "africa", "lagos", "abuja", "ng", "worldwide", "global", "anywhere", "remote"];

/** Roles open to Nigeria/Africa (or fully remote/global) sort first. */
export function africaFirst(a: Job, b: Job) {
  const score = (j: Job) => {
    const hay = `${j.location ?? ""} ${j.country ?? ""}`.toLowerCase();
    return AFRICA_HINTS.some((h) => hay.includes(h)) || j.is_remote ? 0 : 1;
  };
  const diff = score(a) - score(b);
  if (diff !== 0) return diff;
  return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime();
}

export async function fetchJobs(limit = 300): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_expired", false)
    .order("last_seen_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as Job[]).sort(africaFirst);
}

export async function fetchJobBySlug(slug: string): Promise<Job | null> {
  const { data, error } = await supabase.from("jobs").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as Job) ?? null;
}

export function employmentLabel(type: string) {
  switch (type) {
    case "INTERN":
      return "Internship";
    case "CONTRACTOR":
      return "Contract";
    case "PART_TIME":
      return "Part-time";
    case "TEMPORARY":
      return "Temporary";
    default:
      return "Full-time";
  }
}

export function salaryLabel(job: Job) {
  if (!job.salary_min && !job.salary_max) return null;
  const cur = job.salary_currency ?? "";
  const unit = job.salary_unit ? `/${job.salary_unit.toLowerCase()}` : "";
  const fmt = (n: number) => n.toLocaleString();
  if (job.salary_min && job.salary_max) return `${cur} ${fmt(job.salary_min)} – ${fmt(job.salary_max)}${unit}`.trim();
  return `${cur} ${fmt((job.salary_min ?? job.salary_max)!)}${unit}`.trim();
}

export function locationLabel(job: Job) {
  if (job.location) return job.location;
  return job.is_remote ? "Remote" : "See listing";
}

export function jobPostingSchema(job: Job) {
  const remote = job.is_remote;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.posted_at ?? job.last_seen_at.slice(0, 10),
    validThrough: new Date(new Date(job.last_seen_at).getTime() + 60 * 864e5).toISOString().slice(0, 10),
    employmentType: job.employment_type,
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocationType: remote ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: remote ? { "@type": "Country", name: "Nigeria" } : undefined,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location ?? "Remote",
        addressCountry: job.country ?? "NG",
      },
    },
    ...(job.salary_min || job.salary_max
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.salary_currency ?? "USD",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salary_min ?? job.salary_max,
              maxValue: job.salary_max ?? job.salary_min,
              unitText: job.salary_unit ?? "MONTH",
            },
          },
        }
      : {}),
    url: `https://techfaculty.ng/careers/jobs/${job.slug}`,
    directApply: false,
    identifier: { "@type": "PropertyValue", name: job.source_platform, value: job.slug },
  };
}
