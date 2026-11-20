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

describe("jobs and business services", () => {
  it("sends people looking for work to the talent profile, careers and side hustles", () => {
    for (const q of [
      "Hw can I get a job from your plartgorm.im a full stack developer and also an ai developer",
      "I want graphic design, data analysis and research jobs. I'm very skilled and can deliver nicely",
      "Are you hiring?",
      "Any vacancy for a data analyst",
      "I need freelance work",
    ]) {
      const d = answer(q);
      expect(d.intents, q).toContain("jobs");
      expect(d.reply).toContain("https://techfaculty.ng/talent/profile");
      expect(d.reply).toContain("https://techfaculty.ng/careers");
    }
  });

  it("quotes side-hustle pay of ₦5,000 to ₦10,000 per task", () => {
    expect(answer("any side hustle?").reply).toContain("₦5,000 to ₦10,000 per task");
  });

  it("answers a job-seeker asking about pay with jobs, not course fees", () => {
    const d = answer("How much do you pay for the job?");
    expect(d.intents).toEqual(["jobs"]);
  });

  it("treats 'hire me' as a job-seeker", () => {
    expect(answer("I'm a designer, you can hire me for jobs").intents).toEqual(["jobs"]);
  });

  it("sends businesses to services and the custom brief page", () => {
    const d = answer("I want to hire someone to build a website for my business");
    expect(d.intents).toEqual(["services"]);
    expect(d.reply).toContain("https://techfaculty.ng/services");
    expect(d.reply).toContain("https://techfaculty.ng/hire");
    expect(d.reply).toContain("₦7,500");
  });

  it("answers Tutor & Earn as a SIWES question", () => {
    expect(answer("I want to tutor and earn during my IT").intents).toEqual(["siwes"]);
  });

  it("still hands partnerships to staff", () => {
    handoff("We want a partnership to hire your graduates");
  });

  it("lets Ms. Claire try greetings and unrecognised questions, never staff-only ones", () => {
    const hello = decideAutoAnswer("Good evening I'll like to proceed");
    expect(hello.kind === "handoff" && hello.canTryAi).toBe(true);
    const paid = decideAutoAnswer("I have paid, here is my receipt");
    expect(paid.kind === "handoff" && paid.canTryAi).toBeFalsy();
    const media = decideAutoAnswer("[image]");
    expect(media.kind === "handoff" && media.canTryAi).toBeFalsy();
  });
});
