import { createFileRoute } from "@tanstack/react-router";
import SalaryReport from "@/pages/SalaryReport";
import { pageHead } from "@/lib/seo";
import { articleOgImage } from "@/lib/og-image";

export const Route = createFileRoute("/reports/nigeria-tech-salaries")({
  head: () =>
    pageHead({
      title: "Nigerian Tech Salaries 2026: Sourced Pay by Role",
      description:
        "Sourced 2026 report on Nigerian tech pay: monthly naira ranges for 65 roles, the minimum wage gap, what startups pay senior hires, a free CSV and how to cite it.",
      path: "/reports/nigeria-tech-salaries",
      type: "article",
      image: articleOgImage({
        title: "Nigerian Tech Salaries 2026: What 65 Tech Roles Pay",
        description:
          "Sourced monthly naira pay ranges by role, with free data to download.",
        tags: ["Research"],
      }),
      publishedTime: "2026-10-25",
      modifiedTime: "2026-10-25",
    }),
  component: SalaryReport,
});
