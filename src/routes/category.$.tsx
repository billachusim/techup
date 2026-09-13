import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy WordPress redirect: /category/* -> /blog
export const Route = createFileRoute("/category/$")({
  beforeLoad: () => {
    throw redirect({ to: "/blog", replace: true });
  },
});
