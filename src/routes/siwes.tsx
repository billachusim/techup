import { createFileRoute } from "@tanstack/react-router";
import SIWES from "@/pages/SIWES";
import { ogImage, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/siwes")({
  head: () =>
    pageHead({
      title: "SIWES & IT Placement in Nigeria",
      description:
        "Do your SIWES/IT placement at Tech Faculty NG, with no separate placement fee on site. Learn & Pay for mentored real-world experience or Tutor & Earn to teach and get paid.",
      path: "/siwes",
      image: ogImage("siwes.jpg"),
    }),
  component: SIWES,
});
