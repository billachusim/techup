import { createFileRoute } from "@tanstack/react-router";
import AdminHome from "@/pages/AdminHome";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () =>
    pageHead({
      title: "Admin | Tech Faculty",
      description: "Staff area for managing Tech Faculty students, talent and certificates.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminHome,
});
