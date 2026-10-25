import { describe, expect, it } from "vitest";
import { isWhatsAppUrl, whatsAppLinkType } from "./analytics";

describe("WhatsApp link detection", () => {
  it("matches direct chats and group invites", () => {
    expect(isWhatsAppUrl("https://wa.me/2348068597140?text=Hi")).toBe(true);
    expect(isWhatsAppUrl("https://api.whatsapp.com/send?phone=234")).toBe(true);
    expect(isWhatsAppUrl("https://chat.whatsapp.com/D8kuxWVZRTKKeAx6ERjSqc")).toBe(true);
    expect(isWhatsAppUrl(new URL("https://wa.me/?text=hello"))).toBe(true);
  });

  it("ignores other links", () => {
    expect(isWhatsAppUrl("/blog/whatsapp-tips")).toBe(false);
    expect(isWhatsAppUrl("https://techfaculty.ng/?ref=wa.me")).toBe(false);
    expect(isWhatsAppUrl("https://wa.meeting.example.com")).toBe(false);
    expect(isWhatsAppUrl(undefined)).toBe(false);
  });

  it("tells chats from groups", () => {
    expect(whatsAppLinkType("https://chat.whatsapp.com/abc")).toBe("group");
    expect(whatsAppLinkType("https://wa.me/234")).toBe("chat");
  });
});
