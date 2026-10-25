import { createFileRoute } from "@tanstack/react-router";
import BusinessPartnerships from "@/pages/BusinessPartnerships";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/business-partnerships")({
  head: () =>
    pageHead({
      title: "Staff Training Packages for Businesses",
      description:
        "Staff training packages for Nigerian businesses: AI for teams, digital skills, data and reporting, cybersecurity awareness. Request a quote from Tech Faculty NG, licensed by FMSTI through NBTI.",
      path: "/business-partnerships",
    }),
  component: BusinessPartnerships,
});
