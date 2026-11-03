import { createFileRoute } from "@tanstack/react-router";
import AdminReps from "@/pages/AdminReps";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/reps")({
  head: () =>
    pageHead({
      title: "Admin · Field reps",
      description:
        "Field reps' share links, sign-ups and commission for Tech Faculty NG.",
      path: "/admin/reps",
      noindex: true,
    }),
  component: AdminReps,
});
