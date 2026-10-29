import { createFileRoute } from "@tanstack/react-router";
import PayBalance from "@/pages/PayBalance";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/pay-balance")({
  head: () =>
    pageHead({
      title: "Pay Your Balance",
      description: "Pay the balance of your Tech Faculty NG instalment plan.",
      path: "/pay-balance",
      noindex: true,
    }),
  component: PayBalance,
});
