import { createFileRoute } from "@tanstack/react-router";
import AdminSlack from "@/pages/AdminSlack";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/slack")({
  head: () =>
    pageHead({
      title: "Slack assistant",
      description: "Staff tools for the Tech Faculty NG Slack assistant and weekly community update.",
      path: "/admin/slack",
      noindex: true,
    }),
  component: AdminSlack,
});
