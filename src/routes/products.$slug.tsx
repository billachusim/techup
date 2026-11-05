import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/pages/ProductDetail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/products/$slug")({
  // Looked up in the loader so the apps data loads with this route.
  loader: async ({ params }) => {
    const { getApp } = await import("@/data/apps");
    const app = getApp(params.slug);
    return app ? { name: app.name, tagline: app.tagline, summary: app.summary } : null;
  },
  head: ({ loaderData: app, params }) =>
    pageHead({
      title: app ? `${app.name}: ${app.tagline} (Android & iPhone app)` : "App Not Found",
      description: app ? app.summary.slice(0, 160) : "This app page is not available.",
      path: `/products/${params.slug}`,
      noindex: !app,
    }),
  component: ProductDetail,
});
