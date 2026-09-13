import { createFileRoute } from "@tanstack/react-router";
import Verify from "@/pages/Verify";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/verify/$")({
  head: () =>
    pageHead({
      title: "Verify Certificate | Tech Faculty NG",
      description:
        "Verify and authenticate certificates issued by Tech Faculty NG using the official online certificate verification system.",
      path: "/verify",
    }),
  component: Verify,
});
