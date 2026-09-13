import { createFileRoute } from "@tanstack/react-router";
import PaymentSuccess from "@/pages/PaymentSuccess";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/payment-success")({
  head: () =>
    pageHead({
      title: "Payment Successful — Tech Faculty",
      description: "Your Tech Faculty payment was received successfully.",
      path: "/payment-success",
      noindex: true,
    }),
  component: PaymentSuccess,
});
