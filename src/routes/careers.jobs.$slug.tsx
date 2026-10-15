import { createFileRoute } from "@tanstack/react-router";
import JobDetail from "@/pages/JobDetail";
import { pageHead } from "@/lib/seo";

/** Lead with what searchers want (remote, apply), then the role summary. */
function jobDescription(title: string, company: string, body: string) {
  const lead = `Remote ${title} role at ${company}. See requirements, pay and how to apply. `;
  const rest = body.replace(/\s+/g, " ").trim();
  const text = lead + rest;
  return text.length <= 158 ? text : text.slice(0, 155).replace(/\s+\S*$/, "") + "…";
}

export const Route = createFileRoute("/careers/jobs/$slug")({
  loader: async ({ params }) => {
    try {
      const { fetchJobBySlug } = await import("@/lib/jobs");
      const job = await fetchJobBySlug(params.slug);
      if (!job) return null;
      return {
        title: `${job.company} Job: ${job.title}`,
        description: jobDescription(job.title, job.company, job.description),
      };
    } catch {
      // A failed lookup isn't a missing page: keep the generic, indexable head.
      return undefined;
    }
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Tech Job",
      description:
        loaderData?.description ??
        "View this tech role on the Tech Faculty talent marketplace.",
      path: `/careers/jobs/${params.slug}`,
      type: "article",
      noindex: loaderData === null,
    }),
  component: JobDetail,
});
