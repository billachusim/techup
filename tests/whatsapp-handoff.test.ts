import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FOUNDER_WHATSAPP_NUMBER, HANDOFF_ORDER, handoffMessage } from "@/lib/whatsapp-handoff";
import { renderStoredBody } from "@/lib/whatsapp-render";

const SITE = "https://techfaculty.ng";
const ROUTES_DIR = resolve(process.cwd(), "src/routes");

/** Route files that exist, e.g. "virtual-siwes.tsx", "siwes.courses.index.tsx". */
const ROUTE_FILES = new Set(readdirSync(ROUTES_DIR).filter((f) => f.endsWith(".tsx")));

/** Maps a URL path to the route file that must exist for it to resolve. */
function routeFileFor(path: string): string {
  const segs = path.split("/").filter(Boolean);
  if (segs.length === 0) return "index.tsx";
  if (segs.length === 1) return `${segs[0]}.tsx`;
  return `${segs.join(".")}.index.tsx`;
}

describe("handoff preset links", () => {
  it("every Tech Faculty link points at a page or homepage anchor that exists", () => {
    for (const kind of HANDOFF_ORDER) {
      const urls = handoffMessage(kind, { name: "Ada" }).match(new RegExp(`${SITE}[^\\s]*`, "g")) ?? [];
      for (const url of urls) {
        const [path, hash] = url.slice(SITE.length).split("#");
        const page = (path ?? "").replace(/\/$/, "");
        if (hash) {
          // homepage anchors: the free-bootcamp card and the fees section
          expect(page, url).toBe("");
          expect(["free-bootcamp", "pricing"], url).toContain(hash);
        } else {
          expect(ROUTE_FILES.has(routeFileFor(page)), `${kind} -> ${url}`).toBe(true);
        }
      }
    }
  });
});

describe("handoff presets", () => {
  it("only the payment preset mentions payment", () => {
    for (const k of HANDOFF_ORDER) {
      const hasPay = /payment/i.test(handoffMessage(k));
      expect(hasPay).toBe(k === "payment");
    }
  });
  it("founder line is the official number", () => {
    expect(FOUNDER_WHATSAPP_NUMBER).toBe("2348068597140");
    expect(handoffMessage("official")).toContain("wa.me/2348068597140");
  });
  it("intro names Ms. Claire as the automated assistant", () => {
    expect(handoffMessage("intro", { name: "ADA obi" })).toMatch(/^Hi Ada, this is Ms\. Claire.*automated admissions assistant/);
  });
});

describe("template rendering", () => {
  it("fills stored params into the approved template body", () => {
    const r = renderStoredBody("[Template] t1: Ada | https://x.ng", [
      { name: "t1", components: [{ type: "BODY", text: "Hi {{1}}, join: {{2}}" }] },
    ]);
    expect(r).toEqual({ text: "Hi Ada, join: https://x.ng", template: "t1" });
  });
});
