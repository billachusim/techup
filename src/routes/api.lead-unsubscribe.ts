import { createFileRoute } from "@tanstack/react-router";

// The unsubscribe link in lead follow-up emails. Opening the link only shows a
// button, because mail scanners open links on their own; pressing it stops
// the emails.
const page = (title: string, body: string) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Tech Faculty NG</title></head>` +
      `<body style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:48px auto;padding:0 16px;color:#333;line-height:1.5">` +
      `<p style="font-size:12px;letter-spacing:2px;font-weight:700;color:#000">TECH FACULTY</p><h1 style="font-size:22px;color:#000">${title}</h1>${body}</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

const tokenOf = (value: unknown) =>
  typeof value === "string"
    ? value.replace(/[^0-9a-fA-F-]/g, "").slice(0, 36)
    : "";

export const Route = createFileRoute("/api/lead-unsubscribe")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = tokenOf(new URL(request.url).searchParams.get("t"));
        if (!token)
          return page(
            "Link not recognised",
            "<p>This unsubscribe link is incomplete.</p>",
          );
        return page(
          "Stop these emails?",
          `<p>You will get no more follow-up emails about your enquiry. Messages you ask us for, such as payment details, still reach you.</p>` +
            `<form method="post"><input type="hidden" name="t" value="${token}"><button type="submit" style="background:#000;color:#fff;border:0;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer">Unsubscribe</button></form>`,
        );
      },
      POST: async ({ request }) => {
        const form = await request.formData().catch(() => null);
        const token = tokenOf(form?.get("t"));
        const [{ supabaseAdmin }, { unsubscribeLeadFollowups }] =
          await Promise.all([
            import("@/integrations/supabase/client.server"),
            import("@/lib/lead-followups.server"),
          ]);
        try {
          const done = await unsubscribeLeadFollowups(supabaseAdmin, token);
          return done
            ? page(
                "You're unsubscribed",
                "<p>We won't send you any more follow-up emails. If you change your mind, message us on WhatsApp.</p>",
              )
            : page(
                "Link not recognised",
                "<p>We couldn't find this unsubscribe link. Reply to the email and we will stop them for you.</p>",
              );
        } catch (e) {
          console.error("lead-unsubscribe error", (e as Error).message);
          return page(
            "Something went wrong",
            "<p>Please try again, or reply to the email and we will stop them for you.</p>",
          );
        }
      },
    },
  },
});
