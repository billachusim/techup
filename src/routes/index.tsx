import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Tech Faculty — Get Certified & Employed in Tech",
      description:
        "Accredited bootcamps in software engineering, data science, AI and cybersecurity. 6,000+ students trained, 87% employed. Learn in person or online.",
      path: "/",
    }),
  component: Index,
});
