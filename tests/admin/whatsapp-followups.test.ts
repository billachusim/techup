import { describe, expect, it } from "vitest";
import {
  isApprovedUtilityTemplate,
  hasRepliedSince,
  isEligibleForWhatsAppFollowup,
  canScheduleWhatsAppFollowupsForInterest,
  isWhatsAppOptOutMessage,
  WHATSAPP_ADMISSIONS_TEMPLATES,
  WHATSAPP_FOLLOWUP_DELAY_HOURS,
  whatsAppFollowupDueAt,
  whatsAppInterestCopy,
} from "../../src/lib/whatsapp-followups";

const eligible = {
  created_at: "2026-10-21T08:00:00.000Z",
  channel: "whatsapp",
  interest: "siwes_placement",
  status: "new",
  whatsapp_opt_in: true,
  whatsapp_opt_out_at: null,
  whatsapp_last_inbound_at: null,
};

describe("WhatsApp admissions follow-up safeguards", () => {
  it("requires explicit WhatsApp consent and an active lead", () => {
    expect(isEligibleForWhatsAppFollowup(eligible)).toBe(true);
    expect(isEligibleForWhatsAppFollowup({ ...eligible, whatsapp_opt_in: false })).toBe(false);
    expect(isEligibleForWhatsAppFollowup({ ...eligible, whatsapp_opt_out_at: "2026-10-21T08:00:00Z" })).toBe(false);
    expect(isEligibleForWhatsAppFollowup({ ...eligible, whatsapp_last_inbound_at: "2026-10-21T08:00:00Z" })).toBe(false);
    expect(isEligibleForWhatsAppFollowup({ ...eligible, whatsapp_last_inbound_at: "2026-10-21T07:59:59Z" })).toBe(true);
    expect(isEligibleForWhatsAppFollowup({ ...eligible, status: "contacted" })).toBe(false);
  });

  it("does not include non-admissions requests in this workflow", () => {
    expect(isEligibleForWhatsAppFollowup({ ...eligible, interest: "success_kit" })).toBe(false);
    expect(isEligibleForWhatsAppFollowup({ ...eligible, interest: "partner_enquiry" })).toBe(false);
  });

  it("limits automated follow-ups to the defined admissions request types", () => {
    expect(canScheduleWhatsAppFollowupsForInterest("community_join")).toBe(true);
    expect(canScheduleWhatsAppFollowupsForInterest("virtual_siwes")).toBe(true);
    expect(canScheduleWhatsAppFollowupsForInterest("success_kit")).toBe(false);
    expect(canScheduleWhatsAppFollowupsForInterest("partner_enquiry")).toBe(false);
  });

  it("requires the exact approved utility template and language", () => {
    const templates = [{ name: WHATSAPP_ADMISSIONS_TEMPLATES.confirmation, language: "en_US", category: "UTILITY", status: "APPROVED" }];
    expect(isApprovedUtilityTemplate(templates, WHATSAPP_ADMISSIONS_TEMPLATES.confirmation)).toBe(true);
    expect(isApprovedUtilityTemplate([{ ...templates[0], status: "PENDING" }], WHATSAPP_ADMISSIONS_TEMPLATES.confirmation)).toBe(false);
    expect(isApprovedUtilityTemplate([{ ...templates[0], category: "MARKETING" }], WHATSAPP_ADMISSIONS_TEMPLATES.confirmation)).toBe(false);
    expect(isApprovedUtilityTemplate(templates, WHATSAPP_ADMISSIONS_TEMPLATES.confirmation, "en" )).toBe(false);
  });

  it("schedules the second follow-up exactly 48 hours after confirmation", () => {
    const sentAt = new Date("2026-10-21T08:00:00.000Z");
    expect(WHATSAPP_FOLLOWUP_DELAY_HOURS).toBe(48);
    expect(whatsAppFollowupDueAt(sentAt).toISOString()).toBe("2026-10-23T08:00:00.000Z");
  });

  it("suppresses the second follow-up only for replies after confirmation", () => {
    expect(hasRepliedSince({ whatsapp_last_inbound_at: "2026-10-23T08:00:00.000Z" }, "2026-10-23T08:00:00.000Z")).toBe(true);
    expect(hasRepliedSince({ whatsapp_last_inbound_at: "2026-10-23T07:59:59.000Z" }, "2026-10-23T08:00:00.000Z")).toBe(false);
    expect(hasRepliedSince({ whatsapp_last_inbound_at: null }, "2026-10-23T08:00:00.000Z")).toBe(false);
  });

  it("recognizes opt-out keywords without matching ordinary sentences", () => {
    for (const word of ["STOP", "unsubscribe", "Cancel!", "End.", "quit"]) {
      expect(isWhatsAppOptOutMessage(word)).toBe(true);
    }
    expect(isWhatsAppOptOutMessage("Please stop sending updates sometime later")).toBe(false);
  });

  it("uses customer-facing labels for template parameters", () => {
    expect(whatsAppInterestCopy("siwes_placement")).toBe("a SIWES placement");
  });
});