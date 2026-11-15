import { createFileRoute } from "@tanstack/react-router";
import ServiceDetail from "@/pages/ServiceDetail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const { getService, businessPrice } = await import("@/data/services");
    const { naira } = await import("@/lib/fees");
    const s = getService(params.slug);
    return s
      ? {
          name: s.name,
          summary: s.summary,
          price: `From ${naira(businessPrice(s))} ${s.unit}`,
        }
      : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData ? `${loaderData.name} in Nigeria` : "Service Not Found",
      description: loaderData
        ? `${loaderData.price}. ${loaderData.summary}`.slice(0, 160)
        : "This service is not available.",
      path: `/services/${params.slug}`,
      noindex: !loaderData,
    }),
  component: ServiceDetail,
});
