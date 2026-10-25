/**
 * Email follow-up sequence for new leads (/admin/leads). Every lead that left
 * an email address gets up to three short emails, one, three and seven days
 * after the enquiry, written for what they asked about. The sequence stops when
 * the lead is marked enrolled or not interested, when that email has an active
 * enrolment, or when they unsubscribe.
 *
 * Copy and timing live here; src/lib/lead-followups.server.ts sends them.
 */
import { VIRTUAL_SIWES, formatNaira } from "@/data/virtualSiwes";
import { SUCCESS_KIT } from "@/data/successKit";

export const SITE = "https://techfaculty.ng";
export const WHATSAPP_URL = `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}`;
/** Replies go to the team inbox, not the noreply sender. */
export const LEAD_REPLY_TO = VIRTUAL_SIWES.email;

const DAY = 24 * 60 * 60 * 1000;
/** Days after the enquiry that each email is due. */
export const FOLLOWUP_DAYS = [1, 3, 7] as const;
/** Leads older than this when the sequence first sees them are left alone. */
export const ENROL_WINDOW_MS = 2 * DAY;
/** Never send two emails in the sequence less than a day apart. */
const MIN_GAP_MS = DAY;

/** Lead statuses that end the sequence. "contacted" keeps it running. */
export const CLOSED_STATUSES = new Set(["enrolled", "not_interested"]);

/** Partner enquiries are handled by hand, so they get no automatic emails. */
const NO_SEQUENCE = new Set(["partner_enquiry"]);

export type FollowupEmail = {
  subject: string;
  preview: string;
  title: string;
  paragraphs: string[];
  cta: string;
  href: string;
};

type Sequence = [FollowupEmail, FollowupEmail, FollowupEmail];

const askUs =
  "Reply to this email or message us on WhatsApp and a coordinator will help you.";

const lastCheckIn = (
  topic: string,
  href: string,
  cta: string,
): FollowupEmail => ({
  subject: `Still thinking about ${topic}?`,
  preview: "One last note from Tech Faculty NG",
  title: "Can we help with anything?",
  paragraphs: [
    `A week ago you asked us about ${topic}. This is our last automatic email about it.`,
    "If something is holding you back, such as dates, fees or your school's paperwork, tell us. Most questions take one message to answer.",
    "If you have already sorted it out, you do not need to do anything.",
  ],
  cta,
  href,
});

