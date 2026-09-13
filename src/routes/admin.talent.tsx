import { createFileRoute } from "@tanstack/react-router";
import AdminTalent from "@/pages/AdminTalent";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/talent")({
  head: () =>
    pageHead({
      title: "Talent admin | Tech Faculty",
      description: "Administrative talent management for Tech Faculty.",
      path: "/admin/talent",
      noindex: true,
    }),
  component: AdminTalent,
});
