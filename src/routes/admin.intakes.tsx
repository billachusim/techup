import { createFileRoute } from "@tanstack/react-router";
import AdminIntakes from "@/pages/AdminIntakes";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/intakes")({
  head: () =>
    pageHead({
      title: "Admin · Intakes",
      description:
        "Set the next intake dates shown on Tech Faculty NG department pages.",
      path: "/admin/intakes",
      noindex: true,
    }),
  component: AdminIntakes,
});
