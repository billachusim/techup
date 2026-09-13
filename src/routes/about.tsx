import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Us - Tech Faculty NG | Our Mission & Story",
      description:
        "Tech Faculty NG — licensed by FMSTI via NBTI. We train, certify, and place the next generation of Nigerian tech professionals from Nnewi, Anambra State.",
      path: "/about",
    }),
  component: About,
});
