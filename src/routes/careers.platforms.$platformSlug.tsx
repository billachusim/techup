import { createFileRoute } from "@tanstack/react-router";
import ExternalPlatformJobs from "@/pages/ExternalPlatformJobs";
import { platformBySlug } from "@/data/jobPlatforms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/careers/platforms/$platformSlug")({
  head: ({ params }) => {
    const platform = platformBySlug(params.platformSlug);
    return pageHead({
      title: platform
        ? `${platform.name} Jobs for African Talent | Tech Faculty`.slice(0, 60)
        : "Platform not found | Tech Faculty",
      description: platform
        ? `Browse independent ${platform.name} opportunities and create your platform account through Tech Faculty.`
        : "This job platform page is not available.",
      path: `/careers/platforms/${params.platformSlug}`,
      noindex: !platform,
    });
  },
  component: ExternalPlatformJobs,
});
