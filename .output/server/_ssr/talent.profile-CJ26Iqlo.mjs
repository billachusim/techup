import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as useNavigate$1, o as useSearchParams, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { $ as LoaderCircle, C as Sparkles, I as Plus, _t as FileCheckCorner, an as ArrowLeft, f as Upload, v as Trash2 } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { t as toast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-De3Puk9b.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { T as profileStrength, l as SKILL_SUGGESTIONS, w as parseList } from "./talent-CymeyHOO.mjs";
import { t as notifyMarketplaceEvent } from "./marketplace-emails.functions-zvG-qfKQ.mjs";
import { t as triggerAutoMatch } from "./automatch.functions-BghdXy8V.mjs";
import { t as TalentNav } from "./TalentNav-CWPMXV1q.mjs";
import { a as asEducation, i as asCertifications, n as EMPTY_EDUCATION, o as asExperiences, r as EMPTY_EXPERIENCE, t as EMPTY_CERTIFICATION } from "./cv-D_dWv71F.mjs";
import { t as Progress } from "./progress-DcTj7PSD.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/talent.profile-CJ26Iqlo.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var Row = ({ onRemove, index, label, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "rounded-lg border border-border bg-card p-4",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
			children: [
				label,
				" ",
				index + 1
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			variant: "ghost",
			size: "sm",
			onClick: onRemove,
			className: "h-8 px-2 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Remove"
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children
	})]
});
var Field = ({ id, label, value, onChange, placeholder, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		htmlFor: id,
		className: "text-xs",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		id,
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder
	})]
});
var AddButton = ({ onClick, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
	type: "button",
	variant: "outline",
	size: "sm",
	onClick,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
			size: 14,
			className: "mr-1.5"
		}),
		" ",
		children
	]
});
function ExperienceEditor({ items, onChange }) {
	const update = (i, patch) => onChange(items.map((item, idx) => idx === i ? {
		...item,
		...patch
	} : item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
			index: i,
			label: "Role",
			onRemove: () => onChange(items.filter((_, idx) => idx !== i)),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `exp-title-${i}`,
					label: "Job title",
					value: item.title,
					onChange: (v) => update(i, { title: v }),
					placeholder: "Data analyst"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `exp-company-${i}`,
					label: "Company",
					value: item.company,
					onChange: (v) => update(i, { company: v }),
					placeholder: "Company name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `exp-location-${i}`,
					label: "Location",
					value: item.location ?? "",
					onChange: (v) => update(i, { location: v }),
					placeholder: "Lagos, Nigeria"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `exp-start-${i}`,
						label: "Start",
						value: item.start ?? "",
						onChange: (v) => update(i, { start: v }),
						placeholder: "Jan 2024"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `exp-end-${i}`,
						label: "End",
						value: item.end ?? "",
						onChange: (v) => update(i, { end: v }),
						placeholder: "Present"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `exp-desc-${i}`,
						className: "text-xs",
						children: "What you did"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: `exp-desc-${i}`,
						rows: 3,
						value: item.description ?? "",
						onChange: (e) => update(i, { description: e.target.value }),
						placeholder: "Built weekly sales dashboards that cut reporting time by half."
					})]
				})
			]
		}, i)), items.length < 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddButton, {
			onClick: () => onChange([...items, { ...EMPTY_EXPERIENCE }]),
			children: "Add work experience"
		})]
	});
}
function EducationEditor({ items, onChange }) {
	const update = (i, patch) => onChange(items.map((item, idx) => idx === i ? {
		...item,
		...patch
	} : item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
			index: i,
			label: "Study",
			onRemove: () => onChange(items.filter((_, idx) => idx !== i)),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `edu-q-${i}`,
					label: "Qualification",
					value: item.qualification,
					onChange: (v) => update(i, { qualification: v }),
					placeholder: "BSc"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `edu-i-${i}`,
					label: "School",
					value: item.institution,
					onChange: (v) => update(i, { institution: v }),
					placeholder: "Nnamdi Azikiwe University"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `edu-f-${i}`,
					label: "Course or field",
					value: item.field ?? "",
					onChange: (v) => update(i, { field: v }),
					placeholder: "Computer science"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `edu-s-${i}`,
						label: "Start",
						value: item.start ?? "",
						onChange: (v) => update(i, { start: v }),
						placeholder: "2019"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						id: `edu-e-${i}`,
						label: "End",
						value: item.end ?? "",
						onChange: (v) => update(i, { end: v }),
						placeholder: "2023"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `edu-g-${i}`,
					label: "Grade (optional)",
					value: item.grade ?? "",
					onChange: (v) => update(i, { grade: v }),
					placeholder: "Second class upper"
				})
			]
		}, i)), items.length < 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddButton, {
			onClick: () => onChange([...items, { ...EMPTY_EDUCATION }]),
			children: "Add education"
		})]
	});
}
function CertificationEditor({ items, onChange }) {
	const update = (i, patch) => onChange(items.map((item, idx) => idx === i ? {
		...item,
		...patch
	} : item));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Row, {
			index: i,
			label: "Certificate",
			onRemove: () => onChange(items.filter((_, idx) => idx !== i)),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `cert-n-${i}`,
					label: "Certificate",
					value: item.name,
					onChange: (v) => update(i, { name: v }),
					placeholder: "Google Data Analytics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `cert-i-${i}`,
					label: "Issued by",
					value: item.issuer ?? "",
					onChange: (v) => update(i, { issuer: v }),
					placeholder: "Google"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: `cert-y-${i}`,
					label: "Year",
					value: item.year ?? "",
					onChange: (v) => update(i, { year: v }),
					placeholder: "2025"
				})
			]
		}, i)), items.length < 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddButton, {
			onClick: () => onChange([...items, { ...EMPTY_CERTIFICATION }]),
			children: "Add certificate"
		})]
	});
}
/**
* Reads a member's own uploaded CV and returns structured suggestions. It never
* writes to the profile — the member reviews and saves the result themselves.
*/
var parseCv = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input || typeof input.path !== "string" || input.path.length > 300) throw new Error("Invalid CV reference");
	return { path: input.path };
}).handler(createSsrRpc("3805bfc095b783978f14ec76910b030530891d2515385b225715ed7105f09052"));
var empty = {
	full_name: "",
	email: "",
	phone: "",
	whatsapp: "",
	city: "",
	country: "Nigeria",
	headline: "",
	bio: "",
	linkedin_url: "",
	github_url: "",
	portfolio_url: "",
	intro_video_url: "",
	skills: [],
	tools: "",
	languages: "",
	years_experience: "",
	hours_per_week: "",
	work_mode: "remote",
	rate_amount: "",
	rate_currency: "NGN",
	availability: "open",
	cv_path: null,
	experiences: [],
	education: [],
	certifications: []
};
var TalentProfile = () => {
	const navigate = useNavigate$1();
	const [params] = useSearchParams();
	const nextPath = params.get("next");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [parsing, setParsing] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(empty);
	const [profileId, setProfileId] = (0, import_react.useState)(null);
	const [facultyId, setFacultyId] = (0, import_react.useState)(null);
	const [skillInput, setSkillInput] = (0, import_react.useState)("");
	const set = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) {
				navigate("/login?next=/talent/profile", { replace: true });
				return;
			}
			const [{ data: existing }, { data: account }] = await Promise.all([supabase.from("talent_profiles").select("*").eq("user_id", auth.user.id).maybeSingle(), supabase.from("profiles").select("faculty_id, name, email, phone, department").eq("id", auth.user.id).maybeSingle()]);
			let profile = existing;
			if (!profile) {
				const { data: claimedId } = await supabase.rpc("claim_my_talent_profile");
				if (claimedId) {
					profile = (await supabase.from("talent_profiles").select("*").eq("id", claimedId).maybeSingle()).data;
					if (profile) toast({
						title: "We found your existing talent profile",
						description: "It is now linked to this account."
					});
				}
			}
			setFacultyId(profile?.faculty_id ?? account?.faculty_id ?? null);
			if (profile) {
				setProfileId(profile.id);
				setForm({
					full_name: profile.full_name ?? "",
					email: profile.email ?? auth.user.email ?? "",
					phone: profile.phone ?? "",
					whatsapp: profile.whatsapp ?? "",
					city: profile.city ?? "",
					country: profile.country ?? "Nigeria",
					headline: profile.headline ?? "",
					bio: profile.bio ?? "",
					linkedin_url: profile.linkedin_url ?? "",
					github_url: profile.github_url ?? "",
					portfolio_url: profile.portfolio_url ?? "",
					intro_video_url: profile.intro_video_url ?? "",
					skills: profile.skills ?? [],
					tools: (profile.tools ?? []).join(", "),
					languages: (profile.languages ?? []).join(", "),
					years_experience: profile.years_experience?.toString() ?? "",
					hours_per_week: profile.hours_per_week?.toString() ?? "",
					work_mode: profile.work_mode ?? "remote",
					rate_amount: profile.rate_amount?.toString() ?? "",
					rate_currency: profile.rate_currency ?? "NGN",
					availability: profile.availability ?? "open",
					cv_path: profile.cv_path,
					experiences: asExperiences(profile.experiences),
					education: asEducation(profile.education),
					certifications: asCertifications(profile.certifications)
				});
			} else setForm({
				...empty,
				full_name: account?.name ?? "",
				email: account?.email ?? auth.user.email ?? "",
				phone: account?.phone ?? "",
				whatsapp: account?.phone ?? "",
				skills: account?.department ? [account.department] : []
			});
			setLoading(false);
		})();
	}, [navigate]);
	const strength = profileStrength({
		full_name: form.full_name,
		city: form.city,
		phone: form.phone,
		skills: form.skills,
		cv_path: form.cv_path,
		headline: form.headline,
		bio: form.bio,
		linkedin_url: form.linkedin_url,
		github_url: form.github_url,
		portfolio_url: form.portfolio_url,
		years_experience: form.years_experience ? Number(form.years_experience) : null,
		hours_per_week: form.hours_per_week ? Number(form.hours_per_week) : null,
		rate_amount: form.rate_amount ? Number(form.rate_amount) : null
	});
	const addSkill = (skill) => {
		const clean = skill.trim();
		if (!clean) return;
		if (form.skills.some((s) => s.toLowerCase() === clean.toLowerCase())) return;
		set("skills", [...form.skills, clean].slice(0, 25));
	};
	const uploadCv = async (file) => {
		setUploading(true);
		try {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) throw new Error("Please sign in again.");
			if (file.size > 10485760) throw new Error("Please keep your CV under 10MB.");
			const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
			const path = `${auth.user.id}/cv-${Date.now()}.${ext}`;
			const { error } = await supabase.storage.from("talent-cvs").upload(path, file, { upsert: true });
			if (error) throw error;
			set("cv_path", path);
			toast({
				title: "CV uploaded",
				description: "Remember to save your profile."
			});
		} catch (err) {
			toast({
				title: "Upload failed",
				description: err instanceof Error ? err.message : "Please try a PDF or Word file.",
				variant: "destructive"
			});
		} finally {
			setUploading(false);
		}
	};
	/** Reads the uploaded CV and pre-fills empty fields; nothing is saved until they press save. */
	const autofillFromCv = async () => {
		if (!form.cv_path) return;
		setParsing(true);
		try {
			const result = await parseCv({ data: { path: form.cv_path } });
			if ("error" in result) {
				toast({
					title: "Could not read that CV",
					description: result.error,
					variant: "destructive"
				});
				return;
			}
			const p = result.parsed;
			setForm((f) => ({
				...f,
				headline: f.headline || (p.headline ?? ""),
				bio: f.bio || (p.bio ?? ""),
				city: f.city || (p.city ?? ""),
				country: f.country || (p.country ?? "Nigeria"),
				years_experience: f.years_experience || (p.years_experience != null ? String(p.years_experience) : ""),
				tools: f.tools || (p.tools ?? []).join(", "),
				languages: f.languages || (p.languages ?? []).join(", "),
				skills: f.skills.length ? f.skills : (p.skills ?? []).slice(0, 25),
				experiences: f.experiences.length ? f.experiences : p.experiences ?? [],
				education: f.education.length ? f.education : p.education ?? [],
				certifications: f.certifications.length ? f.certifications : p.certifications ?? []
			}));
			toast({
				title: "We filled in what we found",
				description: "Check every detail, edit anything that is wrong, then save."
			});
		} catch (err) {
			toast({
				title: "Could not read that CV",
				description: err instanceof Error ? err.message : "Please try again in a moment.",
				variant: "destructive"
			});
		} finally {
			setParsing(false);
		}
	};
	const save = async () => {
		if (!form.full_name.trim() || !form.phone.trim() || !form.city.trim() || form.skills.length === 0) {
			toast({
				title: "A few details are missing",
				description: "Name, phone, city and at least one skill are required.",
				variant: "destructive"
			});
			return;
		}
		setSaving(true);
		try {
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) throw new Error("Please sign in again.");
			const payload = {
				user_id: auth.user.id,
				faculty_id: facultyId,
				full_name: form.full_name.trim().slice(0, 120),
				email: form.email.trim() || null,
				phone: form.phone.trim().slice(0, 40),
				whatsapp: form.whatsapp.trim().slice(0, 40) || null,
				city: form.city.trim().slice(0, 80),
				country: form.country.trim() || "Nigeria",
				headline: form.headline.trim().slice(0, 160) || null,
				bio: form.bio.trim().slice(0, 2e3) || null,
				linkedin_url: form.linkedin_url.trim() || null,
				github_url: form.github_url.trim() || null,
				portfolio_url: form.portfolio_url.trim() || null,
				intro_video_url: form.intro_video_url.trim() || null,
				skills: form.skills,
				tools: parseList(form.tools),
				languages: parseList(form.languages),
				experiences: form.experiences.filter((e) => e.title || e.company),
				education: form.education.filter((e) => e.qualification || e.institution),
				certifications: form.certifications.filter((c) => c.name),
				years_experience: form.years_experience ? Number(form.years_experience) : null,
				hours_per_week: form.hours_per_week ? Number(form.hours_per_week) : null,
				work_mode: form.work_mode,
				rate_amount: form.rate_amount ? Number(form.rate_amount) : null,
				rate_currency: form.rate_currency,
				availability: form.availability,
				profile_strength: strength
			};
			let savedId = profileId;
			if (profileId) {
				const { error } = await supabase.from("talent_profiles").update({
					...payload,
					cv_path: form.cv_path
				}).eq("id", profileId);
				if (error) throw error;
			} else {
				const { data, error } = await supabase.from("talent_profiles").insert({
					...payload,
					cv_path: form.cv_path
				}).select("id").single();
				if (error) throw error;
				setProfileId(data.id);
				savedId = data.id;
			}
			toast({
				title: "Profile saved",
				description: "You are now in the matching pool."
			});
			if (!facultyId) {
				const { data: issued } = await supabase.rpc("claim_talent_faculty_id");
				if (issued) {
					setFacultyId(issued);
					toast({
						title: "Faculty ID linked",
						description: `${issued}: you get priority matching as a Tech Faculty student.`
					});
				}
			}
			if (savedId) {
				notifyMarketplaceEvent({ data: {
					event: "profile_submitted",
					id: savedId
				} }).catch(() => {});
				triggerAutoMatch({ data: { talentId: savedId } }).catch(() => {});
			}
			navigate(nextPath && nextPath.startsWith("/") ? nextPath : "/talent/dashboard");
		} catch (err) {
			toast({
				title: "Could not save your profile",
				description: err instanceof Error ? err.message : "Please try again.",
				variant: "destructive"
			});
		} finally {
			setSaving(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "container mx-auto max-w-3xl px-4 pt-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto animate-spin text-muted-foreground" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-3xl px-4 py-10 md:py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: "/talent/dashboard",
							className: "mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 14 }), " Back to dashboard"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold sm:text-3xl",
							children: "Your talent profile"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Only your name, city and skills are shown to hiring teams we match you with. Your CV and contact details stay private until you are shortlisted."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-lg border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Profile strength"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [strength, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: strength }),
								facultyId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: ["Faculty ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-medium text-foreground",
										children: facultyId
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: "Profiles at 70% or more are approved automatically. Tech Faculty students and alumni get their Faculty ID linked here, plus priority matching."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 space-y-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-semibold",
											children: "Required details"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "full_name",
													children: "Full name *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "full_name",
													value: form.full_name,
													onChange: (e) => set("full_name", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "phone",
													children: "Phone *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "phone",
													value: form.phone,
													onChange: (e) => set("phone", e.target.value),
													placeholder: "08012345678"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "whatsapp",
													children: "WhatsApp number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "whatsapp",
													value: form.whatsapp,
													onChange: (e) => set("whatsapp", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "email",
													children: "Email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "email",
													type: "email",
													value: form.email,
													onChange: (e) => set("email", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "city",
													children: "City *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "city",
													value: form.city,
													onChange: (e) => set("city", e.target.value),
													placeholder: "Nnewi"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "country",
													children: "Country"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "country",
													value: form.country,
													onChange: (e) => set("country", e.target.value)
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Skills *" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: skillInput,
													onChange: (e) => setSkillInput(e.target.value),
													onKeyDown: (e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															addSkill(skillInput);
															setSkillInput("");
														}
													},
													placeholder: "Type a skill and press Enter"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "outline",
													onClick: () => {
														addSkill(skillInput);
														setSkillInput("");
													},
													children: "Add"
												})]
											}),
											form.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 flex flex-wrap gap-2",
												children: form.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => set("skills", form.skills.filter((s) => s !== skill)),
													className: "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary",
													children: [skill, " ×"]
												}, skill))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 flex flex-wrap gap-2",
												children: SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).slice(0, 14).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => addSkill(s),
													className: "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground",
													children: ["+ ", s]
												}, s))
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "cv",
												children: "CV or résumé"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 flex flex-wrap items-center gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "cv",
														type: "file",
														accept: ".pdf,.doc,.docx",
														className: "max-w-xs",
														onChange: (e) => {
															const f = e.target.files?.[0];
															if (f) uploadCv(f);
														}
													}),
													uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
														size: 16,
														className: "animate-spin text-muted-foreground"
													}),
													form.cv_path && !uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1.5 text-sm text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { size: 14 }), " CV on file"]
													}),
													!form.cv_path && !uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1.5 text-sm text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 14 }), " PDF or Word, up to 10MB"]
													})
												]
											}),
											form.cv_path && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-lg border border-primary/30 bg-primary/5 p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-medium",
														children: "Save time — fill this profile from your CV"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-sm text-muted-foreground",
														children: "We read your PDF CV and fill in your headline, experience, education, certificates and skills. Nothing is saved until you check it and press save."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "button",
														variant: "outline",
														size: "sm",
														className: "mt-3",
														onClick: autofillFromCv,
														disabled: parsing,
														children: [parsing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
															size: 14,
															className: "mr-1.5 animate-spin"
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
															size: 14,
															className: "mr-1.5"
														}), parsing ? "Reading your CV…" : "Fill in from my CV"]
													})
												]
											})
										] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-semibold",
											children: "Optional — but it raises your matches"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "You can come back and add these any time."
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "headline",
											children: "Headline"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "headline",
											value: form.headline,
											onChange: (e) => set("headline", e.target.value),
											placeholder: "Frontend developer building dashboards for SMEs"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "bio",
											children: "Short bio"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "bio",
											rows: 4,
											value: form.bio,
											onChange: (e) => set("bio", e.target.value)
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "linkedin_url",
													children: "LinkedIn"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "linkedin_url",
													value: form.linkedin_url,
													onChange: (e) => set("linkedin_url", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "github_url",
													children: "GitHub"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "github_url",
													value: form.github_url,
													onChange: (e) => set("github_url", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "portfolio_url",
													children: "Portfolio or work samples"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "portfolio_url",
													value: form.portfolio_url,
													onChange: (e) => set("portfolio_url", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "intro_video_url",
													children: "Short intro video link"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "intro_video_url",
													value: form.intro_video_url,
													onChange: (e) => set("intro_video_url", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "tools",
													children: "Tools you use"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "tools",
													value: form.tools,
													onChange: (e) => set("tools", e.target.value),
													placeholder: "Figma, Excel, VS Code"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "years_experience",
													children: "Years of experience"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "years_experience",
													type: "number",
													min: "0",
													max: "50",
													value: form.years_experience,
													onChange: (e) => set("years_experience", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "hours_per_week",
													children: "Hours available per week"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "hours_per_week",
													type: "number",
													min: "1",
													max: "80",
													value: form.hours_per_week,
													onChange: (e) => set("hours_per_week", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preferred work mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.work_mode,
													onValueChange: (v) => set("work_mode", v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "remote",
															children: "Remote"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "hybrid",
															children: "Hybrid"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "onsite",
															children: "On-site"
														})
													] })]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "rate_amount",
													children: "Expected pay (per month)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "rate_amount",
													type: "number",
													min: "0",
													value: form.rate_amount,
													onChange: (e) => set("rate_amount", e.target.value)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Currency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.rate_currency,
													onValueChange: (v) => set("rate_currency", v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "NGN",
														children: "Naira (₦)"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "USD",
														children: "US Dollar ($)"
													})] })]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Availability" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: form.availability,
													onValueChange: (v) => set("availability", v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "open",
														children: "Open to work"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "unavailable",
														children: "Not available right now"
													})] })]
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "languages",
											children: "Languages you speak"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "languages",
											value: form.languages,
											onChange: (e) => set("languages", e.target.value),
											placeholder: "English, Igbo, French"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-semibold",
										children: "Work experience"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Roles, internships and freelance work. This is what hiring teams read first."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExperienceEditor, {
										items: form.experiences,
										onChange: (v) => set("experiences", v)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-semibold",
										children: "Education"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Degrees, diplomas and training programmes."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EducationEditor, {
										items: form.education,
										onChange: (v) => set("education", v)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-semibold",
										children: "Certificates"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Anything you have been awarded, including your Tech Faculty certificate."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificationEditor, {
										items: form.certifications,
										onChange: (v) => set("certifications", v)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									className: "w-full sm:w-auto",
									onClick: save,
									disabled: saving,
									children: saving ? "Saving…" : profileId ? "Save changes" : "Join the talent pool"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = TalentProfile;
//#endregion
export { SplitComponent as component };
