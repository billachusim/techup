import { createFileRoute } from "@tanstack/react-router";
import DepartmentsIndex from "@/pages/DepartmentsIndex";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/departments/")({
  head: () =>
    pageHead({
      title: "Tech Departments & Bootcamps in Nigeria | Tech Faculty",
      description:
        "Explore Tech Faculty departments: web development, data science, AI, cybersecurity, UI/UX design, digital marketing and more — in person nationwide or online.",
      path: "/departments",
    }),
  component: DepartmentsIndex,
});
