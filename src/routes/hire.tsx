import { createFileRoute } from "@tanstack/react-router";
import Hire from "@/pages/Hire";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hire")({
  head: () =>
    pageHead({
      title: "Hire Vetted Tech Talent in Nigeria | Tech Faculty",
      description:
        "Tell us what your business needs and we match you with vetted Nigerian tech talent — developers, data analysts, designers, marketers and support — remote or on-site.",
      path: "/hire",
    }),
  component: Hire,
});
