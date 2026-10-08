import { createFileRoute } from "@tanstack/react-router";
import Outcomes from "@/pages/Outcomes";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/outcomes")({
  head: () =>
    pageHead({
      title: "Student Outcomes - Tech Faculty NG | How We Count",
      description:
        "How Tech Faculty NG counts its 6,000+ students trained and 75% employed within six months, with live Talent Pool numbers, Google reviews and certificate checks.",
      path: "/outcomes",
    }),
  component: Outcomes,
});
