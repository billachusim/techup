// Lets server routes keep work running after they respond (Cloudflare `ctx.waitUntil`).
// src/server.ts stores each request's execution context here.
import { AsyncLocalStorage } from "node:async_hooks";

type Ctx = { waitUntil?: (p: Promise<unknown>) => void };
export const workerCtx = new AsyncLocalStorage<Ctx | undefined>();

/** Runs `task` after the response when the platform allows it; otherwise awaits it first. */
export async function runAfterResponse(task: () => Promise<unknown>): Promise<void> {
  const ctx = workerCtx.getStore();
  const p = task().catch((e) => console.error("background task failed", (e as Error).message));
  if (ctx?.waitUntil) ctx.waitUntil(p);
  else await p;
}
