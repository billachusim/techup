// Prints the pages that get their own social preview image, as JSON, for
// scripts/generate-og-images.py. Run: bunx tsx scripts/og-pages.ts
import { campuses } from "../src/data/campuses";
import { departments } from "../src/data/departments";

const pages = [
  {
    file: "default.jpg",
    eyebrow: "Tech Faculty NG",
    title: "Get Trained, Certified and Employed in Tech",
    subtitle: "AI, software, data, cybersecurity and design bootcamps across Nigeria",
  },
  {
    file: "siwes.jpg",
    eyebrow: "SIWES & Industrial Training",
    title: "Do your SIWES at Tech Faculty",
    subtitle: "Mentored, real-world IT placement for Nigerian students",
  },
  {
    file: "virtual-siwes.jpg",
    eyebrow: "Virtual SIWES",
    title: "Remote SIWES with real projects",
    subtitle: "Complete your industrial training online, from anywhere in Nigeria",
  },
  {
    file: "siwes-success-kit.jpg",
    eyebrow: "SIWES Success Kit",
    title: "Logbook, report and defence, done right",
    subtitle: "Templates and guides for your SIWES / IT programme",
  },
  ...departments.map((d) => ({
    file: `departments/${d.slug}.jpg`,
    eyebrow: "Department",
    title: d.title,
    subtitle: d.tagline,
  })),
  ...campuses.map((c) => ({
    file: `locations/${c.slug}.jpg`,
    eyebrow: `Campus · ${c.state === "Federal Capital Territory" ? "FCT" : `${c.state} State`}`,
    title: `Tech Faculty ${c.city}`,
    subtitle: c.tagline,
  })),
];

console.log(JSON.stringify(pages, null, 2));
