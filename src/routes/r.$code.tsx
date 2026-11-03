import { createFileRoute, redirect } from "@tanstack/react-router";
import { normalizeRef } from "@/lib/ref-code";

// Short share link for field reps' QR cards: /r/CODE → /?ref=CODE, where the
// root route saves the code.
export const Route = createFileRoute("/r/$code")({
  beforeLoad: ({ params }) => {
    const code = normalizeRef(params.code);
    throw redirect({
      href: code ? `/?ref=${encodeURIComponent(code)}` : "/",
      statusCode: 302,
    });
  },
});
