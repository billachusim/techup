// Graduate success stories shown on /outcomes and the homepage.
// Only real graduates who agreed to be named, in their own words. Never write a
// story for someone: if a field is unknown, leave it out. The section stays
// hidden until this list has at least one story.
//
// To add one, copy this shape into `graduateStories`:
//   {
//     name: "Full name as the graduate wants it shown",
//     course: "Data Analytics",            // the programme they finished
//     campus: "Nnewi",                      // optional
//     graduated: "2024",                    // year, or "March 2024"
//     before: "What they were doing before Tech Faculty NG",
//     now: "Their role today",
//     company: "Where they work",          // optional, only if they're happy to name it
//     quote: "A sentence or two from them, word for word",
//     photo: "/graduates/firstname-lastname.jpg", // optional, file in public/graduates/
//     linkedin: "https://www.linkedin.com/in/...", // optional, lets visitors check
//     consent: "2026-10-25",                // date they agreed to appear on the site
//   },

export interface GraduateStory {
  name: string;
  course: string;
  campus?: string;
  graduated: string;
  before: string;
  now: string;
  company?: string;
  quote: string;
  photo?: string;
  linkedin?: string;
  /** Date the graduate agreed to be featured. Required so we never publish without it. */
  consent: string;
}

export const graduateStories: GraduateStory[] = [];
