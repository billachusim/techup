// Ms. Claire's AI replies for WhatsApp messages the fixed answers don't cover
// (greetings, "I'd like to proceed", general questions). Pure helpers: the
// prompt, and the checks every AI reply must pass before it is sent. The model
// call lives in whatsapp-auto-answers.server.ts.
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { SLACK_JOIN_URL } from "@/data/coursePrograms";
import { FOUNDER_DISPLAY, FOUNDER_WHATSAPP_NUMBER } from "@/lib/whatsapp-handoff";

export const AI_SKIP = "SKIP";
export const AI_HANDOFF = "HANDOFF:";

/** Added under every AI reply so people know it is automatic and how to reach a person. */
export const AI_FOOTER = "_Ms. Claire, automated assistant. Ask for a real person anytime and our team will reply here._";

/** Longest AI reply we send (characters, before the footer). */
export const AI_MAX_CHARS = 900;

export type ChatTurn = { from: "customer" | "us"; text: string };

export function claireInstructions(facts: string): string {
  return [
    "You are Ms. Claire, Tech Faculty NG's automated admissions assistant, replying on WhatsApp to someone who messaged us (Nigeria).",
    "Write a short, warm WhatsApp reply (max ~80 words). Plain text: no headings or markdown links; *bold* is fine; put links as plain URLs. Reply in the person's language (English or Pidgin).",
    "Use ONLY the facts below. Never invent prices, dates, pay, discounts or promises. Only use links that appear in the facts.",
    `Never share any phone number except our official line ${FOUNDER_DISPLAY}.`,
    "People come for four things: learning a course (start with the Free AI Course, Everyday AI & Digital Productivity), SIWES/IT, finding work or side hustles, or hiring our talent for a business task. Point them to the right link and the next step.",
    "Greetings or vague messages (hi, good afternoon, here, I'm interested): greet them, say who you are in one line, and ask which of those four they want.",
    "\"I'd like to proceed\" or \"yes\": use the conversation so far to work out what they mean and give the next step with its link. If it is unclear, ask what they want to proceed with.",
    `If the message is only an acknowledgement after we already answered (ok, thanks, 👍, noted), reply exactly ${AI_SKIP}.`,
    `Reply exactly "${AI_HANDOFF} <short reason>" instead of answering when: it is about payments, bank transfers, receipts, refunds, discounts or scholarships; certificates, results or account/login problems; complaints; partnerships or custom quotes; they ask for a person; or the facts don't let you answer confidently.`,
    "",
    "FACTS:",
    facts,
  ].join("\n");
}

/** The last few messages of the chat, oldest first, as the model's input. */
export function conversationInput(turns: ChatTurn[]): string {
  const lines = turns.slice(-10).map((t) => `${t.from === "customer" ? "Customer" : "Tech Faculty"}: ${t.text.replace(/\s+/g, " ").slice(0, 600)}`);
  return `Conversation so far (latest last). Write the reply to the customer's latest message.\n\n${lines.join("\n")}`;
}

export type ClaireDecision =
  | { kind: "reply"; text: string }
  | { kind: "handoff"; reason: string }
  | { kind: "skip" };

const ALLOWED_LINKS = [
  /^https:\/\/(www\.)?techfaculty\.ng(\/|$|[?#])/i,
  new RegExp(`^https://wa\\.me/${FOUNDER_WHATSAPP_NUMBER}(\\b|$)`),
];
const EXACT_LINKS = [SLACK_JOIN_URL, COMMUNITY_WHATSAPP_URL];

/** Turns the model's output into a reply we can send, or a handoff to staff. */
export function parseClaireReply(raw: string): ClaireDecision {
  const text = raw.trim().replace(/^["“]|["”]$/g, "").trim();
  if (!text) return { kind: "handoff", reason: "Ms. Claire had no answer" };
  if (text.toUpperCase() === AI_SKIP || text.toUpperCase().startsWith(`${AI_SKIP}\n`)) return { kind: "skip" };
  if (text.toUpperCase().startsWith(AI_HANDOFF)) {
    const reason = text.slice(AI_HANDOFF.length).trim().slice(0, 200);
    return { kind: "handoff", reason: reason ? `Ms. Claire: ${reason}` : "Ms. Claire passed this to staff" };
  }
  if (/\bHANDOFF\b/.test(text)) return { kind: "handoff", reason: "Ms. Claire passed this to staff" };
  if (text.length > AI_MAX_CHARS) return { kind: "handoff", reason: "Ms. Claire's reply was too long to send" };

  const urls = text.match(/https?:\/\/[^\s)>\]]+/gi) ?? [];
  for (const u of urls) {
    const url = u.replace(/[.,!?;:]+$/, "");
    if (!EXACT_LINKS.includes(url) && !ALLOWED_LINKS.some((re) => re.test(url))) {
      return { kind: "handoff", reason: "Ms. Claire's reply had a link that isn't ours" };
    }
  }
  // Any phone number other than the official line is never sent.
  const phones = (text.match(/\+?\d[\d\s-]{8,}\d/g) ?? []).map((p) => p.replace(/\D/g, "")).filter((p) => p.length >= 10);
  if (phones.some((p) => p !== FOUNDER_WHATSAPP_NUMBER && p !== `0${FOUNDER_WHATSAPP_NUMBER.slice(3)}`)) {
    return { kind: "handoff", reason: "Ms. Claire's reply had a phone number that isn't ours" };
  }
  return { kind: "reply", text: `${text}\n\n${AI_FOOTER}` };
}
