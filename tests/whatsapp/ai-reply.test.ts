import { describe, expect, it } from "vitest";
import { AI_FOOTER, conversationInput, parseClaireReply } from "@/lib/whatsapp-ai-reply";

describe("Ms. Claire AI reply checks", () => {
  it("sends a normal reply with the automated-assistant footer", () => {
    const d = parseClaireReply("Hi! Start the free bootcamp here: https://techfaculty.ng/#free-bootcamp");
    expect(d.kind).toBe("reply");
    if (d.kind === "reply") expect(d.text.endsWith(AI_FOOTER)).toBe(true);
  });

  it("stays quiet on SKIP", () => {
    expect(parseClaireReply("SKIP").kind).toBe("skip");
  });

  it("hands off with the model's reason", () => {
    expect(parseClaireReply("HANDOFF: asks about a refund")).toEqual({ kind: "handoff", reason: "Ms. Claire: asks about a refund" });
  });

  it("never sends a link that isn't ours", () => {
    expect(parseClaireReply("Apply here: https://example.com/jobs").kind).toBe("handoff");
    expect(parseClaireReply("Chat with Mr. Bill: https://wa.me/2348068597140").kind).toBe("reply");
  });

  it("never sends a phone number other than the official line", () => {
    expect(parseClaireReply("Call 0803 123 4567 for help").kind).toBe("handoff");
    expect(parseClaireReply("Our official line is +234 806 859 7140").kind).toBe("reply");
  });

  it("hands off replies that are too long", () => {
    expect(parseClaireReply("a ".repeat(600)).kind).toBe("handoff");
  });

  it("labels the conversation and keeps only the last 10 messages", () => {
    const turns = Array.from({ length: 12 }, (_, i) => ({ from: i % 2 ? "us" as const : "customer" as const, text: `m${i}` }));
    const input = conversationInput(turns);
    expect(input).not.toContain("m1\n");
    expect(input).toContain("Customer: m10");
    expect(input).toContain("Tech Faculty: m11");
  });
});
