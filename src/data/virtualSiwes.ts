/**
 * Content and pricing source of truth for Virtual SIWES (online IT placement)
 * and the logbook review + waybill (delivery) service.
 * Payment is reserve-then-confirm: no live checkout yet.
 */

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
    a: "Yes — many institutions now accept a remote or hybrid industrial training placement, especially for Computer Science, IT, Software Engineering, Data Science and related courses. What your school checks is that the host organisation is real, registered, relevant to your course and willing to supervise, sign and stamp your logbook. Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation via the National Board for Technology Incubation, and our headquarters sits inside the Technology Incubation Centre, Nnewi. Confirm with your department coordinator first, then apply.",
  },
  {
    q: "How much does Virtual SIWES cost?",
    a: "The virtual IT placement is ₦45,000 for the full duration of your training, paid before onboarding. The logbook review, signing, stamping and two-way delivery service is a separate ₦15,000. Nothing is charged automatically online — we send payment details after you submit the form.",
  },
  {
    q: "Who signs and stamps my SIWES logbook?",
    a: "Your assigned Tech Faculty supervisor signs your logbook and it is stamped with our official company stamp, exactly as it would be if you sat in our Nnewi office every day. Attendance and supervision records are kept throughout your placement, so the signature reflects real supervised work.",
  },
  {
    q: "How do I send my logbook for review and signing?",
    a: "You do not have to travel. Book the logbook service and our courier partner collects the logbook and any ITF forms from your address in any Nigerian city. We review, complete, sign and stamp, then waybill the documents back to you. Both the pickup and the return delivery are included in the ₦15,000.",
  },
  {
    q: "How long does the logbook turnaround take?",
    a: "Plan for 5–7 working days from the day your logbook reaches our headquarters, plus courier time each way. If your submission deadline is tight, tell us the date on the form and we prioritise it.",
  },
  {
    q: "What if my school insists on a physical placement?",
    a: "Then use one of our 21 physical centres instead — Nnewi, Onitsha, Owerri, Aba, Enugu, Abakaliki, Abuja and more — and keep the same tracks and mentors. Some students also do a hybrid: online weekly work with a few on-site weeks. We write your letter to match whatever your school approved.",
  },
  {
    q: "Which tracks can I do virtually?",
    a: "Both. Learn & Pay is for students who want structured, mentored experience across web development, data analytics, AI, cybersecurity, design or digital marketing. Tutor & Earn is for students already skilled enough to teach — you tutor other learners online, gain teaching experience and earn while completing your IT.",
  },
  {
    q: "Do I still get a placement letter and completion certificate?",
    a: "Yes. You receive an official acceptance and placement letter addressed to your institution before you resume, and a completion certificate plus recommendation letter at the end. Virtual interns are documented exactly like on-site interns.",
  },
  {
    q: "Will my ITF allowance be affected?",
    a: "Your ITF SIWES allowance depends on your school and the ITF processing your SPE-1 and Form 8 correctly and on time — not on whether your placement is remote. We complete our sections of those forms as part of the logbook service so nothing stalls on our side.",
  },
  {
    q: "Can final-year and part-time students use this?",
    a: "Yes. Virtual IT is built for students who cannot relocate: those studying far from our centres, those already working, part-time and sandwich students, and anyone whose approved host fell through late in the session.",
  },
  {
    q: "What do I need before I start?",
    a: "A laptop where possible, a working internet connection, your school's IT duration and start date, and your logbook and ITF forms once your department issues them. If your laptop is the blocker, ask us — our store and payment-plan options exist for exactly that reason.",
  },
  {
    q: "Is Tech Faculty NG a registered organisation my school can verify?",
    a: "Yes. We are a licensed technology training institute operating from the Technology Incubation Centre, Nnewi, with centres in 21 Nigerian cities. Your coordinator can verify our licence and address, and our certificates are verifiable on our own verification portal.",
  },
];
