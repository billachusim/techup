import { createFileRoute } from "@tanstack/react-router";
import AdminLookup from "@/pages/AdminLookup";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/lookup")({
  head: () =>
    pageHead({
      title: "Admin · Student Lookup",
      description:
        "Find a Tech Faculty NG student and see their enrolments, payments, work and certificates.",
      path: "/admin/lookup",
      noindex: true,
    }),
  component: AdminLookup,
});
