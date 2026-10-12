import { createFileRoute } from "@tanstack/react-router";
import AdminActivity from "@/pages/AdminActivity";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/activity")({
  head: () =>
    pageHead({
      title: "Activity log",
      description: "Record of every admin action on Tech Faculty students and records.",
      path: "/admin/activity",
      noindex: true,
    }),
  component: AdminActivity,
});
