import { createFileRoute } from "@tanstack/react-router";
import StudyOnlineAfrica from "@/pages/StudyOnlineAfrica";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/study-online-africa")({
  head: () =>
    pageHead({
      title: "Study Tech Online from Anywhere in Africa",
      description:
        "Learn web development, data, AI, cybersecurity and design online with Tech Faculty NG from any African country: prices, certificate and how to pay in USD.",
      path: "/study-online-africa",
    }),
  component: StudyOnlineAfrica,
});
