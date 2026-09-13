import { createFileRoute } from "@tanstack/react-router";
import Talent from "@/pages/Talent";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/talent/")({
  head: () =>
    pageHead({
      title: "Tech Faculty Talent Pool | Remote Tech Work in Nigeria",
      description:
        "Join the Tech Faculty talent pool: build one profile, get matched to paid remote and on-site tech work with businesses across Nigeria and Africa. Free to join.",
      path: "/talent",
    }),
  component: Talent,
});
