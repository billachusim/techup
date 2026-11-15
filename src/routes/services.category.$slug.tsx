import { createFileRoute } from "@tanstack/react-router";
import Services from "@/pages/Services";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services/category/$slug")({
  // Looked up in the loader so the services data loads with this route, not the main bundle.
  loader: async ({ params }) => {
    const { getServiceCategory } = await import("@/data/services");
    const c = getServiceCategory(params.slug);
    return c ? { name: c.name, tagline: c.tagline } : null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData
        ? `${loaderData.name} Services in Nigeria, Pay per Task`
        : "Service Category Not Found",
      description: loaderData
        ? `${loaderData.tagline} Vetted Tech Faculty talent, fixed prices, no hiring. Send a brief today.`.slice(
            0,
            160,
          )
        : "This service category is not available.",
      path: `/services/category/${params.slug}`,
      noindex: !loaderData,
    }),
  component: Services,
});
