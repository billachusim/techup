import { createFileRoute } from "@tanstack/react-router";
import SideHustles from "@/pages/SideHustles";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/side-hustles/$slug")({
  loader: async ({ params }) => {
    const { getService, talentPay } = await import("@/data/services");
    const { naira } = await import("@/lib/fees");
    const s = getService(params.slug);
    return s ? { title: s.hustleTitle, pay: naira(talentPay(s)) } : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData
        ? `${loaderData.title} Side Hustle in Nigeria, Pay per Task`
        : "Side Hustle Not Found",
      description: loaderData
        ? `Work as a ${loaderData.title} from Nigeria. Earn ${loaderData.pay} per task, paid weekly, 50 openings. Join the Tech Faculty talent pool to start.`
        : "This side hustle is not available.",
      path: `/side-hustles/${params.slug}`,
      noindex: !loaderData,
    }),
  component: SideHustles,
});
