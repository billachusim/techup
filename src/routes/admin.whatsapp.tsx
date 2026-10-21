import { createFileRoute } from "@tanstack/react-router";
import AdminWhatsApp from "@/pages/AdminWhatsApp";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin/whatsapp")({
  head: () =>
    pageHead({
      title: "WhatsApp inbox",
      description: "Staff WhatsApp Business inbox for Tech Faculty chats, replies and message templates.",
      path: "/admin/whatsapp",
      noindex: true,
    }),
  component: AdminWhatsApp,
});
