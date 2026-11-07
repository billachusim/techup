import { createFileRoute } from "@tanstack/react-router";
import AdminClassVideos from "@/pages/AdminClassVideos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/class-videos")({
  head: () =>
    pageHead({
      title: "Admin · Class videos",
      description: "Manage class video links for Tech Faculty NG.",
      path: "/admin/class-videos",
      noindex: true,
    }),
  component: AdminClassVideos,
});
