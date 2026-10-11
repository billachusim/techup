// Stand-in for Deno's std serve(): keeps the handler so a test can call it.
type Handler = (req: Request) => Response | Promise<Response>;

let handler: Handler | null = null;

export function serve(h: Handler) {
  handler = h;
}

export function servedHandler(): Handler {
  if (!handler) throw new Error("No edge function has called serve() yet");
  return handler;
}
