import { createFileRoute } from "@tanstack/react-router";
import Login from "@/pages/Login";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    pageHead({
      title: "Sign In | Tech Faculty NG",
      description:
        "Sign in to your Tech Faculty account to access your dashboard, courses and certificates.",
      path: "/login",
      noindex: true,
    }),
  component: Login,
});
