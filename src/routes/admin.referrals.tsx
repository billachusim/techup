import { createFileRoute } from "@tanstack/react-router";
import AdminReferrals from "@/pages/AdminReferrals";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/referrals")({
  head: () =>
    pageHead({
      title: "Admin · Referrals",
      description: "Alumni referrals and graduate rewards for Tech Faculty NG.",
      path: "/admin/referrals",
      noindex: true,
    }),
  component: AdminReferrals,
});
