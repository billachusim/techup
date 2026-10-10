import { createFileRoute } from "@tanstack/react-router";
import ExternalPlatformJobs from "@/pages/ExternalPlatformJobs";
import { platformBySlug } from "@/data/jobPlatforms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/careers/platforms/$platformSlug")({
  head: ({ params }) => {
    const platform = platformBySlug(params.platformSlug);
    return pageHead({
      title: platform
        ? `${platform.keyword} for Nigerians & Africans (Remote)`
        : "Platform Not Found",
      description: platform
        ? `Latest ${platform.keyword.toLowerCase()} open to Nigerian and African talent: ${platform.blurb} Pay, eligibility and how to apply.`
        : "This job platform page is not available.",
      path: `/careers/platforms/${params.platformSlug}`,
      noindex: !platform,
    });
  },
  component: ExternalPlatformJobs,
});
