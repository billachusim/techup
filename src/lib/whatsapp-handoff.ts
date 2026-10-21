import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { SLACK_JOIN_URL } from "@/data/coursePrograms";

/** Official founder line (Mr. Bill Achusim). Claire's admissions number is never shown publicly. */
export const FOUNDER_WHATSAPP_NUMBER = "2348068597140";

export type HandoffKind = "founder" | "community" | "slack" | "all";

const founderLink = `https://wa.me/${FOUNDER_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Mr. Bill, Claire from admissions referred me.")}`;

export const HANDOFF_LABEL: Record<HandoffKind, string> = {
  founder: "Hand off to Mr. Bill",
  community: "Invite to community",
  slack: "Invite to Slack",
  all: "Send all links",
};

export function handoffMessage(kind: HandoffKind): string {
  const founder = `For payments or anything that needs the founder, please chat with Mr. Bill Achusim directly: ${founderLink}`;
  const community = `Join the Tech Faculty WhatsApp community for updates and free resources: ${COMMUNITY_WHATSAPP_URL}`;
  const slack = `Join our Tech Faculty Slack to meet other students and mentors: ${SLACK_JOIN_URL}`;
  if (kind === "founder") return founder;
  if (kind === "community") return community;
  if (kind === "slack") return slack;
  return `Here are the best next steps:\n\n1. ${founder}\n\n2. ${community}\n\n3. ${slack}`;
}
