import { createFileRoute } from "@tanstack/react-router";
import Locations from "@/pages/Locations";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/locations/")({
  head: () =>
    pageHead({
      title: "22 Tech Training Campuses Across Nigeria",
      description:
        "Find a Tech Faculty NG campus in Lagos, Abuja, Enugu, Kano, Nnewi and 17 more cities. In-person tech courses and SIWES, most at Technology Incubation Centres.",
      path: "/locations",
    }),
  component: Locations,
});
