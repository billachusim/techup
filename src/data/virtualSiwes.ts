/**
 * Content and pricing source of truth for Virtual SIWES (online IT placement)
 * and the logbook review + waybill (delivery) service.
 * Payment is reserve-then-confirm: no live checkout yet.
 */

import { campuses } from "@/data/campuses";

export const CAMPUS_COUNT = campuses.length;
export const CITY_COUNT = new Set(campuses.map((c) => c.city)).size;

export const VIRTUAL_SIWES = {
  placementPriceNGN: 45000,
  logbookPriceNGN: 15000,
  whatsappNumber: "2348068597140",
  email: "thetechfaculty@gmail.com",
  hqAddress: "Technology Incubation Centre, Nnewi, Anambra State, Nigeria",
  turnaround: "5–7 working days from the day your logbook reaches our headquarters",
};

export const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export const placementIncludes: string[] = [
  "Official acceptance and placement letter addressed to your school",
  "Choice of Learn & Pay or Tutor & Earn — the same two tracks we run on site",
  "Weekly live online sessions with a mentor from your department",
  "Real client and product work, not exercises, so your logbook has something to say",
  "Attendance and supervision records kept for your school and the ITF",
  "Completion certificate, recommendation letter and a project portfolio link",
];

export const logbookIncludes: string[] = [
  "We arrange courier pickup of your logbook and ITF forms from your city",
  "Line-by-line review of your weekly entries against the work you actually did",
  "Filling in of missing weeks, supervisor comments and the summary sections",
  "Official signing and company stamping by your assigned supervisor",
  "SPE-1, ITF Form 8 and place-of-attachment forms completed where applicable",
  "Return delivery back to you — both legs of the waybill are inside the price",
];

export const virtualSteps: { title: string; detail: string }[] = [
  {
    title: "Apply online",
    detail:
      "Fill the Virtual IT form below with your school, department, IT duration and preferred track. It takes under two minutes.",
  },
  {
    title: "Pay to confirm your slot",
    detail:
      "We reply on WhatsApp or email with payment details. The placement fee is paid before onboarding — cohorts are capped, so a slot is only held once payment lands.",
  },
  {
    title: "Get your placement letter and onboarding",
    detail:
      "Within 48 hours of payment you receive your acceptance letter for your school, your mentor, your schedule and your first project brief.",
  },
  {
    title: "Do the work weekly, online",
    detail:
      "Live sessions, real tasks and mentor reviews. You log every week as you go — that is what makes the logbook honest and easy to sign later.",
  },
  {
    title: "Book the logbook pickup",
    detail:
      "Near the end of your IT, book the logbook service. Our courier partner collects your logbook and forms from your address.",
  },
  {
    title: "Reviewed, signed, stamped and waybilled back",
    detail:
      "We review, complete, sign and stamp everything, then send it back by delivery so it reaches you before your school's submission deadline.",
  },
];

export const virtualFaqs: { q: string; a: string }[] = [
  {
    q: "Can I do my SIWES or IT online in Nigeria?",
    a: `Yes. Many institutions accept a remote or hybrid placement for Computer Science, IT, Software Engineering, Data Science and related courses, provided the host is real, registered, relevant and willing to supervise and stamp your logbook. Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation through NBTI. Virtual SIWES costs ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)}.`,
  },
  {
    q: "How much does Virtual SIWES cost?",
    a: `The virtual IT placement costs ${formatNaira(VIRTUAL_SIWES.placementPriceNGN)} for the full duration of your training, whether that is three or six months, paid before onboarding. The logbook review, signing, stamping and two-way delivery service is a separate ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)}. Nothing is charged automatically online; we send payment details after you submit the form.`,
  },
  {
    q: "Who signs and stamps my SIWES logbook?",
    a: `Your assigned Tech Faculty supervisor signs your logbook, and it is stamped with our official company stamp, exactly as it would be if you sat in our Nnewi office every day. Attendance and supervision records are kept for your school and the ITF throughout your placement, so the signature reflects real supervised work.`,
  },
  {
    q: "How do I send my logbook for review and signing?",
    a: `You do not have to travel. Book the ${formatNaira(VIRTUAL_SIWES.logbookPriceNGN)} logbook service and our courier partner collects your logbook and ITF forms from your address in any Nigerian city. We review, complete, sign and stamp them, then waybill everything back to you. Both the pickup and the return delivery are included in that price.`,
  },
  {
    q: "How long does the logbook turnaround take?",
    a: `Plan for ${VIRTUAL_SIWES.turnaround}, plus courier time each way. If your school's submission deadline is tight, write the date on the form and we prioritise your logbook. Booking the pickup a few weeks before the end of your IT leaves room for corrections before the deadline.`,
  },
  {
    q: "What if my school insists on a physical placement?",
    a: `Then use one of our ${CAMPUS_COUNT} physical centres instead, including Nnewi, Onitsha, Owerri, Aba, Enugu, Abakaliki and Abuja, with the same tracks and mentors. Some students also do a hybrid: weekly online work with a few on-site weeks. We write your placement letter to match whatever arrangement your school approved.`,
  },
  {
    q: "Which tracks can I do virtually?",
    a: `Both. Learn & Pay is for students who want structured, mentored experience across web development, data analytics, AI, cybersecurity, design or digital marketing. Tutor & Earn is for students already skilled enough to teach: you tutor other learners online, gain teaching experience and earn money while completing your industrial training.`,
  },
  {
    q: "Do I still get a placement letter and completion certificate?",
    a: `Yes. You receive an official acceptance and placement letter addressed to your institution within 48 hours of payment, before you resume. At the end you receive a completion certificate, a recommendation letter and a project portfolio link. Virtual interns are documented exactly like on-site interns, so your school sees the same paperwork.`,
  },
  {
    q: "Will my ITF allowance be affected?",
    a: `No. Your ITF SIWES allowance depends on your school and the ITF processing your SPE-1 and Form 8 correctly and on time, not on whether your placement is remote. We complete our company sections of those ITF forms as part of the logbook service, so nothing stalls on our side.`,
  },
  {
    q: "Can final-year and part-time students use this?",
    a: `Yes. Virtual IT is built for students who cannot relocate: those studying far from our centres, those already working, part-time and sandwich students, and anyone whose approved host fell through late in the session. The same placement letter, weekly mentoring and logbook service apply to every one of them.`,
  },
  {
    q: "What do I need before I start?",
    a: `A laptop where possible, a working internet connection, your school's IT duration and start date, and your logbook and ITF forms once your department issues them. If a laptop is the blocker, ask us: our tech store sells tested student laptops with pay on delivery and part-payment options for exactly this reason.`,
  },
  {
    q: "Is Tech Faculty NG a registered organisation my school can verify?",
    a: `Yes. Tech Faculty NG is a licensed technology training institute, licensed by the Federal Ministry of Science, Technology and Innovation through NBTI and headquartered at the Technology Incubation Centre, Nnewi, with centres in ${CITY_COUNT} Nigerian cities. Your coordinator can verify our licence and address, and our certificates are verifiable online.`,
  },
];
