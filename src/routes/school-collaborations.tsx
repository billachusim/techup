import { createFileRoute } from "@tanstack/react-router";
import SchoolCollaborations from "@/pages/SchoolCollaborations";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/school-collaborations")({
  head: () =>
    pageHead({
      title: "University Bootcamps & School Partnerships",
      description:
        "Bring tech bootcamps to your campus. Tech Faculty NG partners with universities for Python, AI, Data Science training and student certification programs. Licensed by FMSTI via NBTI.",
      path: "/school-collaborations",
    }),
  component: SchoolCollaborations,
});
