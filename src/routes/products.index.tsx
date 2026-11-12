import { createFileRoute } from "@tanstack/react-router";
import Products from "@/pages/Products";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  head: () =>
    pageHead({
      title: "Software Products",
      description:
        "Mobile and web apps by Tech Faculty: Dear Claire, Alter Ego, Eavesdrop, AI Clopedia, ExamsAi.ng (JAMB/WAEC AI coach), SkillFlow, UnilagLife, Pet Care Card, Baby Care Cards, Plant Care Cards and AutoPR.",
      path: "/products",
    }),
  component: Products,
});
