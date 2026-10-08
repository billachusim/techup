import { createFileRoute } from "@tanstack/react-router";
import PaymentSuccess from "@/pages/PaymentSuccess";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/payment-success")({
  head: () =>
    pageHead({
      title: "Payment Status",
      description: "Check whether your Tech Faculty payment has been confirmed.",
      path: "/payment-success",
      noindex: true,
    }),
  component: PaymentSuccess,
});
