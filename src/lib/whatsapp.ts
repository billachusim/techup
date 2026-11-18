/**
 * The main "Tech Faculty" WhatsApp community (Bill's main number). WhatsApp is for
 * physical centres, events and follow-ups; online classes run on Slack.
 * (Until 18 Nov 2026 this pointed to the "Tech Faculty Online" group, now a backup.)
 */
export const COMMUNITY_WHATSAPP_URL =
  "https://chat.whatsapp.com/C11MoicGernLS5dYqnhcbj";

export const AI_FELLOWSHIP_WHATSAPP_URL =
  "https://chat.whatsapp.com/FWxf8PpzZcDG9czk455VI6";

export const isMobileDevice = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
