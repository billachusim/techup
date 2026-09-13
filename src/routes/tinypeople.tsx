import { createFileRoute } from "@tanstack/react-router";
import TinyPeople from "@/pages/TinyPeople";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/tinypeople")({
  head: () =>
    pageHead({
      title: "Tiny People AI in Africa | Tech Faculty × Natura Inc",
      description:
        "Tech Faculty has partnered with Natura Inc to bring Tiny People AI — a powerful personal AI agent on WhatsApp, Telegram and iMessage — to Africa.",
      path: "/tinypeople",
    }),
  component: TinyPeople,
});
