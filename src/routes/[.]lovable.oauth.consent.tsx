import { createFileRoute } from "@tanstack/react-router";
import OAuthConsent from "@/pages/OAuthConsent";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/.lovable/oauth/consent")({
  head: () =>
    pageHead({
      title: "Authorize Access | Tech Faculty",
      description: "Authorize an application to access your Tech Faculty account.",
      path: "/.lovable/oauth/consent",
      noindex: true,
    }),
  component: OAuthConsent,
});
