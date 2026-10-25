// Nigerian tech salary report (/reports/nigeria-tech-salaries). Every figure on that
// page comes from this file, and each one carries the source it was copied from.
// public/data/nigeria-tech-salaries-2026.csv is the downloadable copy of PAYLAB_ROLES;
// tests/seo/salary-report.test.ts fails if the two drift apart, so edit both together.
// When refreshing: re-read each source, update the figures, `retrieved` and `REPORT.modified`.

export const SALARY_REPORT_PATH = "/reports/nigeria-tech-salaries";
export const SALARY_REPORT_CSV = "/data/nigeria-tech-salaries-2026.csv";

export const REPORT = {
  title: "Nigerian Tech Salaries 2026: What 65 Tech Roles Pay",
  published: "2026-10-25",
  modified: "2026-10-25",
  retrieved: "25 October 2026",
};

export type Source = {
  id: string;
  name: string;
  publisher: string;
  url: string;
  note: string;
};

export const SOURCES = {
  paylabIt: {
    id: "paylab-it",
    name: "Salary data for Information Technology, Nigeria",
    publisher: "Paylab",
    url: "https://www.paylab.com/ng/salaryinfo/information-technology?lang=en",
    note: "Self-reported gross monthly pay including bonuses, from employees in Nigeria, with extreme and duplicate entries removed by Paylab. Ranges are the 10th to 90th percentile. Paylab does not publish a sample size for the category or a collection period.",
  },
  paylabSwe: {
    id: "paylab-swe",
    name: "Software Engineer salary, Nigeria",
    publisher: "Paylab",
    url: "https://www.paylab.com/ng/salaryinfo/information-technology/software-engineer?lang=en",
    note: "Based on 28 verified respondents.",
  },
  paylabDevops: {
    id: "paylab-devops",
    name: "DevOps Engineer salary, Nigeria",
    publisher: "Paylab",
    url: "https://www.paylab.com/ng/salaryinfo/information-technology/devops-engineer?lang=en",
    note: "Paylab says fewer than 20 verified respondents.",
  },
  techcabal: {
    id: "techcabal-2025",
    name: "The highest-paying tech jobs in Nigeria (2025)",
    publisher: "TechCabal",
    url: "https://techcabal.com/?p=167925",
    note: "Ranges given by an HR professional and two company founders interviewed for the article. No survey or sample behind them. TechCabal converts at ₦1,500 to $1.",
  },
  minimumWage: {
    id: "minimum-wage-2024",
    name: "Tinubu Signs N70,000 Minimum Wage Bill into Law",
    publisher: "ThisDay",
    url: "https://www.thisdaylive.com/2024/07/30/tinubu-signs-n70000-minimum-wage-bill-into-law-amid-unease-over-planned-protest/",
    note: "National Minimum Wage (Amendment) Act 2024, signed 29 July 2024: ₦70,000 a month.",
  },
} satisfies Record<string, Source>;

export const MINIMUM_WAGE_NGN = 70_000;

/** Paylab's Information Technology category for Nigeria, gross monthly naira. */
export const PAYLAB_IT_CATEGORY = {
  p10: 179_068,
  p90: 964_595,
  average: 523_374,
};

export type RoleRange = { role: string; p10: number; p90: number };

