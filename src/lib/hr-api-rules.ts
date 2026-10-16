// Statuses the HR automation agent may set, and how they map onto the stages
// the admin area already uses (so the existing emails and Slack invites still fire).

export const HR_STATUSES = [
  "matched",
  "shortlisted",
  "interview_invited",
  "assessment_invited",
  "interviewed",
  "selected",
  "offer_sent",
  "hired",
  "onboarded",
  "declined",
  "unresponsive",
] as const;
export type HrStatus = (typeof HR_STATUSES)[number];

export function isHrStatus(v: unknown): v is HrStatus {
  return typeof v === "string" && (HR_STATUSES as readonly string[]).includes(v);
}

const MATCH_MAP: Partial<Record<HrStatus, string>> = {
  matched: "approved",
  selected: "accepted",
  assessment_invited: "assessment",
  interview_invited: "interview",
};

const APPLICATION_MAP: Partial<Record<HrStatus, string>> = {
  matched: "applied",
  assessment_invited: "assessment",
  interview_invited: "interviewing",
  declined: "rejected",
};

export const toMatchStatus = (s: HrStatus) => MATCH_MAP[s] ?? s;
export const toApplicationStatus = (s: HrStatus) => APPLICATION_MAP[s] ?? s;

export type HrEmailKey = "interview_invite" | "assessment_invite" | "offer" | "decline" | "reminder";

export const HR_EMAIL_DEFAULTS: Record<HrEmailKey, { label: string; subject: string; body: string; variables: string[] }> = {
  interview_invite: {
    label: "Interview invite",
    subject: "Interview invite: {{role}}",
    body: "Hi {{name}},\n\nThanks for your interest in {{role}}. We'd love to speak with you.\n\nPlease pick a time that suits you here: {{booking_link}}\n\nTech Faculty Talent",
    variables: ["name", "role", "booking_link"],
  },
  assessment_invite: {
    label: "Assessment invite",
    subject: "Your assessment for {{role}}",
    body: "Hi {{name}},\n\nThe next step for {{role}} is a short task:\n\n{{task}}\n\nPlease submit by {{deadline}} here: {{submission_link}}\n\nTech Faculty Talent",
    variables: ["name", "role", "task", "deadline", "submission_link"],
  },
  offer: {
    label: "Offer",
    subject: "Your offer for {{role}}",
    body: "Hi {{name}},\n\nCongratulations! We'd like to offer you {{role}}.\n\nRate: {{rate}}\nStart date: {{start_date}}\nManager: {{manager}}\nSlack channel: {{slack_channel}}\n\nReply to confirm and we'll get you set up.\n\nTech Faculty Talent",
    variables: ["name", "role", "rate", "start_date", "manager", "slack_channel"],
  },
  decline: {
    label: "Decline",
    subject: "Update on {{role}}",
    body: "Hi {{name}},\n\nThank you for your time on {{role}}. We've gone with another candidate this time.\n\n{{note}}\n\nYou stay in the Tech Faculty talent pool, and we'll reach out when a project fits your skills.\n\nTech Faculty Talent",
    variables: ["name", "role", "note"],
  },
  reminder: {
    label: "Reminder",
    subject: "Reminder: {{role}}",
    body: "Hi {{name}},\n\nA quick reminder about {{role}}:\n\n{{message}}\n\nTech Faculty Talent",
    variables: ["name", "role", "message"],
  },
};

export const isHrEmailKey = (v: unknown): v is HrEmailKey => typeof v === "string" && v in HR_EMAIL_DEFAULTS;

/** Fills {{placeholders}}; unknown ones become empty. */
export function fillTemplate(text: string, vars: Record<string, unknown>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => {
    const v = vars[k];
    return v == null ? "" : String(v);
  });
}

/** Constant-time compare so the key can't be guessed byte by byte. */
export function sameKey(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0 && a.length > 0;
}

export const HR_RATE_LIMIT_PER_MINUTE = 60;
