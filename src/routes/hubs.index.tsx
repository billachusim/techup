import { createFileRoute } from "@tanstack/react-router";
import Hubs from "@/pages/Hubs";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hubs/")({
  head: () =>
    pageHead({
      title: "Tech Hubs in Nigeria & Africa — Directory by City",
      description:
        "Find tech hubs, innovation centres and training institutes across Nigeria and Africa by city and course area. Tell us what you want to study and we help you enrol.",
      path: "/hubs",
    }),
  component: Hubs,
});
