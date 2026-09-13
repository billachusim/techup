import { createFileRoute } from "@tanstack/react-router";
import VirtualSIWES from "@/pages/VirtualSIWES";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/virtual-siwes")({
  head: () =>
    pageHead({
      title: "Virtual SIWES Nigeria — Online IT, Logbook Signed",
      description:
        "Do your SIWES or IT online from any Nigerian city with a licensed host. We review, fill, sign and stamp your logbook, then waybill it back to you — ₦45,000 + ₦15,000.",
      path: "/virtual-siwes",
    }),
  component: VirtualSIWES,
});
