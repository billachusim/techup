import { createFileRoute } from "@tanstack/react-router";
import TalentProfile from "@/pages/TalentProfile";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/talent/profile")({
  head: () =>
    pageHead({
      title: "My talent profile | Tech Faculty",
      description:
        "Manage your Tech Faculty talent profile, skills and availability.",
      path: "/talent/profile",
      noindex: true,
    }),
  component: TalentProfile,
});
