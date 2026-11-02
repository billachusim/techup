import { describe, expect, it } from "vitest";
import { FOUNDER_WHATSAPP_NUMBER, HANDOFF_ORDER, handoffMessage } from "@/lib/whatsapp-handoff";
import { renderStoredBody } from "@/lib/whatsapp-render";

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
