import { createFileRoute } from "@tanstack/react-router";
import AdminLeads from "@/pages/AdminLeads";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/leads")({
  head: () =>
    pageHead({
      title: "Leads",
      description: "Staff inbox for following up Tech Faculty enquiries.",
      path: "/admin/leads",
      noindex: true,
    }),
  component: AdminLeads,
});
