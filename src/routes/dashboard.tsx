import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead({
      title: "Dashboard - Tech Faculty NG",
      description:
        "Access your Tech Faculty student dashboard. Track course progress, view upcoming classes, and manage your certifications.",
      path: "/dashboard",
      noindex: true,
    }),
  component: Dashboard,
});
