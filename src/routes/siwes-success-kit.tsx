import { createFileRoute } from "@tanstack/react-router";
import SuccessKit from "@/pages/SuccessKit";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/siwes-success-kit")({
  head: () =>
    pageHead({
      title: "SIWES Success Kit — Templates, Logbook & Report Pack",
      description:
        "Land and finish your SIWES placement properly: free 7-step checklist plus the SIWES Success Kit — placement email templates, student CV, logbook pack and report outline.",
      path: "/siwes-success-kit",
    }),
  component: SuccessKit,
});
