import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy WordPress redirect -> /blog
export const Route = createFileRoute(
  "/why-90-of-tech-learners-quit-but-you-dont-have-to",
)({
  beforeLoad: () => {
    throw redirect({ to: "/blog", replace: true });
  },
});
