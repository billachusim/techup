import { describe, expect, it } from "vitest";
import { campaignParams, canMessage, segmentFor, type CampaignLead } from "@/lib/whatsapp-campaign";

const lead = (o: Partial<CampaignLead> = {}): CampaignLead => ({
  id: "1", name: "Chioma Obi", contact: "08031234567", interest: "community_join",
  status: "new", notes: null, source: null, whatsapp_opt_out_at: null, ...o,
});
const courses = { "web-development": { slug: "web-development", title: "Web Development", price: 50000 } };

const slugs = new Set(["web-development"]);

describe("revamp campaign", () => {
  it("treats a lead whose phone matches a student as a student", () => {
    expect(segmentFor(lead({ contact: "+234 803 123 4567" }), new Set(["8031234567"]), slugs)).toBe("student");
  });
  it("offers SIWES leads Virtual SIWES and the free bootcamp", () => {
    const l = lead({ interest: "virtual_siwes" });
    expect(segmentFor(l, new Set(), slugs)).toBe("siwes");
    const p = campaignParams(l, "siwes", courses);
    expect(p[1]).toContain("/virtual-siwes");
    expect(p[2]).toContain("#free-bootcamp");
  });
  it("offers a course lead that course at its current price", () => {
    const l = lead({ source: "department-footer:web-development" });
    expect(segmentFor(l, new Set(), slugs)).toBe("course");
    expect(campaignParams(l, "course", courses).slice(1, 3)).toEqual(["Web Development", "₦50,000"]);
  });
  it("treats a SIWES interest picked on a course page as SIWES", () => {
    expect(segmentFor(lead({ source: "department:cybersecurity", notes: "Interest: SIWES / Industrial Training" }), new Set(), slugs)).toBe("siwes");
  });
  it("offers everyone else the one-tap free bootcamp link", () => {
    const p = campaignParams(lead(), "general", courses);
    expect(p).toHaveLength(2);
    expect(p[0]).toBe("Chioma");
    expect(p[1].endsWith("#free-bootcamp")).toBe(true);
  });
  it("never messages a lead who said STOP", () => {
    expect(canMessage(lead({ whatsapp_opt_out_at: "2026-10-01" }))).toBe(false);
    expect(canMessage(lead())).toBe(true);
  });
});