/** Every Paylab IT role for Nigeria that shows a range (10th-90th percentile, gross monthly naira). */
export const PAYLAB_ROLES: RoleRange[] = [
  { role: ".NET Programmer", p10: 218_445, p90: 744_700 },
  { role: "ABAP Programmer", p10: 240_346, p90: 880_563 },
  { role: "ASP.NET Programmer", p10: 195_868, p90: 694_579 },
  { role: "Agile Coach", p10: 289_505, p90: 1_113_802 },
  { role: "Android Developer", p10: 218_654, p90: 867_224 },
  { role: "Backend developer", p10: 201_895, p90: 914_555 },
  { role: "Business Intelligence Specialist", p10: 200_423, p90: 727_003 },
  { role: "C Programmer", p10: 195_868, p90: 803_060 },
  { role: "C# Programmer", p10: 201_895, p90: 711_153 },
  { role: "C++ Programmer", p10: 226_073, p90: 834_248 },
  { role: "Cloud Engineer", p10: 230_174, p90: 850_663 },
  { role: "Data Protection Officer", p10: 175_351, p90: 547_683 },
  { role: "Data communication technician", p10: 179_561, p90: 448_993 },
  { role: "Data scientist", p10: 183_625, p90: 771_333 },
  { role: "Database Administrator", p10: 201_065, p90: 663_632 },
  { role: "Database Analyst", p10: 198_791, p90: 598_627 },
  { role: "DevOps Engineer", p10: 213_968, p90: 1_077_050 },
  { role: "Frontend developer", p10: 203_862, p90: 677_405 },
  { role: "Game designer", p10: 190_126, p90: 587_783 },
  { role: "Game developer", p10: 189_842, p90: 653_899 },
  { role: "IC Design Engineer", p10: 286_269, p90: 1_062_209 },
  { role: "ICT-specialist", p10: 180_434, p90: 468_604 },
  { role: "IT Analyst", p10: 182_952, p90: 670_100 },
  { role: "IT Architect", p10: 294_628, p90: 1_245_095 },
  { role: "IT Business Analyst", p10: 210_611, p90: 829_371 },
  { role: "IT Consultant", p10: 201_895, p90: 929_622 },
  { role: "IT Network Administrator", p10: 184_601, p90: 579_232 },
  { role: "IT Product Manager", p10: 222_953, p90: 1_176_522 },
  { role: "IT Project Manager", p10: 248_602, p90: 890_448 },
  { role: "IT Security Specialist", p10: 222_651, p90: 1_118_613 },
  { role: "IT System Administrator", p10: 187_922, p90: 544_793 },
  { role: "IT Tester", p10: 176_737, p90: 534_227 },
  { role: "IT auditor", p10: 202_553, p90: 642_234 },
  { role: "IT tester - automated tests", p10: 209_730, p90: 739_973 },
  { role: "IT/Technical Support Specialist", p10: 127_919, p90: 403_188 },
  { role: "Java Programmer", p10: 213_949, p90: 846_754 },
  { role: "Javascript Programmer", p10: 209_429, p90: 753_340 },
  { role: "Lead developer", p10: 374_915, p90: 1_310_768 },
  { role: "Microcontroller programmer", p10: 205_349, p90: 645_811 },
  { role: "Objective-C Programmer", p10: 238_356, p90: 894_915 },
  { role: "Online Casino Technician", p10: 188_971, p90: 541_785 },
  { role: "Oracle Programmer", p10: 210_210, p90: 846_194 },
  { role: "PC Technician", p10: 173_087, p90: 414_198 },
  { role: "PHP Programmer", p10: 165_900, p90: 653_333 },
  { role: "Perl Programmer", p10: 213_281, p90: 806_830 },
  { role: "Programmer", p10: 195_784, p90: 770_021 },
  { role: "Python Programmer", p10: 205_600, p90: 701_273 },
  { role: "R programmer", p10: 197_904, p90: 639_427 },
  { role: "RPA engineer", p10: 239_354, p90: 907_347 },
  { role: "SAP consultant", p10: 239_564, p90: 883_438 },
  { role: "SAP specialist", p10: 199_432, p90: 795_048 },
  { role: "SRE (Site Reliability Engineer)", p10: 267_706, p90: 1_007_328 },
  { role: "Scrum Master", p10: 233_357, p90: 815_997 },
  { role: "Service Engineer", p10: 193_092, p90: 495_440 },
  { role: "Service Technician", p10: 166_889, p90: 390_732 },
  { role: "Software Engineer", p10: 523_115, p90: 3_097_469 },
  { role: "Software consultant", p10: 204_908, p90: 726_220 },
  { role: "Solution architect", p10: 313_389, p90: 1_191_784 },
  { role: "Systems Administrator", p10: 200_119, p90: 599_571 },
  { role: "Systems Engineer", p10: 202_278, p90: 712_993 },
  { role: "Technical Writer", p10: 191_290, p90: 485_442 },
  { role: "User Experience Expert", p10: 203_238, p90: 677_200 },
  { role: "Web Designer", p10: 182_610, p90: 471_414 },
  { role: "Webmaster", p10: 165_352, p90: 376_700 },
  { role: "iOS Developer", p10: 257_474, p90: 990_342 },
];

/** Roles shown in the chart: the ones our departments train for, plus the leadership roles they lead to. */
export const CHART_ROLES = [
  "Software Engineer",
  "Lead developer",
  "IT Architect",
  "IT Product Manager",
  "IT Security Specialist",
  "DevOps Engineer",
  "Cloud Engineer",
  "iOS Developer",
  "Backend developer",
  "Android Developer",
  "Data scientist",
  "Frontend developer",
  "User Experience Expert",
  "IT Tester",
  "Web Designer",
  "IT/Technical Support Specialist",
];

/**
 * Ranges employers and founders gave TechCabal for mid-level to senior hires at
 * established startups and fintechs, gross monthly naira.
 */
export const EMPLOYER_RANGES: {
  role: string;
  level: string;
  min: number;
  max: number;
  compareTo?: string;
}[] = [
  {
    role: "Cybersecurity analyst",
    level: "Mid",
    min: 450_000,
    max: 900_000,
    compareTo: "IT Security Specialist",
  },
  {
    role: "Cybersecurity analyst",
    level: "Senior",
    min: 1_500_000,
    max: 2_000_000,
    compareTo: "IT Security Specialist",
  },
  {
    role: "Software developer (back end)",
    level: "Mid to senior",
    min: 1_200_000,
    max: 2_500_000,
    compareTo: "Backend developer",
  },
  {
    role: "DevOps engineer",
    level: "Mid to senior",
    min: 1_300_000,
    max: 2_400_000,
    compareTo: "DevOps Engineer",
  },
  {
    role: "Technical product manager",
    level: "Mid to senior",
    min: 1_500_000,
    max: 2_800_000,
    compareTo: "IT Product Manager",
  },
  {
    role: "Data engineer",
    level: "Mid to senior",
    min: 1_800_000,
    max: 2_500_000,
  },
  { role: "AI/ML engineer", level: "Not stated", min: 600_000, max: 1_200_000 },
  {
    role: "Chief Technology Officer",
    level: "Executive",
    min: 3_000_000,
    max: 5_000_000,
  },
];

export const formatNaira = (n: number) =>
  `₦${Math.round(n).toLocaleString("en-NG")}`;

/** "₦1.2M", "₦965k": for chart labels where space is short. */
export const shortNaira = (n: number) =>
  n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 2).replace(/\.?0+$/, "")}M`
    : `₦${Math.round(n / 1000)}k`;

export const roleByName = (name: string) =>
  PAYLAB_ROLES.find((r) => r.role === name);

/** Rows for the downloadable CSV; also used by the test that keeps the file in step. */
export function rolesCsv(): string {
  const quote = (s: string) =>
    /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  return (
    [
      "role,p10_monthly_ngn,p90_monthly_ngn,source_url,retrieved",
      ...PAYLAB_ROLES.map((r) =>
        [quote(r.role), r.p10, r.p90, SOURCES.paylabIt.url, "2026-10-25"].join(
          ",",
        ),
      ),
    ].join("\n") + "\n"
  );
}
