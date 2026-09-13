import { createFileRoute } from "@tanstack/react-router";
import JobDetail from "@/pages/JobDetail";
import { fetchJobBySlug } from "@/lib/jobs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/careers/jobs/$slug")({
  loader: async ({ params }) => {
    try {
      const job = await fetchJobBySlug(params.slug);
      if (!job) return null;
      return {
        title: `${job.title} at ${job.company} | Tech Faculty Jobs`.slice(0, 60),
        description: job.description.slice(0, 155),
      };
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Tech Job | Tech Faculty Careers",
      description:
        loaderData?.description ??
        "View this tech role on the Tech Faculty talent marketplace.",
      path: `/careers/jobs/${params.slug}`,
      type: "article",
    }),
  component: JobDetail,
});
