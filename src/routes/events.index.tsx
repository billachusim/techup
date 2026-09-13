import { createFileRoute } from "@tanstack/react-router";
import Events from "@/pages/Events";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/events/")({
  head: () =>
    pageHead({
      title: "Tech Events in Nigeria 2026 — AI, Data & Developer Conferences",
      description:
        "Find upcoming tech events in Nigeria and Africa: AI and data conferences, developer meetups, hackathons, cybersecurity workshops, remote work summits and free online webinars, updated weekly.",
      path: "/events",
    }),
  component: Events,
});
