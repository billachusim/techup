import { createFileRoute } from "@tanstack/react-router";
import OrderComplete from "@/pages/OrderComplete";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/order-complete")({
  head: () =>
    pageHead({
      title: "Order Status",
      description: "Check whether your Tech Faculty NG payment has been confirmed.",
      path: "/order-complete",
      noindex: true,
    }),
  component: OrderComplete,
});
