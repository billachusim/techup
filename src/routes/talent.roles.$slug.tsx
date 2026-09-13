import { createFileRoute } from "@tanstack/react-router";
import TalentRoleDetail from "@/pages/TalentRoleDetail";
import { fetchRoleBySlug } from "@/lib/talent";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/talent/roles/$slug")({
  loader: async ({ params }) => {
    try {
      const role = await fetchRoleBySlug(params.slug);
      if (!role) return null;
      return {
        title: `${role.title} at ${role.company} | Tech Faculty`.slice(0, 60),
        description: role.summary.slice(0, 158),
      };
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Open Role | Tech Faculty Talent",
      description:
        loaderData?.description ??
        "View this open role on the Tech Faculty talent marketplace.",
      path: `/talent/roles/${params.slug}`,
      type: "article",
    }),
  component: TalentRoleDetail,
});
