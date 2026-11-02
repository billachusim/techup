import { createFileRoute } from "@tanstack/react-router";
import AdminStudents from "@/pages/AdminStudents";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/students")({
  head: () =>
    pageHead({
      title: "Admin · Students",
      description: "Staff area to find students, filter by department, contact them, review work and follow up payments.",
      path: "/admin/students",
      noindex: true,
    }),
  component: AdminStudents,
});
