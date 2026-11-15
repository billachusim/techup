import { createFileRoute } from "@tanstack/react-router";
import SideHustles from "@/pages/SideHustles";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/side-hustles/")({
  head: () =>
    pageHead({
      title: "Pay-per-Task Side Hustles in Nigeria, Paid Weekly",
      description:
        "Earn ₦5,000 to ₦10,000 per task doing small jobs for real businesses: video editing, social media, flyers, app testing, data entry and more. Paid weekly.",
      path: "/side-hustles",
    }),
  component: SideHustles,
});
