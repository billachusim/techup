import { createFileRoute } from "@tanstack/react-router";
import Careers from "@/pages/Careers";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/careers/")({
  head: () =>
    pageHead({
      title: "Tech Jobs & Talent Marketplace | Tech Faculty",
      description:
        "Build one talent profile and get matched to verified tech roles and business projects across Nigeria and Africa, or hire skilled African talent.",
      path: "/careers",
    }),
  component: Careers,
});