const SEQUENCES: Record<string, Sequence> = {
  free_checklist: [
    {
      subject: "Your SIWES checklist, and the step most students miss",
      preview: "Collect your SIWES forms early",
      title: "Your SIWES checklist",
      paragraphs: [
        "Thanks for downloading the free SIWES checklist. You can open it again at any time from the link below.",
        "The step most students leave too late is the paperwork. Collect your SPE-1 and ITF Form 8 early, because most delayed allowances trace back to forms that were submitted late or half completed.",
      ],
      cta: "Open the checklist",
      href: `${SITE}/siwes-success-kit`,
    },
    {
      subject: "Still looking for a SIWES placement?",
      preview: "On-site SIWES at Tech Faculty NG is free",
      title: "Do your SIWES with us",
      paragraphs: [
        "If you still need somewhere to do your SIWES, Tech Faculty NG takes students on site at our campuses, and on-site placement is free.",
        `No campus near you? Virtual SIWES gives you an official placement letter, weekly live sessions with a mentor and real project work, for a ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} placement fee.`,
      ],
      cta: "See SIWES options",
      href: `${SITE}/siwes`,
    },
    lastCheckIn("your SIWES", WHATSAPP_URL, "Message us on WhatsApp"),
  ],
  success_kit: [
    {
      subject: "Your SIWES Success Kit is reserved",
      preview: "Payment details and your download link",
      title: "Your kit is reserved",
      paragraphs: [
        `You reserved the ${SUCCESS_KIT.name} (${formatNaira(SUCCESS_KIT.priceNGN)}). Nothing is charged automatically.`,
        `If you have not received payment details from us yet, message us on WhatsApp and we will send them along with your download link.`,
      ],
      cta: "Get payment details on WhatsApp",
      href: WHATSAPP_URL,
    },
    {
      subject: "What's inside the SIWES Success Kit",
      preview: SUCCESS_KIT.tagline,
      title: "What the kit gives you",
      paragraphs: [
        SUCCESS_KIT.tagline,
        "Inside are placement email and DM templates, CV and cover letter templates, a logbook and weekly report pack, a technical report outline, an ITF allowance tracker and a playbook for turning your placement into a job.",
      ],
      cta: "See what's inside",
      href: `${SITE}/siwes-success-kit`,
    },
    lastCheckIn(
      "the SIWES Success Kit",
      WHATSAPP_URL,
      "Message us on WhatsApp",
    ),
  ],
  siwes_placement: [
    {
      subject: "About your SIWES placement request",
      preview: "What happens next with your placement",
      title: "We have your placement request",
      paragraphs: [
        "Thanks for asking about a SIWES placement with Tech Faculty NG. A coordinator will contact you with the available tracks, dates and your nearest centre.",
        "To speed things up, have your school's SIWES letter and your SPE-1 form ready. If you want an answer sooner, message us on WhatsApp.",
      ],
      cta: "Message us on WhatsApp",
      href: WHATSAPP_URL,
    },
    {
      subject: "On-site SIWES at Tech Faculty NG is free",
      preview: "How on-site placement works",
      title: "How on-site SIWES works",
      paragraphs: [
        "On-site SIWES at our campuses is free. You choose Learn & Pay or Tutor & Earn and work on real projects with a supervisor.",
        `No campus near you? Virtual SIWES is the same placement online, for a ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} placement fee.`,
      ],
      cta: "See SIWES options",
      href: `${SITE}/siwes`,
    },
    lastCheckIn(
      "a SIWES placement",
      `${SITE}/virtual-siwes`,
      "See Virtual SIWES",
    ),
  ],
  virtual_siwes: [
    {
      subject: "Your Virtual SIWES slot",
      preview: "How to confirm your slot",
      title: "Confirm your Virtual SIWES slot",
      paragraphs: [
        `Thanks for requesting a Virtual SIWES slot. The ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} placement fee confirms it, and your acceptance letter follows within 48 hours of payment.`,
        "If you have not received payment details and a start date from us yet, message us on WhatsApp.",
      ],
      cta: "Get payment details on WhatsApp",
      href: WHATSAPP_URL,
    },
    {
      subject: "What you do during Virtual SIWES",
      preview: "Weekly mentor sessions and real project work",
      title: "What Virtual SIWES looks like",
      paragraphs: [
        "Each week you join a live online session with a mentor from your department and work on real client and product projects, so your logbook has real work to describe.",
        "We keep attendance and supervision records for your school and the ITF, and you finish with a completion certificate, a recommendation letter and a project portfolio link.",
      ],
      cta: "See Virtual SIWES",
      href: `${SITE}/virtual-siwes`,
    },
    lastCheckIn("Virtual SIWES", WHATSAPP_URL, "Message us on WhatsApp"),
  ],
  logbook_service: [
    {
      subject: "Your logbook pickup request",
      preview: "Courier pickup, review, signing and return",
      title: "We have your logbook request",
      paragraphs: [
        `The logbook service is ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)}, and both legs of the courier are included. Turnaround is ${VIRTUAL_SIWES.turnaround}.`,
        "If you have not received payment details and a pickup window from us yet, message us on WhatsApp.",
      ],
      cta: "Arrange pickup on WhatsApp",
      href: WHATSAPP_URL,
    },
    {
      subject: "How the logbook service works",
      preview: "From pickup to return delivery",
      title: "How it works",
      paragraphs: [
        "A courier picks up your logbook and ITF forms from your city. We review your weekly entries against the work you did, your assigned supervisor signs and stamps it, and we send it back to you.",
        "Send it early. Logbooks that arrive close to your school's deadline leave little time to fix anything.",
      ],
      cta: "See the logbook service",
      href: `${SITE}/virtual-siwes`,
    },
    lastCheckIn("the logbook service", WHATSAPP_URL, "Message us on WhatsApp"),
  ],
  general: [
    {
      subject: "Thanks for reaching out to Tech Faculty NG",
      preview: "Where to start with Tech Faculty NG",
      title: "Thanks for reaching out",
      paragraphs: [
        "Tech Faculty NG trains people in practical tech skills, certifies them and helps them into work. We are licensed by FMSTI through NBTI.",
        "Have a look at our departments to see what you could learn. " + askUs,
      ],
      cta: "Explore departments",
      href: `${SITE}/departments`,
    },
    {
      subject: "How learning at Tech Faculty NG works",
      preview: "Classes, projects and your certificate",
      title: "How learning works",
      paragraphs: [
        "You learn through live classes and weekly projects that a tutor reviews, and you finish with a certificate you can verify online.",
        "Plans and prices are on our website, and you can start online or at a campus near you.",
      ],
      cta: "See plans and prices",
      href: `${SITE}/#pricing`,
    },
    lastCheckIn(
      "learning with Tech Faculty NG",
      WHATSAPP_URL,
      "Message us on WhatsApp",
    ),
  ],
};

/** The sequence for a lead's interest, or null when that interest gets none. */
export function followupSequence(interest: string): Sequence | null {
  if (NO_SEQUENCE.has(interest)) return null;
  return SEQUENCES[interest] ?? SEQUENCES.general;
}

/** The email for one step (0-based), or null past the end of the sequence. */
export function followupEmail(
  interest: string,
  step: number,
): FollowupEmail | null {
  return followupSequence(interest)?.[step] ?? null;
}

export type LeadForSequence = {
  email: string | null;
  interest: string;
  status: string;
  created_at: string;
  whatsapp_opt_in: boolean;
};

/**
 * Whether a lead starts an email sequence: it has an email, is recent, is not
 * already closed, and is not getting the WhatsApp follow-ups instead.
 */
export function startsSequence(lead: LeadForSequence, now: number): boolean {
  return (
    !!lead.email?.includes("@") &&
    !CLOSED_STATUSES.has(lead.status) &&
    !lead.whatsapp_opt_in &&
    followupSequence(lead.interest) != null &&
    now - Date.parse(lead.created_at) <= ENROL_WINDOW_MS
  );
}

/** When step `step` (0-based) is due, or null when the sequence has no such step. */
export function followupDueAt(
  leadCreatedAt: string,
  step: number,
  now: number,
): string | null {
  const days = FOLLOWUP_DAYS[step];
  if (days == null) return null;
  const onSchedule = Date.parse(leadCreatedAt) + days * DAY;
  // After the first email, keep at least a day between emails even when a send ran late.
  const earliest = step === 0 ? onSchedule : now + MIN_GAP_MS;
  return new Date(Math.max(onSchedule, earliest)).toISOString();
}

/** Emails go out between 08:00 and 20:00 Lagos time (UTC+1, no daylight saving). */
export function isSendingHour(now: number): boolean {
  const lagosHour = (new Date(now).getUTCHours() + 1) % 24;
  return lagosHour >= 8 && lagosHour < 20;
}

export const normaliseEmail = (email: string) => email.trim().toLowerCase();
