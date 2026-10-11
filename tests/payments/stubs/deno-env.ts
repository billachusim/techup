// Deno.env for edge functions running under Node.
const env: Record<string, string | undefined> = {
  FLUTTERWAVE_SECRET_KEY: "FLWSECK_TEST-key",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role",
};

(globalThis as unknown as { Deno: unknown }).Deno = {
  env: { get: (key: string) => env[key] },
};

export function setEnv(key: string, value: string | undefined) {
  env[key] = value;
}
