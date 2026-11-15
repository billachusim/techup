import "./lib/error-capture";
import { workerCtx } from "./lib/worker-ctx";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { foreignCountry, nigerianState } from "./lib/visitor-state";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Visitor's Nigerian state for the homepage hero line, from Cloudflare's IP lookup.
// Answered here, before the app, so it costs no SSR work and is never cached.
function visitorStateResponse(request: Request): Response {
  const cf = (request as Request & { cf?: { country?: unknown; region?: unknown } }).cf;
  const h = request.headers;
  // request.cf is not always passed through by the host, so fall back to the
  // geolocation headers Cloudflare (and some hosts) add to proxied requests.
  const country = cf?.country ?? h.get("cf-ipcountry") ?? h.get("x-vercel-ip-country") ?? h.get("x-country-code") ?? undefined;
  const region = cf?.region ?? h.get("cf-region") ?? h.get("x-vercel-ip-country-region-name") ?? h.get("x-region") ?? undefined;
  const body: Record<string, unknown> = {
    state: nigerianState(country, region),
    country: foreignCountry(country),
    cc: typeof country === "string" ? country : null,
  };
  // ?debug=1 lists which location-related header names arrived (names only, no values).
  if (new URL(request.url).searchParams.get("debug") === "1") {
    body.cf = Boolean(cf);
    body.headers = [...h.keys()].filter((k) => /country|region|city|geo|^cf-|location|lat|lon/i.test(k));
  }
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json", "cache-control": "private, no-store" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    if (new URL(request.url).pathname === "/api/public/visitor-state") {
      return visitorStateResponse(request);
    }
    try {
      const handler = await getServerEntry();
      const response = await workerCtx.run(ctx as { waitUntil?: (p: Promise<unknown>) => void }, () =>
        handler.fetch(request, env, ctx),
      );
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
