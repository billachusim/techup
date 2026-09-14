export type Experience = {
  title: string;
  company: string;
  location?: string;
  start?: string;
  end?: string;
  description?: string;
};

export type Education = {
  qualification: string;
  institution: string;
  field?: string;
  start?: string;
  end?: string;
  grade?: string;
};

export type Certification = {
  name: string;
  issuer?: string;
  year?: string;
};

export type ParsedCv = {
  headline?: string;
  bio?: string;
  city?: string;
  country?: string;
  years_experience?: number;
  skills?: string[];
  tools?: string[];
  languages?: string[];
  experiences?: Experience[];
  education?: Education[];
  certifications?: Certification[];
};

const str = (v: unknown, max = 400) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, max = 25) =>
  Array.isArray(v) ? v.map((x) => str(x, 60)).filter(Boolean).slice(0, max) : [];

/** Model output and stored JSON are both treated as untrusted, shaped input. */
export function normaliseParsedCv(raw: unknown): ParsedCv {
  const r = (raw ?? {}) as Record<string, unknown>;
  const rows = (v: unknown) => (Array.isArray(v) ? v.slice(0, 15) : []);
  const years = r.years_experience;
  const yearsNum = typeof years === "number" ? years : Number(years);
  return {
    headline: str(r.headline, 160),
    bio: str(r.bio, 2000),
    city: str(r.city, 80),
    country: str(r.country, 80),
    years_experience:
      Number.isFinite(yearsNum) && yearsNum >= 0 && yearsNum <= 60 ? Math.round(yearsNum) : undefined,
    skills: list(r.skills, 20),
    tools: list(r.tools, 20),
    languages: list(r.languages, 10),
    experiences: rows(r.experiences)
      .map((e) => {
        const o = (e ?? {}) as Record<string, unknown>;
        return {
          title: str(o.title, 120),
          company: str(o.company, 120),
          location: str(o.location, 80),
          start: str(o.start, 30),
          end: str(o.end, 30),
          description: str(o.description, 800),
        };
      })
      .filter((e) => e.title || e.company),
    education: rows(r.education)
      .map((e) => {
        const o = (e ?? {}) as Record<string, unknown>;
        return {
          qualification: str(o.qualification, 120),
          institution: str(o.institution, 140),
          field: str(o.field, 120),
          start: str(o.start, 30),
          end: str(o.end, 30),
          grade: str(o.grade, 60),
        };
      })
      .filter((e) => e.qualification || e.institution),
    certifications: rows(r.certifications)
      .map((e) => {
        const o = (e ?? {}) as Record<string, unknown>;
        return { name: str(o.name, 140), issuer: str(o.issuer, 140), year: str(o.year, 20) };
      })
      .filter((c) => c.name),
  };
}

export const asExperiences = (v: unknown): Experience[] => normaliseParsedCv({ experiences: v }).experiences ?? [];
export const asEducation = (v: unknown): Education[] => normaliseParsedCv({ education: v }).education ?? [];
export const asCertifications = (v: unknown): Certification[] =>
  normaliseParsedCv({ certifications: v }).certifications ?? [];

export const dateRange = (e: { start?: string; end?: string }) =>
  [e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ");

export const EMPTY_EXPERIENCE: Experience = {
  title: "", company: "", location: "", start: "", end: "", description: "",
};
export const EMPTY_EDUCATION: Education = {
  qualification: "", institution: "", field: "", start: "", end: "", grade: "",
};
export const EMPTY_CERTIFICATION: Certification = { name: "", issuer: "", year: "" };
