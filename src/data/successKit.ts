/**
 * Content source of truth for the SIWES Success Kit funnel.
 * Price is a placeholder until live checkout is configured.
 */

export const SUCCESS_KIT = {
  name: "SIWES Success Kit",
  tagline: "Everything a Nigerian student needs to land, survive and convert a SIWES placement.",
  priceNGN: 4500,
  compareAtNGN: 9000,
  currencyLabel: "₦",
  whatsappNumber: "2348068597140",
};

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

/** The free preview — real value, given away to earn the lead. */
export const freeChecklist: { title: string; detail: string }[] = [
  {
    title: "Confirm your course is on the ITF-approved SIWES list",
    detail: "Ask your department SIWES coordinator before you print a single letter.",
  },
  {
    title: "Collect SPE-1 and ITF Form 8 early",
    detail: "Most delayed allowances trace back to forms submitted late or half-completed.",
  },
  {
    title: "Build a one-page student CV",
    detail: "Name, course, level, 3 skills, 1 project link. Nothing else. One page only.",
  },
  {
    title: "Shortlist 15 realistic IT hosts",
    detail: "Tech companies, agencies, hubs and incubation centres in your city — not only banks.",
  },
  {
    title: "Send a short, specific placement email",
    detail: "Two sentences on what you can do, one line on your dates, CV attached.",
  },
  {
    title: "Register your placement before Day 1",
    detail: "Unregistered placements are the number one reason students are not paid.",
  },
  {
    title: "Keep your logbook weekly, not monthly",
    detail: "Ten minutes every Friday beats a panicked rewrite the night before assessment.",
  },
];

/** What the paid kit adds on top of the free checklist. */
export const kitContents: { title: string; detail: string }[] = [
  {
    title: "12 placement email & DM templates",
    detail: "Cold email, follow-up, referral ask, WhatsApp intro and rejection re-open — fill in the blanks.",
  },
  {
    title: "Student CV & cover letter templates",
    detail: "Two editable one-page formats built for students with no work history yet.",
  },
  {
    title: "Logbook and weekly report pack",
    detail: "Pre-formatted logbook entries plus a monthly report structure supervisors accept.",
  },
  {
    title: "SIWES technical report outline",
    detail: "Chapter-by-chapter outline with sample wording for tech placements.",
  },
  {
    title: "ITF allowance tracker",
    detail: "Track SPE-1, Form 8, registration and payment stages so nothing stalls silently.",
  },
  {
    title: "IT host directory (tech-focused)",
    detail: "Companies, hubs and incubation centres that take tech interns across major Nigerian cities.",
  },
  {
    title: "Convert-IT-to-job playbook",
    detail: "What to do in months 4-6 so your placement ends with a reference or an offer.",
  },
];

export const kitFaqs: { q: string; a: string }[] = [
  {
    q: "What exactly do I receive after paying?",
    a: "A downloadable pack of editable documents and templates, plus access to the Tech Faculty student support channel on WhatsApp for questions during your placement.",
  },
  {
    q: "Is the free checklist really free?",
    a: "Yes. Enter your email or WhatsApp number and we send the 7-step placement checklist immediately, with no obligation to buy the kit.",
  },
  {
    q: "Does the kit guarantee a placement?",
    a: "No honest guide can promise a placement. The kit gives you the documents, templates and outreach system that our placed students used — you still have to send the emails.",
  },
  {
    q: "How do I pay?",
    a: "Reserve your kit here and our team confirms your order on WhatsApp or email with current payment details. Card checkout is being finalised.",
  },
  {
    q: "Can I use it if I'm not a Tech Faculty student?",
    a: "Yes. The kit is written for any Nigerian student on SIWES or industrial training, in any institution.",
  },
];
