import { createFileRoute } from "@tanstack/react-router";
import TalentDashboard from "@/pages/TalentDashboard";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/talent/dashboard")({
  head: () =>
    pageHead({
      title: "Talent dashboard | Tech Faculty",
      description:
        "Track your matches, engagements and payments on the Tech Faculty talent platform.",
      path: "/talent/dashboard",
      noindex: true,
    }),
  component: TalentDashboard,
});
