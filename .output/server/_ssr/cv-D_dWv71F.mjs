//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/cv-D_dWv71F.js
var str = (v, max = 400) => typeof v === "string" ? v.trim().slice(0, max) : "";
var list = (v, max = 25) => Array.isArray(v) ? v.map((x) => str(x, 60)).filter(Boolean).slice(0, max) : [];
/** Model output and stored JSON are both treated as untrusted, shaped input. */
function normaliseParsedCv(raw) {
	const r = raw ?? {};
	const rows = (v) => Array.isArray(v) ? v.slice(0, 15) : [];
	const years = r.years_experience;
	const yearsNum = typeof years === "number" ? years : Number(years);
	return {
		headline: str(r.headline, 160),
		bio: str(r.bio, 2e3),
		city: str(r.city, 80),
		country: str(r.country, 80),
		years_experience: Number.isFinite(yearsNum) && yearsNum >= 0 && yearsNum <= 60 ? Math.round(yearsNum) : void 0,
		skills: list(r.skills, 20),
		tools: list(r.tools, 20),
		languages: list(r.languages, 10),
		experiences: rows(r.experiences).map((e) => {
			const o = e ?? {};
			return {
				title: str(o.title, 120),
				company: str(o.company, 120),
				location: str(o.location, 80),
				start: str(o.start, 30),
				end: str(o.end, 30),
				description: str(o.description, 800)
			};
		}).filter((e) => e.title || e.company),
		education: rows(r.education).map((e) => {
			const o = e ?? {};
			return {
				qualification: str(o.qualification, 120),
				institution: str(o.institution, 140),
				field: str(o.field, 120),
				start: str(o.start, 30),
				end: str(o.end, 30),
				grade: str(o.grade, 60)
			};
		}).filter((e) => e.qualification || e.institution),
		certifications: rows(r.certifications).map((e) => {
			const o = e ?? {};
			return {
				name: str(o.name, 140),
				issuer: str(o.issuer, 140),
				year: str(o.year, 20)
			};
		}).filter((c) => c.name)
	};
}
var asExperiences = (v) => normaliseParsedCv({ experiences: v }).experiences ?? [];
var asEducation = (v) => normaliseParsedCv({ education: v }).education ?? [];
var asCertifications = (v) => normaliseParsedCv({ certifications: v }).certifications ?? [];
var dateRange = (e) => [e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ");
var EMPTY_EXPERIENCE = {
	title: "",
	company: "",
	location: "",
	start: "",
	end: "",
	description: ""
};
var EMPTY_EDUCATION = {
	qualification: "",
	institution: "",
	field: "",
	start: "",
	end: "",
	grade: ""
};
var EMPTY_CERTIFICATION = {
	name: "",
	issuer: "",
	year: ""
};
//#endregion
export { asEducation as a, normaliseParsedCv as c, asCertifications as i, EMPTY_EDUCATION as n, asExperiences as o, EMPTY_EXPERIENCE as r, dateRange as s, EMPTY_CERTIFICATION as t };
