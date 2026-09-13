import { createFileRoute } from "@tanstack/react-router";
import SIWES from "@/pages/SIWES";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/siwes")({
  head: () =>
    pageHead({
      title: "SIWES & Industrial Training - Tech Faculty NG | IT Placement",
      description:
        "Do your SIWES/IT placement at Tech Faculty NG, Nnewi. Learn & Pay for mentored real-world experience or Tutor & Earn to teach and get paid. FMSTI-licensed.",
      path: "/siwes",
    }),
  component: SIWES,
});
