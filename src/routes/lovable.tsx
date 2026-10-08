import { createFileRoute } from "@tanstack/react-router";
import LovablePage from "@/pages/Lovable";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/lovable")({
  head: () =>
    pageHead({
      title: "Build Apps with Lovable",
      description:
        "Tech Faculty recommends Lovable — the AI platform we use to build production web apps. Describe what you want, ship in minutes.",
      path: "/lovable",
    }),
  component: LovablePage,
});
