import { createFileRoute } from "@tanstack/react-router";
import Products from "@/pages/Products";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/products")({
  head: () =>
    pageHead({
      title: "Software Products — Tech Faculty NG",
      description:
        "Explore the mobile apps built by Tech Faculty and Social Faculty — Dear Claire, Alter Ego, Eavesdrop and AI Clopedia, live on the App Store and Google Play.",
      path: "/products",
    }),
  component: Products,
});
