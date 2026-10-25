// Tests for the money path: pricing, checkout, payment checks and course access.
// The edge functions are Deno code that imports from URLs, so those imports are
// pointed at small local stand-ins and the functions run unchanged under Node.
import path from "node:path";
import { defineConfig } from "vitest/config";

const stub = (file: string) => path.resolve(__dirname, "tests/payments/stubs", file);

export default defineConfig({
  resolve: {
    alias: [
      { find: "https://deno.land/std@0.168.0/http/server.ts", replacement: stub("deno-serve.ts") },
      { find: "https://esm.sh/@supabase/supabase-js@2", replacement: stub("supabase.ts") },
      { find: /^@\//, replacement: `${path.resolve(__dirname, "src")}/` },
    ],
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
