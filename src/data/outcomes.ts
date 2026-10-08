// The numbers we quote about students and graduates, and how each one is counted.
// Every page that repeats a number links to /outcomes, so change it here and on
// that page together. Update `asOf` whenever the figures are recounted.
//
// TODO(Bill): confirm or replace the three `method` notes below before this goes
// live: which cohorts count, what counts as "employed", and the date of the count.

export const OUTCOMES_PATH = "/outcomes";

export const OUTCOMES = {
  asOf: "October 2026",
  studentsTrained: {
    value: "6,000+",
    number: 6000,
    label: "Students trained since 2022",
    method:
      "Everyone who enrolled in a paid or sponsored Tech Faculty NG programme and attended classes, across all campuses, school and university collaborations, SIWES placements and online cohorts, from our first cohort in 2022 to the date above. A person who took two programmes is counted once.",
  },
  employmentRate: {
    value: "87%",
    label: "Employed within 6 months",
    method:
      "Graduates who finished a full-length programme and earned a certificate, who were in paid tech work (a job, an internship, a Talent Pool engagement or steady freelance work) within six months of finishing. Graduates we could not reach are counted as not employed. Graduates who went back to full-time study are left out of the count.",
  },
  courses: {
    value: "12",
    label: "Industry-recognised courses",
    method: "Distinct programmes currently listed on our departments pages.",
  },
} as const;
