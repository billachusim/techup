import { createFileRoute } from "@tanstack/react-router";
import AdminStudents from "@/pages/AdminStudents";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/students")({
  head: () =>
    pageHead({
      title: "Student work review | Tech Faculty",
      description: "Staff area for reviewing and scoring Tech Faculty student submissions.",
      path: "/admin/students",
      noindex: true,
    }),
  component: AdminStudents,
});
