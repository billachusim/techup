import { createFileRoute } from "@tanstack/react-router";
import TalentPool from "@/pages/TalentPool";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/talent/pool/")({
  head: () =>
    pageHead({
      title: "Hire Vetted African Tech Talent | Tech Faculty",
      description:
        "Browse the Tech Faculty talent pool: developers, designers, analysts, marketers and project managers across Nigeria and Africa, ready for remote and on-site work.",
      path: "/talent/pool",
    }),
  component: TalentPool,
});
