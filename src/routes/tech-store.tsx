import { createFileRoute } from "@tanstack/react-router";
import TechStore from "@/pages/TechStore";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tech-store")({
  head: () =>
    pageHead({
      title:
        "Tech Store Nigeria — Power Banks, Laptops & Accessories | Tech Faculty",
      description:
        "Buy affordable tech in Nigeria: locally assembled Battery Bank power banks, student laptops, laptop accessories, custom phone cases and robotics kits. Order on WhatsApp — nationwide delivery, pay on delivery.",
      path: "/tech-store",
    }),
  component: TechStore,
});
