import { createFileRoute } from "@tanstack/react-router";
import BusinessPartnerships from "@/pages/BusinessPartnerships";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/business-partnerships")({
  head: () =>
    pageHead({
      title: "Business Partnerships | Tech Faculty NG",
      description:
        "Partner with Tech Faculty NG for corporate training, AI workshops, business digitization, and tech talent pipelines. FMSTI-licensed, based in Nnewi, Nigeria.",
      path: "/business-partnerships",
    }),
  component: BusinessPartnerships,
});
