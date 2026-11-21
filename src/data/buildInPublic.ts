/** Content for the build-in-public guide (/build-in-public). */

export const BUILD_IN_PUBLIC_PATH = "/build-in-public";

export const whyPoints = [
  {
    title: "Proof beats paper",
    body: "A certificate says you finished. A public post with a link shows what you can actually do. Employers and clients check both.",
  },
  {
    title: "People find you",
    body: "Recruiters, founders and clients search LinkedIn and X every day. Regular posts about real work put your name in front of them.",
  },
  {
    title: "Your portfolio builds itself",
    body: "One post per class task becomes a portfolio of 10 to 20 real projects by the end of your course, with dates and links.",
  },
];

export const routine = [
  { step: "Do the class task", body: "Every class on your dashboard has one task. Do it properly. Use AI tools to help, but make the result your own." },
  { step: "Submit it on your dashboard", body: "Put your work in a shareable link (GitHub, live link, Figma, Google Doc) and submit it. The AI tutor gives feedback in minutes." },
  { step: "Post about it within 24 hours", body: "Share what you built, one thing you learned and the link. Use a template below. Short and honest beats long and polished." },
  { step: "Save it to your portfolio", body: "Add the link to your GitHub, a simple portfolio page and your Tech Faculty talent profile, so it is all in one place." },
];

export const postTemplates = [
  {
    id: "linkedin",
    label: "LinkedIn",
    text:
      "Class {number} of my {course} at Tech Faculty NG: {what you built}.\n\n" +
      "What I learned: {one thing}.\n" +
      "What was hard: {one thing}.\n\n" +
      "See it here: {link}\n\n" +
      "#BuildInPublic #TechFacultyNG #LearningAI",
  },
  {
    id: "x",
    label: "X (Twitter)",
    text: "Day {number} of learning {course} with @TechFacultyNG: I built {what you built}. Hardest part: {one thing}. {link} #BuildInPublic",
  },
  {
    id: "whatsapp",
    label: "WhatsApp status",
    text: "Just finished class {number} of my {course} 💪 I built {what you built}. Have a look: {link}",
  },
];

export const whatToShare = [
  "A screenshot, short screen recording or before-and-after of your work",
  "One thing you learned and one thing you found hard",
  "How you used AI tools (which tool, what prompt, what you changed yourself)",
  "The link so people can try it",
];

export const keepPrivate = [
  "Your scores and tutor feedback (they stay between you and Tech Faculty)",
  "Your Faculty ID, phone number and home address",
  "Other students' names, faces or work without their permission",
  "Client or company data from any real task",
];

export const thirtyDayPlan = [
  { week: "Week 1", body: "Introduce yourself: who you are, what you are learning and why. Post your first class task." },
  { week: "Week 2", body: "Post each class task. Show one AI tool you now use every day and what it saves you." },
  { week: "Week 3", body: "Post a small project that solves a real problem for you, your family or a local business." },
  { week: "Week 4", body: "Share a recap: everything you built this month, with links, and what you are learning next." },
];

export const faqs = [
  {
    q: "Do I have to post my work publicly?",
    a: "No. Building in public is optional, and your class progress does not depend on it. It is the fastest way we know to get noticed for jobs and side hustles, so we recommend it.",
  },
  {
    q: "I am a complete beginner. Is my work good enough to share?",
    a: "Yes. People follow beginners who improve week by week. Your first posts show where you started; your later posts show how far you have come.",
  },
  {
    q: "What if my task did not pass yet?",
    a: "Share it anyway if you like, as a work in progress, and say what you are fixing. Never share your score or the tutor's feedback.",
  },
  {
    q: "Should I tag Tech Faculty NG?",
    a: "Yes, use #TechFacultyNG. It helps other learners find you and lets our team spot strong work for jobs and talent matches.",
  },
  {
    q: "Where should I keep my portfolio?",
    a: "GitHub for code, a simple free portfolio page for everything, and your Tech Faculty talent profile so businesses hiring through us can see your projects.",
  },
];
