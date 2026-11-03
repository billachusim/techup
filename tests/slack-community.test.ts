import { describe, expect, it } from "vitest";
import { buildWeeklyUpdate, prioritiseRoles, shouldConsider, type OpenRole } from "@/lib/slack-community";

const role = (o: Partial<OpenRole>): OpenRole => ({
  slug: "x", title: "X", company: "Confidential client", city: null, is_remote: true,
  pay_text: null, is_featured: false, applications_closed: false, ...o,
});

describe("slack community", () => {
  it("puts Tech Faculty and Aboutbot roles before client roles", () => {
    const out = prioritiseRoles([
      role({ slug: "client", is_featured: true }),
      role({ slug: "aboutbot", company: "Aboutbot by Tech Faculty" }),
      role({ slug: "tf", company: "Tech Faculty" }),
    ]);
    expect(out.slice(0, 2).map((r) => r.slug).sort()).toEqual(["aboutbot", "tf"]);
  });

  it("leaves closed roles out of the weekly update", () => {
    const text = buildWeeklyUpdate([role({ slug: "closed-one", applications_closed: true })], []);
    expect(text).not.toContain("closed-one");
  });

  it("weekly update links the free bootcamp, careers and events", () => {
    const text = buildWeeklyUpdate([role({ slug: "a" })], [{ slug: "e", title: "Meetup", city: "Lagos", starts_at: null }]);
    expect(text).toContain("https://techfaculty.ng/#free-bootcamp");
    expect(text).toContain("https://techfaculty.ng/careers");
    expect(text).toContain("https://techfaculty.ng/events");
  });

  it("answers questions but ignores skill lists, bots and excluded channels", () => {
    const base = { type: "message", user: "U1", channel: "C1", ts: "1" };
    expect(shouldConsider({ ...base, text: "How do I apply for the sales role?" })).toBe(true);
    expect(shouldConsider({ ...base, text: "Creative and design" })).toBe(false);
    expect(shouldConsider({ ...base, text: "How do I apply?", bot_id: "B1" })).toBe(false);
    expect(shouldConsider({ ...base, text: "How do I apply?" }, { excludedChannelIds: ["C1"] })).toBe(false);
  });
});
