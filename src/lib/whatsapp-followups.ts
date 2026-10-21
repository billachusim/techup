export const WHATSAPP_OPT_IN_VERSION = "admissions-follow-up-2026-10-21-v1";
export const WHATSAPP_FOLLOWUP_DELAY_HOURS = 48;

export const WHATSAPP_ADMISSIONS_TEMPLATES = {
  confirmation: "tf_admissions_confirmation",
  follow_up: "tf_admissions_follow_up",
} as const;

const ADMISSIONS_INTERESTS = new Set([
  "community_join",
  "whatsapp_chat",
  "free_checklist",
  "siwes_placement",
  "virtual_siwes",
]);

const INTEREST_COPY: Record<string, string> = {
  community_join: "joining the Tech Faculty community",
  whatsapp_chat: "your WhatsApp enquiry",
  free_checklist: "the free SIWES checklist",
  siwes_placement: "a SIWES placement",
  virtual_siwes: "Virtual SIWES",
};

export type WhatsAppLead = {
  created_at: string;
  channel: string;
  interest: string;
  status: string;
  whatsapp_opt_in: boolean;
  whatsapp_opt_out_at: string | null;
  whatsapp_last_inbound_at: string | null;
};

export type WhatsAppTemplateStatus = {
  name: string;
  language: string;
  category?: string | null;
  status: string;
};

export function isEligibleForWhatsAppFollowup(lead: WhatsAppLead): boolean {
  return lead.channel === "whatsapp"
    && lead.status === "new"
    && lead.whatsapp_opt_in
    && !lead.whatsapp_opt_out_at
    && !(lead.whatsapp_last_inbound_at && new Date(lead.whatsapp_last_inbound_at).getTime() >= new Date(lead.created_at).getTime())
    && ADMISSIONS_INTERESTS.has(lead.interest);
}

export function hasRepliedSince(lead: Pick<WhatsAppLead, "whatsapp_last_inbound_at">, sentAt: string | null): boolean {
  return !!lead.whatsapp_last_inbound_at
    && !!sentAt
    && new Date(lead.whatsapp_last_inbound_at).getTime() >= new Date(sentAt).getTime();
}

export function isApprovedUtilityTemplate(
  templates: WhatsAppTemplateStatus[],
  name: string,
  language = "en_US",
): boolean {
  return templates.some((template) =>
    template.name === name
    && template.language === language
    && template.status === "APPROVED"
    && template.category?.toUpperCase() === "UTILITY",
  );
}

export function isWhatsAppOptOutMessage(text: string): boolean {
  return /^\s*(stop|unsubscribe|cancel|end|quit)[\s.!]*$/i.test(text);
}

export function whatsAppFollowupDueAt(sentAt: Date): Date {
  return new Date(sentAt.getTime() + WHATSAPP_FOLLOWUP_DELAY_HOURS * 60 * 60 * 1000);
}

export function whatsAppInterestCopy(interest: string): string {
  return INTEREST_COPY[interest] ?? "your enquiry";
}