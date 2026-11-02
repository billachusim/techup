import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { SLACK_JOIN_URL } from "@/data/coursePrograms";

/** Official founder line (Mr. Bill Achusim). Claire's admissions number is never shown publicly. */
export const FOUNDER_WHATSAPP_NUMBER = "2348068597140";
export const FOUNDER_DISPLAY = "+234 806 859 7140";
const SITE = "https://techfaculty.ng";

export type HandoffKind =
  | "intro" | "official" | "bootcamp" | "course" | "siwes" | "founder" | "payment" | "community" | "slack";

export const HANDOFF_ORDER: HandoffKind[] = ["intro", "official", "bootcamp", "course", "siwes", "founder", "payment", "community", "slack"];

export const HANDOFF_LABEL: Record<HandoffKind, string> = {
  intro: "Introduce us",
  official: "Official number",
  bootcamp: "Free bootcamp",
  course: "Course & price",
  siwes: "SIWES / internship",
  founder: "Speak to Mr. Bill",
  payment: "Payment help",
  community: "Join community",
  slack: "Join Slack",
};

const founderLink = (topic: string) =>
  `https://wa.me/${FOUNDER_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Mr. Bill, Ms. Claire from admissions referred me${topic}.`)}`;

export function firstName(name?: string | null): string {
  const n = (name ?? "").replace(/[^\p{L}\s'-]/gu, " ").trim().split(/\s+/)[0] ?? "";
  return n ? n[0].toUpperCase() + n.slice(1).toLowerCase() : "";
}

export function handoffMessage(kind: HandoffKind, opts: { name?: string | null } = {}): string {
  const fn = firstName(opts.name);
  const hi = fn ? `Hi ${fn}` : "Hi there";
  switch (kind) {
    case "intro":
      return `${hi}, this is Ms. Claire, Tech Faculty NG's automated admissions assistant 👋\n\nTech Faculty NG trains people in tech skills online and at campuses across Nigeria, with a Certificate of Achievement and job support after training.\n\nTo speak with our team directly, our official WhatsApp line is ${FOUNDER_DISPLAY}: ${founderLink("")}`;
    case "official":
      return `${hi}, just so you know: this line is Ms. Claire, our automated admissions assistant. Our official Tech Faculty NG number is ${FOUNDER_DISPLAY}. You can chat with the team there anytime: ${founderLink("")}`;
    case "bootcamp":
      return `${hi}, you can start our free tech bootcamp today. It takes one tap to join: ${SITE}/#free-bootcamp\n\nYou'll learn the basics online and can upgrade to a full course whenever you're ready.`;
    case "course":
      return `${hi}, here are our courses and current prices, with online classes and campuses across Nigeria: ${SITE}/pricing\n\nTell me the course you're interested in and I'll share the details.`;
    case "siwes":
      return `${hi}, for SIWES/IT we offer Virtual SIWES, an online industrial training you can do from anywhere, with logbook support: ${SITE}/virtual-siwes`;
    case "founder":
      return `${hi}, Mr. Bill Achusim, our founder, will be happy to help you with this directly. Please chat with him on our official line: ${founderLink("")}`;
    case "payment":
      return `${hi}, for payments, instalments or receipts, please chat with Mr. Bill Achusim, our founder, on our official line: ${founderLink(" about payment")}`;
    case "community":
      return `Join the Tech Faculty WhatsApp community for updates and free resources: ${COMMUNITY_WHATSAPP_URL}`;
    case "slack":
      return `Join our Tech Faculty Slack to meet other students and mentors: ${SLACK_JOIN_URL}`;
  }
}
