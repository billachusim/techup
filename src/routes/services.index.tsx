import { createFileRoute } from "@tanstack/react-router";
import Services from "@/pages/Services";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () =>
    pageHead({
      title: "Pay-per-Task Services for Small Businesses in Nigeria",
      description:
        "100+ pay-per-task services for Nigerian small businesses: AI videos, social media, field reps, websites, app testing and cybersecurity. No hiring, pay per task.",
      path: "/services",
    }),
  component: Services,
});
