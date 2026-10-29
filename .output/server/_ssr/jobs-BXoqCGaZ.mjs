import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/jobs-BXoqCGaZ.js
var jobs_exports = /* @__PURE__ */ __exportAll({
	africaFirst: () => africaFirst,
	employmentLabel: () => employmentLabel,
	fetchJobBySlug: () => fetchJobBySlug,
	fetchJobs: () => fetchJobs,
	jobAddress: () => jobAddress,
	jobPostingSchema: () => jobPostingSchema,
	locationLabel: () => locationLabel,
	salaryLabel: () => salaryLabel
});
var AFRICA_HINTS = [
	"nigeria",
	"africa",
	"lagos",
	"abuja",
	"ng",
	"worldwide",
	"global",
	"anywhere",
	"remote"
];
/** Roles open to Nigeria/Africa (or fully remote/global) sort first. */
function africaFirst(a, b) {
	const score = (j) => {
		const hay = `${j.location ?? ""} ${j.country ?? ""}`.toLowerCase();
		return AFRICA_HINTS.some((h) => hay.includes(h)) || j.is_remote ? 0 : 1;
	};
	const diff = score(a) - score(b);
	if (diff !== 0) return diff;
	return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime();
}
async function fetchJobs(limit = 300) {
	const { data, error } = await (await getSupabase()).from("jobs").select("*").eq("is_expired", false).order("last_seen_at", { ascending: false }).limit(limit);
	if (error) throw error;
	return (data ?? []).sort(africaFirst);
}
async function fetchJobBySlug(slug) {
	const { data, error } = await (await getSupabase()).from("jobs").select("*").eq("slug", slug).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
function employmentLabel(type) {
	switch (type) {
		case "INTERN": return "Internship";
		case "CONTRACTOR": return "Contract";
		case "PART_TIME": return "Part-time";
		case "TEMPORARY": return "Temporary";
		default: return "Full-time";
	}
}
function salaryLabel(job) {
	if (!job.salary_min && !job.salary_max) return null;
	const cur = job.salary_currency ?? "";
	const unit = job.salary_unit ? `/${job.salary_unit.toLowerCase()}` : "";
	const fmt = (n) => n.toLocaleString();
	if (job.salary_min && job.salary_max) return `${cur} ${fmt(job.salary_min)} – ${fmt(job.salary_max)}${unit}`.trim();
	return `${cur} ${fmt(job.salary_min ?? job.salary_max)}${unit}`.trim();
}
function locationLabel(job) {
	if (job.location) return job.location;
	return job.is_remote ? "Remote" : "See listing";
}
var HQ_ADDRESS = {
	streetAddress: "Technology Incubation Center, NBTI South-East Zonal Office",
	addressLocality: "Nnewi",
	addressRegion: "Anambra",
	postalCode: "435101",
	addressCountry: "NG"
};
var CITY_ADDRESS = {
	lagos: {
		addressRegion: "Lagos",
		postalCode: "101233",
		streetAddress: "Technology Incubation Center, Yaba"
	},
	abuja: {
		addressRegion: "FCT",
		postalCode: "900001",
		streetAddress: "Technology Incubation Center, Central Business District"
	},
	onitsha: {
		addressRegion: "Anambra",
		postalCode: "420001",
		streetAddress: "Anene Close, Off Ezeiweka Road, Awada"
	},
	nnewi: {
		addressRegion: "Anambra",
		postalCode: "435101",
		streetAddress: HQ_ADDRESS.streetAddress
	},
	enugu: {
		addressRegion: "Enugu",
		postalCode: "400001",
		streetAddress: "Technology Incubation Center, Independence Layout"
	},
	owerri: {
		addressRegion: "Imo",
		postalCode: "460001",
		streetAddress: "Technology Incubation Center, Wetheral Road"
	},
	aba: {
		addressRegion: "Abia",
		postalCode: "450001",
		streetAddress: "Technology Incubation Center, Aba"
	},
	abakaliki: {
		addressRegion: "Ebonyi",
		postalCode: "480001",
		streetAddress: "Technology Incubation Center, Abakaliki"
	},
	"port harcourt": {
		addressRegion: "Rivers",
		postalCode: "500001",
		streetAddress: "Technology Incubation Center, Port Harcourt"
	},
	ibadan: {
		addressRegion: "Oyo",
		postalCode: "200001",
		streetAddress: "Technology Incubation Center, Ibadan"
	},
	kano: {
		addressRegion: "Kano",
		postalCode: "700001",
		streetAddress: "Technology Incubation Center, Kano"
	}
};
/** Always yields a complete PostalAddress; remote/unknown roles fall back to the Nnewi HQ address. */
function jobAddress(job) {
	const hay = `${job.location ?? ""}`.toLowerCase();
	const match = Object.keys(CITY_ADDRESS).find((city) => hay.includes(city));
	if (!match) return {
		"@type": "PostalAddress",
		...HQ_ADDRESS
	};
	const city = CITY_ADDRESS[match];
	return {
		"@type": "PostalAddress",
		streetAddress: city.streetAddress,
		addressLocality: match.replace(/\b\w/g, (c) => c.toUpperCase()),
		addressRegion: city.addressRegion,
		postalCode: city.postalCode,
		addressCountry: job.country ?? "NG"
	};
}
function jobPostingSchema(job) {
	const remote = job.is_remote;
	return {
		"@context": "https://schema.org",
		"@type": "JobPosting",
		title: job.title,
		description: job.description,
		datePosted: job.posted_at ?? job.last_seen_at.slice(0, 10),
		validThrough: new Date(new Date(job.last_seen_at).getTime() + 5184e6).toISOString().slice(0, 10),
		employmentType: job.employment_type,
		hiringOrganization: {
			"@type": "Organization",
			name: job.company
		},
		jobLocationType: remote ? "TELECOMMUTE" : void 0,
		applicantLocationRequirements: remote ? {
			"@type": "Country",
			name: "Nigeria"
		} : void 0,
		jobLocation: {
			"@type": "Place",
			address: jobAddress(job)
		},
		...job.salary_min || job.salary_max ? { baseSalary: {
			"@type": "MonetaryAmount",
			currency: job.salary_currency ?? "USD",
			value: {
				"@type": "QuantitativeValue",
				minValue: job.salary_min ?? job.salary_max,
				maxValue: job.salary_max ?? job.salary_min,
				unitText: job.salary_unit ?? "MONTH"
			}
		} } : {},
		url: `https://techfaculty.ng/careers/jobs/${job.slug}`,
		directApply: false,
		identifier: {
			"@type": "PropertyValue",
			name: job.source_platform,
			value: job.slug
		}
	};
}
//#endregion
export { jobs_exports as a, jobPostingSchema as i, fetchJobBySlug as n, locationLabel as o, fetchJobs as r, salaryLabel as s, employmentLabel as t };
