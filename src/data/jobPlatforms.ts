export type JobPlatform = {
  /** Display name */
  name: string;
  /** source_platform values in the jobs table that map to this platform */
  match: string[];
  /** Signup / get-started URL */
  signupUrl: string;
  /** One-line description of the work offered */
  blurb: string;
};

export const jobPlatforms: JobPlatform[] = [
  {
    name: "Micro1",
    match: ["Micro1"],
    signupUrl:
      "https://refer.micro1.ai/referral/jobs?referralCode=5df297a6-4ec0-45fa-b144-1ace3ec277ef&utm_source=referral&utm_medium=share&utm_campaign=job_referral",
    blurb: "Vetted remote engineering roles with US and global companies.",
  },
  {
    name: "Ask Ethos",
    match: ["Ask Ethos", "AskEthos", "Askitos", "Ask Etos"],
    signupUrl: "https://agent.askethos.com/refer/copbdvcud51e",
    blurb: "AI agent work and expert tasks you can take on remotely.",
  },
  {
    name: "Atlas Capture",
    match: ["Atlas Capture", "Atlas Audit", "AtlasCapture"],
    signupUrl: "https://audit.atlascapture.io/?ref_id=6a7e58a8de1a75582251a347",
    blurb: "Paid data capture and audit projects, done from your phone or laptop.",
  },
];

export function platformFor(sourcePlatform: string | null | undefined): JobPlatform | undefined {
  if (!sourcePlatform) return undefined;
  const needle = sourcePlatform.trim().toLowerCase();
  return jobPlatforms.find((p) => p.match.some((m) => m.toLowerCase() === needle));
}
