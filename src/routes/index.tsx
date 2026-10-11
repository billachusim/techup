import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Tech Training in Anambra & Across Nigeria",
      description:
        "Licensed by FMSTI through NBTI. Coding, data, AI and cybersecurity from ₦50,000; 6,000+ trained, 75% employed. 22 campuses or online, free on-site SIWES.",
      path: "/",
    }),
  component: Index,
});
