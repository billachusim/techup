import dearClaireCover from "@/assets/dear-claire-cover.png.asset.json";
import aiclopediaCover from "@/assets/aiclopedia-cover.png.asset.json";
import alterEgoCover from "@/assets/alter-ego-cover.png.asset.json";
import eavesdropCover from "@/assets/eavesdrop-cover.png.asset.json";

export type Platform = "playstore" | "appstore" | "web";

export interface AppFaq {
  q: string;
  a: string;
}

export interface AppProduct {
  slug: string;
  name: string;
  tagline: string;
  /** Short card copy for /products. */
  description: string;
  /** One-paragraph answer to "what is this app?" — used for meta, schema and AI assistants. */
  summary: string;
  features: string[];
  faq: AppFaq[];
  platforms: Platform[];
  links: { playstore?: string; appstore?: string; web?: string };
  /** schema.org applicationCategory */
  category: string;
  accent: string;
  previewImage?: string;
  rating?: string;
  downloads?: string;
  developer: string;
}

// Keep names and descriptions in step with the Google Play / App Store listings,
// so search engines and AI assistants see one consistent description of each app.
export const apps: AppProduct[] = [
  {
    slug: "dear-claire",
    name: "Dear Claire",
    tagline: "Anonymous Diary That Replies",
    description:
      "Speak freely, get real advice, feel understood. Write or record your day in a 100% anonymous secret diary and get a caring reply with real human advice, not AI. Track your mood, or help others by leaving kind advice on their diaries.",
    summary:
      "Dear Claire is a free anonymous diary app for Android and iPhone. Write or record a diary entry starting with \"Dear Claire\" and get a caring reply with real human advice, not AI. It also tracks your mood and lets you help other people anonymously.",
    features: [
      "Anonymous and private: no real name needed",
      "Real human replies, not a chatbot",
      "Write or record voice diary entries",
      "Mood tracking over time",
      "Read and support other people's anonymous diaries",
    ],
    faq: [
      { q: "Is Dear Claire free?", a: "Yes. Dear Claire is free to download on Google Play and the App Store, with optional in-app purchases." },
      { q: "Are Dear Claire's replies written by AI?", a: "No. Replies to your diary entries are written by real people, not a chatbot." },
      { q: "Is Dear Claire anonymous?", a: "Yes. You don't need to use your real name, and your diary stays private." },
      { q: "Can I record voice notes instead of typing?", a: "Yes. You can type an entry or record it as a voice note." },
      { q: "Is Dear Claire a therapy app?", a: "No. It is a supportive diary and not a replacement for professional help. In a crisis, contact your local emergency number." },
    ],
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.mobymagic.clairediary",
      appstore: "https://apps.apple.com/ng/app/dear-claire-secret-diary-chat/id1635333304",
    },
    category: "LifestyleApplication",
    accent: "from-pink-500 to-rose-600",
    previewImage: dearClaireCover.url,
    rating: "4.5★",
    downloads: "1M+",
    developer: "Social Faculty",
  },
  {
    slug: "alter-ego",
    name: "Alter Ego",
    tagline: "Shadow Work & Self Map",
    description:
      "You are not one personality — you are many. Map your inner archetypes, do private shadow work, consult your inner council before you decide, and check in daily. 100% local: no account, no cloud, no tracking.",
    summary:
      "Alter Ego is a 100% offline self-discovery and shadow work app. Short daily check-ins map your inner archetypes (The Strategist, The Rebel, The Caretaker, The Achiever and your Shadow) on an identity radar, and an inner council helps you think through decisions. No account, no cloud, nothing leaves your phone.",
    features: [
      "Works fully offline, no sign-up",
      "Identity radar of your personality archetypes",
      "Shadow work across 9 identity dimensions",
      "Inner council for hard decisions",
      "Track how your balance shifts over time",
    ],
    faq: [
      { q: "Does Alter Ego need an internet connection or an account?", a: "No. Alter Ego runs fully on your device with no account and no cloud storage." },
      { q: "What is shadow work?", a: "Shadow work means reflecting on the parts of your personality you tend to hide or ignore. Alter Ego guides it through short check-ins and an archetype map." },
      { q: "Is Alter Ego a psychological test or diagnosis?", a: "No. It is a self-reflection tool, not a medical or psychological diagnosis." },
      { q: "Is Alter Ego free?", a: "It is free to download, with a free trial and optional premium features." },
    ],
    platforms: ["playstore", "appstore"],
    links: {
      appstore: "https://apps.apple.com/app/alter-ego-know-all-yourselves/id6759404823",
      playstore: "https://play.google.com/store/apps/details?id=com.socialfaculty.alter_ego",
    },
    category: "HealthApplication",
    accent: "from-violet-500 to-purple-600",
    previewImage: alterEgoCover.url,
    developer: "Social Faculty",
  },
  {
    slug: "eavesdrop",
    name: "Eavesdrop",
    tagline: "Live Voice Rooms",
    description:
      "Some conversations weren't meant for you. Listen live to real people in voice rooms on every topic, raise your hand to speak, host your own room, or book a private voice call.",
    summary:
      "Eavesdrop is a live voice chat app. Drop into live audio rooms to hear honest conversations about life, love and secrets, host your own room, join the stage to talk, or book a private one-hour voice call.",
    features: [
      "Listen to live audio rooms",
      "Host your own live voice session",
      "Join the stage and talk in real time",
      "Book private one-hour voice calls",
      "No feed, just live human conversation",
    ],
    faq: [
      { q: "What is Eavesdrop?", a: "A live voice chat app where you can listen to real conversations, host your own room, or speak on stage." },
      { q: "Do I have to talk?", a: "No. You can listen quietly, or join the stage when you want to speak." },
      { q: "Is Eavesdrop free?", a: "Yes. It is free to download, with optional in-app purchases." },
    ],
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.socialfaculty.eavesdrop",
      appstore: "https://apps.apple.com/us/app/eavesdrop-live-stories/id6759225893",
    },
    category: "SocialNetworkingApplication",
    accent: "from-emerald-500 to-teal-600",
    previewImage: eavesdropCover.url,
    developer: "Social Faculty",
  },
  {
    slug: "ai-clopedia",
    name: "AI Clopedia",
    tagline: "Ask AI Anything",
    description:
      "Your AI-powered encyclopedia. Browse featured questions, get answers the way you'll never forget, see an image for every question, and follow your curiosity through your own question history.",
    summary:
      "AI Clopedia is an AI chat and image app: ask any question for a clear answer with an image, browse questions other people are asking, and keep your own question history.",
    features: [
      "AI chat answers to any question",
      "An AI image for every question",
      "Featured community questions to explore",
      "Your own question history",
    ],
    faq: [
      { q: "Is AI Clopedia free?", a: "It is free to download, with credits and an optional premium plan." },
      { q: "Can AI Clopedia make images?", a: "Yes. It creates an image to go with your question." },
    ],
    platforms: ["playstore", "appstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.socialfaculty.AiClopedia",
      appstore: "https://apps.apple.com/us/app/ai-clopedia-ask-ai-anything/id6447000971",
    },
    category: "EducationalApplication",
    accent: "from-blue-500 to-cyan-600",
    previewImage: aiclopediaCover.url,
    developer: "Social Faculty",
  },
  {
    slug: "pet-care-card",
    name: "Pet Care Card",
    tagline: "Pet Sitter Notes in One Card",
    description:
      "Going away? Put your pet's feeding, walks, medication, vet and emergency contacts into one care card and share it with your pet sitter by link, QR code or printable PDF. Use it on the web at petcarecards.app or on Android.",
    summary:
      "Pet Care Card lets you put your pet's feeding schedule, routines, medication instructions, vet details and emergency contacts into one care card you can share by link, QR code or printable PDF with a pet sitter, friend or boarding facility.",
    features: [
      "Feeding, walks and daily routines",
      "Medication instructions and reminders",
      "Vet and emergency contacts",
      "Share by QR code or printable PDF",
      "One-time lifetime premium, no subscription",
    ],
    faq: [
      { q: "What is a pet care card?", a: "A single page with everything a pet sitter needs: feeding, routines, medication, vet and emergency contacts." },
      { q: "Can I print it?", a: "Yes. Premium creates a printable PDF care card." },
      { q: "Does Pet Care Card give veterinary advice?", a: "No. It organizes instructions you already have and does not diagnose or recommend medication." },
      { q: "Is there a subscription?", a: "No. It is free for one pet, with a one-time lifetime premium upgrade." },
    ],
    platforms: ["web", "playstore"],
    links: {
      web: "https://petcarecards.app",
      playstore: "https://play.google.com/store/apps/details?id=com.techfaculty.pet_care_card",
    },
    category: "LifestyleApplication",
    accent: "from-amber-500 to-orange-600",
    previewImage: "/products/pet-care-card-cover.jpg",
    developer: "Tech Faculty",
  },
  {
    slug: "examsai",
    name: "ExamsAi.ng",
    tagline: "JAMB, WAEC and NECO AI Exam Coach",
    description:
      "Prepare smarter for JAMB (UTME), WAEC, NECO and NABTEB. Chat with an AI tutor about any subject, practise past questions with instant marking, and track your weak areas until exam day.",
    summary:
      "ExamsAi.ng is an AI exam coach for Nigerian students preparing for JAMB (UTME), WAEC, NECO and NABTEB. Students chat with an AI tutor to understand any topic, practise past exam questions with instant marking and explanations, and track their progress and weak subjects. It runs in the browser on any phone or laptop.",
    features: [
      "AI tutor you can chat with about any JAMB or WAEC subject",
      "Past exam questions with instant marking and explanations",
      "Progress tracking that shows your weak topics",
      "Covers JAMB (UTME), WAEC, NECO and NABTEB",
      "Works in the browser on any phone or laptop, nothing to install",
    ],
    faq: [
      { q: "Which exams does ExamsAi.ng cover?", a: "JAMB (UTME), WAEC, NECO and NABTEB." },
      { q: "Do I need to install an app?", a: "No. ExamsAi.ng runs in your browser on any phone or laptop." },
      { q: "How much does ExamsAi.ng cost?", a: "You can start free. Unlimited access is a low monthly plan in naira, shown on the ExamsAi.ng pricing page." },
      { q: "Does the AI give the answers or teach me?", a: "Both. It marks your answers instantly and explains the correct answer so you learn the topic, not just the question." },
    ],
    platforms: ["web"],
    links: { web: "https://examsai.lovable.app" },
    category: "EducationalApplication",
    accent: "from-green-500 to-emerald-600",
    previewImage: "/products/examsai-cover.jpg",
    developer: "Tech Faculty",
  },
  {
    slug: "skillflow",
    name: "SkillFlow",
    tagline: "Learn Tech Skills, One Scroll at a Time",
    description:
      "Short, scrollable tech lessons with AI tutors. Pick up AI prompting, coding, design and digital skills a few minutes at a time, at your own pace, from your phone.",
    summary:
      "SkillFlow is a web app for learning tech skills in short, scrollable lessons with AI tutors. Learners browse a feed of courses such as AI prompt engineering, coding and design, learn a few minutes at a time, and move at their own pace. It is built by Tech Faculty as a first step into its bootcamps.",
    features: [
      "Scrollable feed of short tech lessons",
      "AI tutors that explain as you learn",
      "Courses in AI prompting, coding, design and digital skills",
      "Learn at your own pace on your phone",
      "A free first step into Tech Faculty bootcamps",
    ],
    faq: [
      { q: "Is SkillFlow free?", a: "Many SkillFlow courses are free. Some advanced courses may be paid." },
      { q: "Do I need any experience?", a: "No. Lessons start from the basics and are short enough to fit into a few minutes a day." },
      { q: "How is SkillFlow related to Tech Faculty?", a: "SkillFlow is built by Tech Faculty. It is a quick way to try tech skills before joining a full Tech Faculty bootcamp." },
    ],
    platforms: ["web"],
    links: { web: "https://skill-scroll-ai.lovable.app" },
    category: "EducationalApplication",
    accent: "from-violet-500 to-indigo-600",
    previewImage: "/products/skillflow-cover.jpg",
    developer: "Tech Faculty",
  },
  {
    slug: "unilag-life",
    name: "UnilagLife",
    tagline: "Live Your Akoka Story",
    description:
      "A live campus life sim set in the University of Lagos. Matriculate, attend lectures, survive exams, make friends and graduate, right in your browser.",
    summary:
      "UnilagLife is a free browser game that simulates student life at the University of Lagos (UNILAG), Akoka. Players matriculate, attend lectures, manage time and money, survive exams and work their way to graduation. It plays on any phone or laptop with nothing to install.",
    features: [
      "Campus life sim set at the University of Lagos, Akoka",
      "Matriculate, attend lectures and sit exams",
      "Manage your time, money and friendships",
      "Play free in the browser, nothing to install",
    ],
    faq: [
      { q: "Is UnilagLife free to play?", a: "Yes. UnilagLife is free and plays in your browser." },
      { q: "Do I need to be a UNILAG student?", a: "No. Anyone can play, but UNILAG students and alumni will recognise the places and the struggle." },
      { q: "Is UnilagLife an official University of Lagos app?", a: "No. It is an independent game by Tech Faculty and is not affiliated with the University of Lagos." },
    ],
    platforms: ["web"],
    links: { web: "https://unilaglife-app.vercel.app" },
    category: "GameApplication",
    accent: "from-sky-600 to-blue-800",
    previewImage: "/products/unilag-life-cover.jpg",
    developer: "Tech Faculty",
  },
  {
    slug: "baby-care-cards",
    name: "Baby Care Cards",
    tagline: "Babysitter Instructions in One Card",
    description:
      "Leaving your child with a sitter? Put feeding, naps, nappies, medication, emergency contacts and paediatrician details into one care card, then share it by link, print it or hand over a QR code.",
    summary:
      "Baby Care Cards helps parents create one caregiver card with their child's feeding schedule, nap times, nappy routine, medication, allergies, emergency contacts and paediatrician details. The card can be shared by link, printed, or handed over as a QR code, and can be filled in by voice.",
    features: [
      "Feeding, naps and nappy routine in one place",
      "Medication, allergies and reminders",
      "Emergency contacts and paediatrician details",
      "Share by link or QR code, or print it",
      "Fill it in by voice if you don't want to type",
    ],
    faq: [
      { q: "What is a baby care card?", a: "A single card with everything a babysitter or relative needs to look after your child: routine, feeding, medication and emergency details." },
      { q: "Do I need an account?", a: "No. You can create a care card without signing up." },
      { q: "Does Baby Care Cards give medical advice?", a: "No. It organises instructions you already have and does not replace advice from your doctor." },
    ],
    platforms: ["web"],
    links: { web: "https://babycarecards.com" },
    category: "LifestyleApplication",
    accent: "from-rose-400 to-pink-500",
    previewImage: "/products/baby-care-cards-cover.jpg",
    developer: "Tech Faculty",
  },
  {
    slug: "autopr",
    name: "AutoPR by PR Faculty",
    tagline: "AI PR, Marketing and Sales for Small Businesses",
    description:
      "Mind your business while we handle the rest. AutoPR is PR Faculty's AI-powered PR and growth service: websites, social media, ads, review management, CRM and sales automation for small businesses.",
    summary:
      "AutoPR by PR Faculty is an AI-powered PR, marketing and sales service for small businesses. It sets up a business's digital presence (website, social media, ads and CRM), manages online reviews, and automates marketing and sales follow-up, with one-time pricing packages and a free consultation.",
    features: [
      "Website, social media and ads set up for you",
      "Review management for Google and social platforms",
      "CRM and automated sales follow-up",
      "PR campaigns and brand building",
      "One-time packages and a free consultation",
    ],
    faq: [
      { q: "What is PR Faculty?", a: "PR Faculty is Tech Faculty's PR and sales brand. AutoPR is its AI-powered service for small businesses." },
      { q: "Who is AutoPR for?", a: "Small and growing businesses that want a professional online presence and more customers without hiring a full marketing team." },
      { q: "How much does AutoPR cost?", a: "Packages are one-time prices shown on the AutoPR website, and the first consultation is free." },
    ],
    platforms: ["web"],
    links: { web: "https://autopr.lovable.app" },
    category: "BusinessApplication",
    accent: "from-slate-700 to-zinc-900",
    previewImage: "/products/autopr-cover.jpg",
    developer: "PR Faculty",
  },
];

export const isWebOnly = (a: AppProduct) => a.platforms.length === 1 && a.platforms[0] === "web";

export const getApp = (slug: string) => apps.find((a) => a.slug === slug);
