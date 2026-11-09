import dearClaireCover from "@/assets/dear-claire-cover.png.asset.json";
import aiclopediaCover from "@/assets/aiclopedia-cover.png.asset.json";
import alterEgoCover from "@/assets/alter-ego-cover.png.asset.json";
import eavesdropCover from "@/assets/eavesdrop-cover.png.asset.json";

export type Platform = "playstore" | "appstore";

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
  links: { playstore?: string; appstore?: string };
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
      "Going away? Put your pet's feeding, walks, medication, vet and emergency contacts into one care card and share it with your pet sitter by link, QR code or printable PDF.",
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
    platforms: ["playstore"],
    links: {
      playstore: "https://play.google.com/store/apps/details?id=com.techfaculty.pet_care_card",
    },
    category: "LifestyleApplication",
    accent: "from-amber-500 to-orange-600",
    developer: "Tech Faculty",
  },
];

export const getApp = (slug: string) => apps.find((a) => a.slug === slug);
