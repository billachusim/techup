import { defineConfig, type ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  appType: "spa",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "serve-verify-static",
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: IncomingMessage, _res: ServerResponse, next: () => void) => {
          if (req.url?.startsWith("/verify")) {
            if (req.url === "/verify" || req.url === "/verify/") {
              req.url = "/verify/index.html";
            }
          }
          next();
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
