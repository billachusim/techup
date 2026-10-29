import { describe, expect, it } from "vitest";
import { decideAutoAnswer } from "@/lib/whatsapp-auto-answers";

const answer = (text: string) => {
  const d = decideAutoAnswer(text);
  if (d.kind !== "answer") throw new Error(`Expected an answer for "${text}", got handoff: ${d.reason}`);
  return d;
};
const handoff = (text: string) => expect(decideAutoAnswer(text).kind).toBe("handoff");

describe("decideAutoAnswer", () => {
  it("answers a general price question with every paid department", () => {
    const d = answer("How much are your courses?");
    expect(d.intents).toEqual(["prices"]);
    expect(d.reply).toContain("Web Development: from ₦50,000");
    expect(d.reply).toContain("AI & Machine Learning: from ₦150,000");
    expect(d.reply).toContain("Basic Internet & AI Studies is free");
    expect(d.reply).toContain("₦12,000");
  });

  it("quotes one department when it is named", () => {
    const d = answer("what is the fee for data analytics");
    expect(d.reply).toContain("Data Science & Analytics takes 12 to 16 weeks and costs ₦100,000");
    expect(d.reply).toContain("/departments/data-science-analytics");
    expect(d.reply).not.toContain("Web Development");
  });

  it("hands off a Robotics price question, whose fee staff quote", () => {
    handoff("How much is robotics?");
  });

  it("gives the headquarters and campus list for a location question", () => {
    const d = answer("Where are you located?");
    expect(d.intents).toEqual(["location"]);
    expect(d.reply).toContain("Umudim, Nnewi");
    expect(d.reply).toContain("Port Harcourt, Sokoto");
  });

  it("gives the city's campus when a city is named", () => {
    const d = answer("Do you have a branch in Awka?");
    expect(d.reply).toContain("Amawbia");
    expect(d.reply).toContain("/locations/awka");
    expect(answer("where is your PH office").reply).toContain("Port Harcourt");
  });

  it("explains on-site SIWES is free and quotes virtual SIWES", () => {
    const d = answer("I need SIWES placement, how much?");
    expect(d.intents).toEqual(["siwes"]);
    expect(d.reply).toContain("no placement fee");
    expect(d.reply).toContain("₦45,000");
    expect(d.reply).toContain("Tutor & Earn");
  });

  it("answers virtual SIWES questions", () => {
    const d = answer("Can I do my SIWES online from home?");
    expect(d.intents).toEqual(["virtual_siwes"]);
    expect(d.reply).toContain("₦15,000");
    expect(d.reply).toContain("/virtual-siwes");
  });

  it("combines answers when a message asks two things", () => {
    const d = answer("How much is web development and where is your Enugu campus?");
    expect(d.intents).toEqual(["prices", "location"]);
    expect(d.reply).toContain("Enugu");
  });

  it("always ends answers with the automatic-answer note", () => {
    expect(answer("price list please").reply).toMatch(/This is an automatic answer/);
  });

  it("hands payments, discounts, complaints and staff requests to a person", () => {
    handoff("I have paid for the web development course, here is my receipt");
    handoff("Please send your account number so I can pay the fee");
    handoff("Is there a discount for SIWES students?");
    handoff("I want to speak to Mr Bill about prices");
    handoff("My certificate has a wrong name");
    handoff("I'm not happy with the class");
  });

  it("hands off greetings, media and unrecognised questions", () => {
    handoff("Hello good morning");
    handoff("[image]");
    handoff("Can I bring my laptop?");
    handoff("x".repeat(500));
  });
});
