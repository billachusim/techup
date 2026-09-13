import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy redirect: /tech -> /
export const Route = createFileRoute("/tech")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
