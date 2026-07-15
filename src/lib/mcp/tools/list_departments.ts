import { defineTool } from "@lovable.dev/mcp-js";

const departments = [
  { code: "free-foundation", name: "Free Foundation (Bootcamp Starter)", startingPriceNGN: 0, description: "Intro to Programming, AI & ChatGPT, Git & GitHub, Tech Career Guidance. Online, free for everyone." },
  { code: "web-development", name: "Developer Pro — Web Development", startingPriceNGN: 50000, description: "HTML/CSS, JavaScript, React, Node.js, databases, full-stack projects." },
  { code: "mobile-development", name: "Mobile App Developer", startingPriceNGN: 80000, description: "React Native, Flutter, iOS Swift, Android Kotlin, cross-platform projects." },
  { code: "cloud-devops", name: "Cloud Architect — Cloud & DevOps", startingPriceNGN: 130000, description: "AWS, Azure, GCP, Kubernetes, Docker, CI/CD, cloud certifications." },
  { code: "data-science", name: "Data Wizard — Data Science & Analytics", startingPriceNGN: 100000, description: "Python, SQL, data visualization, statistics, ML basics, real-world projects." },
  { code: "ai-ml", name: "AI Innovator — AI & Machine Learning", startingPriceNGN: 150000, description: "Deep learning, neural networks, TensorFlow/PyTorch, NLP, computer vision, deployment." },
  { code: "cybersecurity", name: "Security Shield — Cybersecurity & Ethical Hacking", startingPriceNGN: 120000, description: "Network security, ethical hacking, SOC ops, incident response, CompTIA & CEH prep." },
  { code: "design", name: "Design Master — UI/UX Design", startingPriceNGN: 70000, description: "Design principles, Figma, Adobe Suite, product design, design systems, portfolio." },
  { code: "digital-marketing", name: "Digital Marketing Pro", startingPriceNGN: 60000, description: "Social media, content, SEO/SEM, video/photo editing, analytics & growth." },
  { code: "custom", name: "Custom Program — Build Your Own Path", startingPriceNGN: 50000, description: "Mix and match individual courses from any department." },
];

export default defineTool({
  name: "list_departments",
  title: "List departments",
  description: "List Tech Faculty departments/tracks with starting prices (in NGN) and descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(departments, null, 2) }],
    structuredContent: { departments },
  }),
});
