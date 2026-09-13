import { createFileRoute } from "@tanstack/react-router";
import Locations from "@/pages/Locations";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/locations/")({
  head: () =>
    pageHead({
      title: "Tech Faculty Campuses in Nigeria — Find a Campus Near You",
      description:
        "Tech Faculty operates physically inside Technology Incubation Centres nationwide via our partnership with the National Board for Technology Incubation.",
      path: "/locations",
    }),
  component: Locations,
});
