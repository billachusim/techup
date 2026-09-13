import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy WordPress redirect: /tag/* -> /blog
export const Route = createFileRoute("/tag/$")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", replace: true });
  },
});
