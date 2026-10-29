import "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Body } from "../_libs/react-email__body.mjs";
import { t as Button } from "../_libs/react-email__button.mjs";
import { t as Container } from "../_libs/react-email__container.mjs";
import { t as Head } from "../_libs/react-email__head.mjs";
import { t as Heading } from "../_libs/react-email__heading.mjs";
import { t as Hr } from "../_libs/react-email__hr.mjs";
import { t as Html } from "../_libs/react-email__html.mjs";
import { t as Link } from "../_libs/react-email__link.mjs";
import { t as Preview } from "../_libs/react-email__preview.mjs";
import { t as Text } from "../_libs/react-email__text.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/registry-Cs-NAxLC.js
var import_jsx_runtime = require_jsx_runtime();
require_react();
var SITE$2 = "https://techfaculty.ng";
var Layout$1 = ({ preview, title, children, cta, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: preview }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$2,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand$2,
						children: "TECH FACULTY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$2,
						children: title
					}),
					children,
					cta && href && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						style: button$2,
						href,
						children: cta
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$2 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$2,
						children: "Tech Faculty Talent Marketplace · Train, Certify and Employ"
					})
				]
			})
		})
	]
});
var hi$1 = (name) => name ? `Hi ${name.split(" ")[0]},` : "Hi there,";
var ApplicationReceived = ({ name, roleTitle, company }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: `We received your application for ${roleTitle ?? "the role"}`,
	title: "Application received",
	cta: "Track your application",
	href: `${SITE$2}/talent/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: hi$1(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Thanks for applying for ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: roleTitle ?? "this role" }),
				company ? ` with ${company}` : "",
				". Our team reviews every application and matches talent on skills and profile strength."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: "A complete profile and CV improves your chances. You'll hear from us by email or WhatsApp once there's an update."
		})
	]
});
var NewApplicationAdmin = ({ talentName, roleTitle, company }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout$1, {
	preview: `New application: ${roleTitle ?? "role"}`,
	title: "New application",
	cta: "Review in admin",
	href: `${SITE$2}/admin/talent`,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
		style: text$2,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: talentName ?? "A talent" }),
			" applied for ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: roleTitle ?? "a role" }),
			company ? ` (${company})` : "",
			"."
		]
	})
});
var STATUS_COPY = {
	approved: {
		title: "You've been matched to a project",
		body: "Our matching system and team think you are a strong fit. Open your dashboard to accept or decline."
	},
	accepted: {
		title: "You're selected for the project",
		body: "Your project workspace is now open on your dashboard, with the group, task board and files."
	},
	assessment: {
		title: "Next step: assessment",
		body: "You have moved to the assessment stage. Our team will share the assessment on WhatsApp shortly."
	},
	interview: {
		title: "Next step: interview",
		body: "You have moved to the interview stage. Our team will reach out on WhatsApp to schedule it."
	},
	hired: {
		title: "Congratulations, you're hired",
		body: "You are now working on this project. Log your weekly work from your dashboard so it counts toward your pay."
	},
	slack_link: {
		title: "Join your project Slack",
		body: "You have been selected for this project. Join the project Slack channel with the button below to meet the team and get your first tasks."
	}
};
var MatchUpdate = ({ name, roleTitle, company, status, assessmentUrl, interviewUrl, interviewChannel, slackUrl }) => {
	const c = STATUS_COPY[status ?? "approved"] ?? STATUS_COPY.approved;
	const via = interviewChannel === "google_meet" ? "Google Meet" : "WhatsApp call";
	let body = c.body;
	let cta = "Open your dashboard";
	let href = `${SITE$2}/talent/dashboard`;
	if (status === "assessment" && assessmentUrl) {
		body = "You have moved to the assessment stage. Open the assessment with the button below and complete it as soon as you can.";
		cta = "Start the assessment";
		href = assessmentUrl;
	} else if (status === "interview" && interviewUrl) {
		body = `You have moved to the interview stage. Pick a time that suits you with the button below. The interview is a ${via}.`;
		cta = "Book your interview";
		href = interviewUrl;
	} else if (status === "slack_link" && slackUrl) {
		cta = "Join the project Slack";
		href = slackUrl;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
		preview: c.title,
		title: c.title,
		cta,
		href,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				style: text$2,
				children: hi$1(name)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
				style: text$2,
				children: [
					"Project: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: roleTitle ?? "Project" }),
					company ? ` · ${company}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				style: text$2,
				children: body
			}),
			slackUrl && status !== "slack_link" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
				style: text$2,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: slackUrl,
					style: { color: "#000000" },
					children: "Join the Tech Faculty Slack"
				}), " with this same email address. We add you to the talent pool automatically once you're in."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				style: muted$1,
				children: "No update after two days? Message your project manager from your dashboard."
			})
		]
	});
};
var DeliverableReviewed = ({ name, title, roleTitle, status, note }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: `Your work log was ${status === "needs_changes" ? "returned for changes" : "reviewed"}`,
	title: status === "needs_changes" ? "Changes requested" : "Work reviewed",
	cta: "View on your dashboard",
	href: `${SITE$2}/talent/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: hi$1(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Your work log ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: title ?? "" }),
				" on ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: roleTitle ?? "your project" }),
				" was ",
				status === "needs_changes" ? "returned for changes" : "reviewed and accepted",
				"."
			]
		}),
		note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: quote$1,
			children: note
		})
	]
});
var TalentApproved = ({ name, facultyId }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: "You're now an approved Tech Faculty talent",
	title: "You're an approved talent",
	cta: "See open roles",
	href: `${SITE$2}/careers`,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
		style: text$2,
		children: hi$1(name)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
		style: text$2,
		children: [
			"Your talent profile has been approved",
			facultyId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" and your Faculty ID is ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: facultyId })] }) : "",
			". You can now be matched to client projects and apply to roles with one click."
		]
	})]
});
var ProfileSubmitted = ({ name, strength, facultyId }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: "Your talent profile is in",
	title: "Your profile is in",
	cta: "Open your profile",
	href: `${SITE$2}/talent/profile`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: hi$1(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Thanks for building your Tech Faculty talent profile",
				typeof strength === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" — it is ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [strength, "% complete"] })] }) : "",
				". Our team reviews new profiles and matches them to open projects on skills, availability and profile strength."
			]
		}),
		facultyId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Your Faculty ID is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: facultyId }),
				". Keep it for applications and certificates."
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: "Profiles at 70% or more are approved automatically, so add your CV, skills, experience and availability. Taking a Tech Faculty course gets you a Faculty ID and priority matching for roles in your field."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted$1,
			children: "Next: browse open roles and apply with your profile."
		})
	]
});
var IntroRequestReceived = ({ requesterName, talentName }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: `We received your request to meet ${talentName ?? "our talent"}`,
	title: "Introduction request received",
	cta: "Browse more talent",
	href: `${SITE$2}/talent/pool`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: hi$1(requesterName)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Thanks for your interest in ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: talentName ?? "our talent" }),
				". Our team reviews every request and handles the introduction personally on WhatsApp."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: "You will hear from us within one working day with next steps, availability and a working arrangement."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted$1,
			children: "Contact details and CVs of our talent stay private until an introduction is agreed."
		})
	]
});
var IntroRequestAdmin = ({ requesterName, requesterOrg, requesterContact, talentName, message }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: `Intro request for ${talentName ?? "a talent"}`,
	title: "New introduction request",
	cta: "Open admin",
	href: `${SITE$2}/admin/talent`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: requesterName ?? "Someone" }),
				requesterOrg ? ` (${requesterOrg})` : "",
				" asked to be introduced to ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: talentName ?? "a talent" }),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: ["Contact: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: requesterContact ?? "not provided" })]
		}),
		message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: quote$1,
			children: message
		})
	]
});
var IntroApproved = ({ requesterName, talentName }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: `Your introduction to ${talentName ?? "our talent"} is approved`,
	title: "Introduction approved",
	cta: "See the profile",
	href: `${SITE$2}/talent/pool`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: hi$1(requesterName)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Good news — your request to work with ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: talentName ?? "our talent" }),
				" has been approved."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: "A Tech Faculty project manager will open the introduction on WhatsApp, agree scope and timelines with you, and oversee delivery from start to finish."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted$1,
			children: "Payments and working agreements are handled directly with our team on WhatsApp."
		})
	]
});
var HiringRequestReceived = ({ contactName, company, projectTitle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: "We received your hiring request",
	title: "Hiring request received",
	cta: "Browse our talent",
	href: `${SITE$2}/talent/pool`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: hi$1(contactName)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text$2,
			children: [
				"Thanks for telling us what ",
				company ?? "your business",
				" needs",
				projectTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [": ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: projectTitle })] }) : "",
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text$2,
			children: "Our team reviews every brief and comes back within two working days with a shortlist of matched talent. A Tech Faculty project manager oversees the work end to end."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted$1,
			children: "For a faster reply, send us the same details on WhatsApp."
		})
	]
});
var HiringRequestAdmin = ({ contactName, company, projectTitle, phone, email }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout$1, {
	preview: `New hiring request from ${company ?? "a business"}`,
	title: "New hiring request",
	cta: "Open admin",
	href: `${SITE$2}/admin/talent`,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
		style: text$2,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: company ?? "A business" }),
			" needs: ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: projectTitle ?? "a project" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
		style: text$2,
		children: [
			"Contact: ",
			contactName ?? "not provided",
			" · ",
			phone ?? "",
			" ",
			email ? `· ${email}` : ""
		]
	})]
});
var profileSubmitted = {
	component: ProfileSubmitted,
	subject: "Your Tech Faculty talent profile is in",
	displayName: "Talent profile submitted",
	previewData: {
		name: "Ada Obi",
		strength: 100,
		facultyId: "TF-WD-OL-0926-0001"
	}
};
var introRequestReceived = {
	component: IntroRequestReceived,
	subject: (d) => `We received your request to meet ${d.talentName ?? "our talent"}`,
	displayName: "Intro request received (client)",
	previewData: {
		requesterName: "Chidi Okeke",
		talentName: "Ada Obi"
	}
};
var introRequestAdmin = {
	component: IntroRequestAdmin,
	subject: (d) => `Intro request for ${d.talentName ?? "a talent"}`,
	displayName: "Intro request (staff)",
	to: "nachusim@gmail.com",
	previewData: {
		requesterName: "Chidi Okeke",
		requesterOrg: "Okeke Stores",
		requesterContact: "+2348000000000",
		talentName: "Ada Obi",
		message: "I need a website."
	}
};
var introApproved = {
	component: IntroApproved,
	subject: (d) => `Your introduction to ${d.talentName ?? "our talent"} is approved`,
	displayName: "Intro approved (client)",
	previewData: {
		requesterName: "Chidi Okeke",
		talentName: "Ada Obi"
	}
};
var hiringRequestReceived = {
	component: HiringRequestReceived,
	subject: "We received your hiring request",
	displayName: "Hiring request received (client)",
	previewData: {
		contactName: "Chidi Okeke",
		company: "Okeke Stores",
		projectTitle: "Online ordering website"
	}
};
var hiringRequestAdmin = {
	component: HiringRequestAdmin,
	subject: (d) => `New hiring request: ${d.company ?? "a business"}`,
	displayName: "Hiring request (staff)",
	to: "nachusim@gmail.com",
	previewData: {
		contactName: "Chidi Okeke",
		company: "Okeke Stores",
		projectTitle: "Online ordering website",
		phone: "+2348000000000",
		email: "chidi@example.com"
	}
};
var applicationReceived = {
	component: ApplicationReceived,
	subject: (d) => `Application received: ${d.roleTitle ?? "your role"}`,
	displayName: "Application received",
	previewData: {
		name: "Ada Obi",
		roleTitle: "Frontend Developer",
		company: "Tech Faculty"
	}
};
var newApplicationAdmin = {
	component: NewApplicationAdmin,
	subject: (d) => `New application: ${d.roleTitle ?? "role"}`,
	displayName: "New application (staff)",
	to: "nachusim@gmail.com",
	previewData: {
		talentName: "Ada Obi",
		roleTitle: "Frontend Developer",
		company: "Tech Faculty"
	}
};
var matchUpdate = {
	component: MatchUpdate,
	subject: (d) => `${(STATUS_COPY[d.status] ?? STATUS_COPY.approved).title}: ${d.roleTitle ?? "project"}`,
	displayName: "Match / selection update",
	previewData: {
		name: "Ada Obi",
		roleTitle: "Tech Faculty Store",
		company: "Tech Faculty",
		status: "accepted"
	}
};
var deliverableReviewed = {
	component: DeliverableReviewed,
	subject: (d) => d.status === "needs_changes" ? "Changes requested on your work log" : "Your work log was reviewed",
	displayName: "Work log reviewed",
	previewData: {
		name: "Ada Obi",
		title: "Product page UI",
		roleTitle: "Tech Faculty Store",
		status: "reviewed",
		note: "Great work."
	}
};
var talentApproved = {
	component: TalentApproved,
	subject: "You're an approved Tech Faculty talent",
	displayName: "Talent approved",
	previewData: {
		name: "Ada Obi",
		facultyId: "TF-WD-OL-0926-0001"
	}
};
var main$2 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container$2 = {
	padding: "28px 24px",
	maxWidth: "560px"
};
var brand$2 = {
	fontSize: "12px",
	letterSpacing: "2px",
	fontWeight: 700,
	color: "#000000",
	margin: "0 0 16px"
};
var h1$2 = {
	fontSize: "22px",
	fontWeight: 700,
	color: "#000000",
	margin: "0 0 16px"
};
var text$2 = {
	fontSize: "15px",
	lineHeight: "24px",
	color: "#333333",
	margin: "0 0 14px"
};
var muted$1 = {
	fontSize: "13px",
	lineHeight: "20px",
	color: "#777777",
	margin: "0 0 14px"
};
var quote$1 = {
	fontSize: "14px",
	lineHeight: "22px",
	color: "#333333",
	borderLeft: "3px solid #000000",
	paddingLeft: "12px",
	margin: "0 0 14px"
};
var button$2 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	padding: "12px 20px",
	borderRadius: "6px",
	fontSize: "14px",
	fontWeight: 600,
	textDecoration: "none",
	display: "inline-block",
	margin: "8px 0"
};
var hr$2 = {
	borderColor: "#eeeeee",
	margin: "28px 0 12px"
};
var footer$2 = {
	fontSize: "12px",
	color: "#999999",
	margin: 0
};
var HrMessage = ({ title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layout$1, {
	preview: title ?? "Update from Tech Faculty",
	title: title ?? "Update from Tech Faculty",
	children: (body ?? "").split(/\n{2,}/).map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
		style: {
			...text$2,
			whiteSpace: "pre-line"
		},
		children: para
	}, i))
});
var hrMessage = {
	component: HrMessage,
	subject: (d) => String(d.subject ?? "Update from Tech Faculty"),
	displayName: "HR automation message",
	previewData: {
		subject: "Interview invite: Frontend Developer",
		title: "Interview invite: Frontend Developer",
		body: "Hi Ada,\n\nPlease book a time here: https://cal.com/techfaculty"
	}
};
var SITE$1 = "https://techfaculty.ng";
var MorningDigest = ({ rows = [] }) => {
	const waiting = rows.filter((r) => r.count > 0);
	const total = waiting.reduce((n, r) => n + r.count, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "en",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `${total} thing${total === 1 ? "" : "s"} waiting in Tech Faculty admin` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: main$1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
					style: container$1,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: brand$1,
							children: "TECH FACULTY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							style: h1$1,
							children: "Needs you today"
						}),
						waiting.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
							style: text$1,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: r.count }),
								" ",
								r.label.toLowerCase(),
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: `${SITE$1}${r.path}`,
									style: link$1,
									children: "open"
								})
							]
						}, r.label)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							style: button$1,
							href: `${SITE$1}/admin`,
							children: "Open admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: footer$1,
							children: "Sent every morning when something is waiting. Nothing waiting, no email."
						})
					]
				})
			})
		]
	});
};
var adminMorningDigest = {
	component: MorningDigest,
	subject: (d) => {
		return `Needs you today: ${(d.rows ?? []).filter((r) => r.count > 0).reduce((n, r) => n + r.count, 0)} waiting in Tech Faculty admin`;
	},
	displayName: "Morning digest (staff)",
	to: "nachusim@gmail.com",
	previewData: { rows: [
		{
			label: "New leads",
			count: 3,
			path: "/admin/leads"
		},
		{
			label: "Payments to confirm",
			count: 2,
			path: "/admin/students"
		},
		{
			label: "Work awaiting review",
			count: 5,
			path: "/admin/students"
		},
		{
			label: "Talent requests",
			count: 0,
			path: "/admin/talent"
		}
	] }
};
var WeeklyReport = ({ done = [], todo = [] }) => {
	const line = (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
		style: text$1,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: r.count }),
			" ",
			r.label.toLowerCase(),
			r.detail ? ` (${r.detail})` : "",
			" · ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: `${SITE$1}${r.path}`,
				style: link$1,
				children: "open"
			})
		]
	}, r.label);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
		lang: "en",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Last week: ${done.length} kinds of work done, ${todo.length} still waiting` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
				style: main$1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
					style: container$1,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: brand$1,
							children: "TECH FACULTY"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							style: h1$1,
							children: "Weekly admin report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							as: "h2",
							style: h2,
							children: "Done in the last 7 days"
						}),
						done.length ? done.map(line) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: text$1,
							children: "Nothing recorded this week."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							as: "h2",
							style: h2,
							children: "Still to do"
						}),
						todo.length ? todo.map(line) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: text$1,
							children: "Nothing waiting. All clear."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							style: button$1,
							href: `${SITE$1}/admin`,
							children: "Open admin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$1 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							style: footer$1,
							children: "Sent every Monday morning. Matching, Slack invites and project channels run on their own; this lists what they did and what still needs a person."
						})
					]
				})
			})
		]
	});
};
var adminWeeklyReport = {
	component: WeeklyReport,
	subject: (d) => {
		const todo = (d.todo ?? []).reduce((n, r) => n + r.count, 0);
		return todo ? `Weekly admin report: ${todo} item${todo === 1 ? "" : "s"} still to do` : "Weekly admin report: all clear";
	},
	displayName: "Weekly admin report (staff)",
	to: "nachusim@gmail.com",
	previewData: {
		done: [
			{
				label: "Talent auto-matched to roles",
				count: 6,
				path: "/admin/talent"
			},
			{
				label: "Added to the Slack talent channel",
				count: 4,
				path: "/admin/talent"
			},
			{
				label: "Project Slack channels created",
				count: 2,
				path: "/admin/activity"
			}
		],
		todo: [{
			label: "Open roles without a WhatsApp group link",
			count: 2,
			path: "/admin/talent",
			detail: "Frontend Developer, Data Analyst"
		}, {
			label: "Talent profiles waiting for approval",
			count: 5,
			path: "/admin/talent"
		}]
	}
};
var OrderPaidAdmin = ({ name, email, phone, school, items, amount, notes, reference }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Paid online: ${items ?? "an order"}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main$1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container$1,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand$1,
						children: "TECH FACULTY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1$1,
						children: "New paid order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$1,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: items }),
							" · ",
							amount
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$1,
						children: [
							name,
							" · ",
							email,
							" · WhatsApp ",
							phone,
							school ? ` · ${school}` : ""
						]
					}),
					notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: text$1,
						children: notes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
						style: text$1,
						children: ["Flutterwave reference: ", reference]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						style: button$1,
						href: `${SITE$1}/admin/leads`,
						children: "Open paid orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr$1 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer$1,
						children: "Mark it fulfilled on /admin/leads once the letter, pickup or kit is sorted."
					})
				]
			})
		})
	]
});
var orderPaidAdmin = {
	component: OrderPaidAdmin,
	subject: (d) => `Paid online: ${d.items ?? "order"} (${d.amount ?? ""})`,
	displayName: "Online order paid (staff)",
	to: "nachusim@gmail.com",
	previewData: {
		name: "Ada Obi",
		email: "ada@example.com",
		phone: "08030000000",
		items: "Virtual SIWES placement",
		amount: "₦45,000",
		reference: "1234567"
	}
};
var main$1 = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container$1 = {
	padding: "28px 24px",
	maxWidth: "560px"
};
var brand$1 = {
	fontSize: "12px",
	letterSpacing: "2px",
	fontWeight: 700,
	color: "#000000",
	margin: "0 0 16px"
};
var h2 = {
	fontSize: "16px",
	fontWeight: 700,
	color: "#000000",
	margin: "20px 0 8px"
};
var h1$1 = {
	fontSize: "22px",
	fontWeight: 700,
	color: "#000000",
	margin: "0 0 16px"
};
var text$1 = {
	fontSize: "15px",
	lineHeight: "24px",
	color: "#333333",
	margin: "0 0 10px"
};
var link$1 = {
	color: "#000000",
	textDecoration: "underline"
};
var button$1 = {
	backgroundColor: "#000000",
	color: "#ffffff",
	padding: "12px 20px",
	borderRadius: "6px",
	fontSize: "14px",
	fontWeight: 600,
	textDecoration: "none",
	display: "inline-block",
	margin: "8px 0"
};
var hr$1 = {
	borderColor: "#eeeeee",
	margin: "28px 0 12px"
};
var footer$1 = {
	fontSize: "12px",
	color: "#999999",
	margin: 0
};
var SITE = "https://techfaculty.ng";
var WHATSAPP = "https://wa.me/2348068597140";
var Layout = ({ preview, title, children, cta, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "en",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: preview }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand,
						children: "TECH FACULTY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: h1,
						children: title
					}),
					children,
					cta && href && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						style: button,
						href,
						children: cta
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer,
						children: "Tech Faculty · Train, Certify and Employ"
					})
				]
			})
		})
	]
});
var hi = (name) => name ? `Hi ${name.split(" ")[0]},` : "Hi there,";
var StudentWelcome = ({ name, facultyId, programme, channel, slackUrl, learningMode }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: `Welcome to ${programme ?? "Tech Faculty"}`,
	title: "Welcome to Tech Faculty",
	cta: "Open your student dashboard",
	href: `${SITE}/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"You are enrolled in ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: programme ?? "your programme" }),
				learningMode ? ` (${learningMode})` : "",
				"."
			]
		}),
		facultyId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Your Faculty ID is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: facultyId }),
				". Keep it — you need it for classes, assignments and your certificate."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Your dashboard shows your next class, the topics to study, your class notes and where to submit each week's work."
		}),
		channel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Your class group on Slack is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["#", channel] }),
				". That is where class briefings, notes and questions live."
			]
		}),
		slackUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: slackUrl,
				style: link,
				children: "Join the Tech Faculty Slack"
			}), " with this same email address so we can add you to your class group automatically."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted,
			children: "Questions about payment, classes or your centre? Reply to this email or message us on WhatsApp."
		})
	]
});
var ClassUnlocked = ({ name, classTitle, programme, classNumber, date }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: `Next class: ${classTitle ?? "your next topic"}`,
	title: "Your next class is ready",
	cta: "Open your class",
	href: `${SITE}/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				classNumber ? `Class ${classNumber}` : "Your next class",
				" of ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: programme ?? "your programme" }),
				": ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: classTitle ?? "your next topic" }),
				date ? ` · ${date}` : "",
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Your notes, reading list and the assignment for this class are on your dashboard. Submit your work there when you are done so it counts toward your certificate."
		})
	]
});
var StudentWorkReviewed = ({ name, title, status, note, score, byAi }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: status === "needs_changes" ? "Changes requested on your assignment" : "Your assignment was reviewed",
	title: status === "needs_changes" ? "Changes requested" : "Assignment reviewed",
	cta: "See your progress",
	href: `${SITE}/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Your submission ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: title ?? "" }),
				" was ",
				status === "needs_changes" ? "returned for changes" : "reviewed and accepted",
				typeof score === "number" ? ` with a score of ${score}%` : "",
				"."
			]
		}),
		note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: quote,
			children: note
		}),
		byAi && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted,
			children: "This first review was written by the Tech Faculty AI tutor. Your tutor can still adjust it; if they do, you'll get another email."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted,
			children: "Every accepted submission moves you closer to your assessment and certificate."
		})
	]
});
var ClassReminder = ({ name, classTitle, courseName, when, durationMinutes }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: `Class reminder: ${classTitle ?? "your next class"}${when ? `, ${when}` : ""}`,
	title: "Your class is coming up",
	cta: "Open your dashboard",
	href: `${SITE}/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"A quick reminder: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: classTitle ?? "your next class" }),
				courseName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					" (",
					courseName,
					")"
				] }) : null,
				" starts ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: when ?? "soon" }),
				durationMinutes ? ` and runs about ${durationMinutes} minutes` : "",
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Your notes and the class link are on your dashboard. Please join on time."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: [
				"Can't make it? Reply to this email or ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: WHATSAPP,
					style: link,
					children: "message us on WhatsApp"
				}),
				"."
			]
		})
	]
});
var GraduateReviewRequest = ({ name, courseName, reviewUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Congratulations on your certificate",
	title: "Congratulations, graduate!",
	cta: "Leave a Google review",
	href: reviewUrl,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Your certificate",
				courseName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: courseName })] }) : null,
				" has been issued. Well done, you earned it."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Would you take a minute to tell others about your time at Tech Faculty NG? A short Google review helps the next student find us and decide with confidence."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted,
			children: "Thank you for learning with us. We are proud of you and glad to stay in touch."
		})
	]
});
var studentWelcome = {
	component: StudentWelcome,
	subject: (d) => `Welcome to ${d.programme ?? "Tech Faculty"} — your Faculty ID and class group`,
	displayName: "Student enrolment welcome",
	previewData: {
		name: "Ada Obi",
		facultyId: "TF-WEBDEV-ONL-0926-0001",
		programme: "AI for Full-Stack Web Development",
		channel: "course-ai-web-dev",
		slackUrl: "https://tech-faculty.slack.com",
		learningMode: "Hybrid Mode"
	}
};
var classUnlocked = {
	component: ClassUnlocked,
	subject: (d) => `Next class: ${d.classTitle ?? "your next topic"}`,
	displayName: "Next class unlocked",
	previewData: {
		name: "Ada Obi",
		classTitle: "Building APIs with AI assistance",
		programme: "AI for Full-Stack Web Development",
		classNumber: 3,
		date: "12 October 2026"
	}
};
var studentWorkReviewed = {
	component: StudentWorkReviewed,
	subject: (d) => d.status === "needs_changes" ? "Changes requested on your assignment" : "Your assignment was reviewed",
	displayName: "Student assignment reviewed",
	previewData: {
		name: "Ada Obi",
		title: "Week 3 project",
		status: "reviewed",
		note: "Clean work — add tests next time.",
		score: 82
	}
};
var classReminder = {
	component: ClassReminder,
	subject: (d) => `Reminder: ${d.classTitle ?? "your class"}${d.when ? `, ${d.when}` : ""}`,
	displayName: "Class reminder",
	previewData: {
		name: "Ada Obi",
		classTitle: "Building APIs with AI assistance",
		courseName: "Fullstack Web Development",
		when: "today, Thursday 29 October at 4:00 pm (Lagos time)",
		durationMinutes: 90
	}
};
var graduateReviewRequest = {
	component: GraduateReviewRequest,
	subject: "Congratulations! Would you review Tech Faculty NG?",
	displayName: "Graduate Google review request",
	previewData: {
		name: "Ada Obi",
		courseName: "Fullstack Web Development",
		reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJ5ZxSzmi9QxAR23OzR7YbAkM"
	}
};
var CertificateIssued = ({ name, courseName, certificateNumber, verifyUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Your certificate has been issued",
	title: "Your certificate is ready",
	cta: "View and verify your certificate",
	href: verifyUrl ?? `${SITE}/verify`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Congratulations! You completed ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: courseName ?? "your course" }),
				" and your Tech Faculty NG certificate has been issued."
			]
		}),
		certificateNumber && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Your certificate number is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: certificateNumber }),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Anyone, such as an employer or your school, can confirm it is genuine at the link below. Add it to your CV and LinkedIn profile."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: [
				"You can also see your certificate on your ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `${SITE}/dashboard`,
					style: link,
					children: "student dashboard"
				}),
				". Spot a mistake in your name? Reply to this email and we will correct it."
			]
		})
	]
});
var certificateIssued = {
	component: CertificateIssued,
	subject: (d) => `Your certificate for ${d.courseName ?? "your course"} is ready`,
	displayName: "Certificate issued (automatic)",
	previewData: {
		name: "Ada Obi",
		courseName: "Fullstack Web Development",
		certificateNumber: "TF-CERT-20261029-K7P2QX",
		verifyUrl: "https://techfaculty.ng/verify/TF-CERT-20261029-K7P2QX"
	}
};
var CheckoutReminder = ({ name, plan, amount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Your Tech Faculty enrolment is waiting for payment",
	title: "Finish your enrolment",
	cta: "Finish enrolling",
	href: `${SITE}/#pricing`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"You started enrolling in the ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
				" plan",
				amount ? ` (${amount})` : "",
				", but the card payment was not completed, so your place is not confirmed yet."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Choose your plan again and pay to unlock your classes and class group."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: muted,
			children: "Already paid? You don't need to do anything. We check card payments with Flutterwave automatically and will email you once yours is confirmed."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: [
				"Card declined, or prefer to pay by bank transfer? ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: WHATSAPP,
					style: link,
					children: "Message us on WhatsApp"
				}),
				" and we will help you finish."
			]
		})
	]
});
var PaymentConfirmed = ({ name, plan, facultyId }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Your payment is confirmed",
	title: "Your payment is confirmed",
	cta: "Open your student dashboard",
	href: `${SITE}/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Flutterwave has confirmed your payment for the ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
				" plan, so your enrolment is now active."
			]
		}),
		facultyId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Your Faculty ID is ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: facultyId }),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Open your dashboard to see your classes. Your class group opens the first time you visit it."
		})
	]
});
var PayLink = ({ name, plan, amount, payUrl, cancelOn, reminder }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: reminder ? "Your place is still waiting for payment" : "Pay for your Tech Faculty plan online",
	title: reminder ? "Your place is still waiting" : "Pay for your plan online",
	cta: `Pay ${amount ?? "now"}`,
	href: payUrl ?? `${SITE}/#pricing`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: reminder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Your enrolment in the ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
				" plan is not paid yet, so your classes are still locked."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Thanks for choosing the ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
				" plan. To save you waiting for bank details, you can pay",
				amount ? ` ${amount}` : "",
				" online now with this secure Flutterwave link: card, bank transfer or USSD."
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "Your classes and class group open as soon as the payment goes through."
		}),
		cancelOn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: [
				"If it isn't paid by ",
				cancelOn,
				", we'll cancel the request and the link will stop working. You can always enrol again."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: [
				"Already paid by bank transfer? You don't need to do anything: we'll confirm it. Questions? ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: WHATSAPP,
					style: link,
					children: "Message us on WhatsApp"
				}),
				"."
			]
		})
	]
});
var PayLinkCancelled = ({ name, plan }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Your enrolment request was cancelled",
	title: "Your enrolment request was cancelled",
	cta: "Choose a plan",
	href: `${SITE}/#pricing`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"We didn't receive payment for the ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
				" plan within 14 days, so we've cancelled the request and its pay link."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: "You're welcome back any time: choose your plan again when you're ready."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: [
				"Paid and think this is a mistake? ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: WHATSAPP,
					style: link,
					children: "Message us on WhatsApp"
				}),
				" with your payment receipt and we'll sort it out."
			]
		})
	]
});
var OrderConfirmed = ({ name, amount, reference, steps = [], downloadUrl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Your payment is confirmed",
	title: "Your payment is confirmed",
	cta: downloadUrl ? "Download the SIWES Success Kit" : "Message us on WhatsApp",
	href: downloadUrl ?? WHATSAPP,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Flutterwave has confirmed your payment",
				amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: amount })] }) : null,
				". This email is your receipt."
			]
		}),
		steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [s.item, "."] }),
				" ",
				s.next
			]
		}, s.item)),
		reference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: ["Payment reference: ", reference]
		})
	]
});
var checkoutReminder = {
	component: CheckoutReminder,
	subject: "Finish your Tech Faculty enrolment",
	displayName: "Unfinished checkout reminder",
	previewData: {
		name: "Ada Obi",
		plan: "Developer Pro",
		amount: "₦100,000"
	}
};
var paymentConfirmed = {
	component: PaymentConfirmed,
	subject: (d) => `Payment confirmed: you're enrolled in ${d.plan ?? "Tech Faculty"}`,
	displayName: "Card payment confirmed later",
	previewData: {
		name: "Ada Obi",
		plan: "Developer Pro",
		facultyId: "TF-WEBDEV-ONL-0926-0001"
	}
};
var orderConfirmed = {
	component: OrderConfirmed,
	subject: "Payment confirmed: your Tech Faculty NG order",
	displayName: "Online order receipt",
	previewData: {
		name: "Ada Obi",
		amount: "₦45,000",
		reference: "TFO-0000",
		steps: [{
			item: "Virtual SIWES placement",
			next: "A coordinator contacts you on WhatsApp within one working day."
		}]
	}
};
var BALANCE_COPY = {
	due_soon: {
		title: "Your balance is due soon",
		preview: "Your Tech Faculty balance is due in a week",
		lead: "is due by"
	},
	due_tomorrow: {
		title: "Your balance is due tomorrow",
		preview: "Your Tech Faculty balance is due tomorrow",
		lead: "is due by"
	},
	overdue: {
		title: "Your balance is overdue",
		preview: "Your Tech Faculty balance is overdue",
		lead: "was due by"
	}
};
var BalanceReminder = ({ name, plan, amount, dueDate, stage, payUrl }) => {
	const copy = BALANCE_COPY[stage ?? "due_soon"] ?? BALANCE_COPY.due_soon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
		preview: copy.preview,
		title: copy.title,
		cta: amount ? `Pay ${amount} now` : "Pay your balance",
		href: payUrl ?? `${SITE}/dashboard`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				style: text,
				children: hi(name)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
				style: text,
				children: [
					"The balance of your ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
					" instalment plan",
					amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" (",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: amount }),
						")"
					] }) : null,
					" ",
					copy.lead,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: dueDate ?? "the due date" }),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				style: text,
				children: "Use the button below to pay by card or bank transfer through Flutterwave. You don't need to sign in, and your plan is marked paid automatically."
			}),
			stage === "overdue" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
				style: text,
				children: "Your classes stay open. Please pay as soon as you can, or reply to tell us when you will."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
				style: muted,
				children: [
					"Already paid by bank transfer or cash? Reply with your receipt and we will update your plan. Need more time? ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: WHATSAPP,
						style: link,
						children: "Message us on WhatsApp"
					}),
					"."
				]
			})
		]
	});
};
var BalancePaid = ({ name, plan, amount, reference }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Layout, {
	preview: "Your balance is paid",
	title: "Your plan is fully paid",
	cta: "Open your student dashboard",
	href: `${SITE}/dashboard`,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			style: text,
			children: hi(name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: text,
			children: [
				"Flutterwave has confirmed your payment",
				amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: amount })] }) : null,
				", so your ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: plan ?? "Tech Faculty" }),
				" plan is now fully paid. This email is your receipt."
			]
		}),
		reference && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
			style: muted,
			children: ["Payment reference: ", reference]
		})
	]
});
var balanceReminder = {
	component: BalanceReminder,
	subject: (d) => `${(BALANCE_COPY[d.stage] ?? BALANCE_COPY.due_soon).title}${d.amount ? `: ${d.amount}` : ""}`,
	displayName: "Instalment balance reminder (7 days before, day before, overdue)",
	previewData: {
		name: "Ada Obi",
		plan: "Developer Pro",
		amount: "₦50,000",
		dueDate: "20 November 2026",
		stage: "due_soon",
		payUrl: "https://techfaculty.ng/pay-balance?t=00000000-0000-0000-0000-000000000000"
	}
};
var balancePaid = {
	component: BalancePaid,
	subject: "Payment confirmed: your Tech Faculty plan is fully paid",
	displayName: "Instalment balance paid online",
	previewData: {
		name: "Ada Obi",
		plan: "Developer Pro",
		amount: "₦50,000",
		reference: "123456789"
	}
};
var payLink = {
	component: PayLink,
	subject: (d) => d.reminder ? `Reminder: pay for your ${d.plan ?? "Tech Faculty"} plan` : `Pay for your ${d.plan ?? "Tech Faculty"} plan online`,
	displayName: "Pay link for a WhatsApp / bank request (and 2-day reminder)",
	previewData: {
		name: "Ada Obi",
		plan: "Developer Pro",
		amount: "₦100,000",
		payUrl: "https://checkout.flutterwave.com/v3/hosted/pay/example",
		cancelOn: "12 November"
	}
};
var payLinkCancelled = {
	component: PayLinkCancelled,
	subject: "Your Tech Faculty enrolment request was cancelled",
	displayName: "WhatsApp / bank request cancelled after 14 days",
	previewData: {
		name: "Ada Obi",
		plan: "Developer Pro"
	}
};
var main = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container = {
	padding: "28px 24px",
	maxWidth: "560px"
};
var brand = {
	fontSize: "12px",
	letterSpacing: "2px",
	fontWeight: 700,
	color: "#000000",
	margin: "0 0 16px"
};
var h1 = {
	fontSize: "22px",
	fontWeight: 700,
	color: "#000000",
	margin: "0 0 16px"
};
var text = {
	fontSize: "15px",
	lineHeight: "24px",
	color: "#333333",
	margin: "0 0 14px"
};
var muted = {
	fontSize: "13px",
	lineHeight: "20px",
	color: "#777777",
	margin: "0 0 14px"
};
var quote = {
	fontSize: "14px",
	lineHeight: "22px",
	color: "#333333",
	borderLeft: "3px solid #000000",
	paddingLeft: "12px",
	margin: "0 0 14px"
};
var link = {
	color: "#000000",
	textDecoration: "underline"
};
var button = {
	backgroundColor: "#000000",
	color: "#ffffff",
	padding: "12px 20px",
	borderRadius: "6px",
	fontSize: "14px",
	fontWeight: 600,
	textDecoration: "none",
	display: "inline-block",
	margin: "8px 0"
};
var hr = {
	borderColor: "#eeeeee",
	margin: "28px 0 12px"
};
var footer = {
	fontSize: "12px",
	color: "#999999",
	margin: 0
};
/**
* Template registry — maps template names to their React Email components.
* Import and register new templates here after creating them in this directory.
*
* Example:
*   import { template as welcomeTemplate } from './welcome'
*   // then add to TEMPLATES: 'welcome': welcomeTemplate
*/
var TEMPLATES = {
	"application-received": applicationReceived,
	"new-application-admin": newApplicationAdmin,
	"match-update": matchUpdate,
	"deliverable-reviewed": deliverableReviewed,
	"talent-approved": talentApproved,
	"profile-submitted": profileSubmitted,
	"intro-request-received": introRequestReceived,
	"intro-request-admin": introRequestAdmin,
	"intro-approved": introApproved,
	"hiring-request-received": hiringRequestReceived,
	"hiring-request-admin": hiringRequestAdmin,
	"hr-message": hrMessage,
	"student-welcome": studentWelcome,
	"class-unlocked": classUnlocked,
	"class-reminder": classReminder,
	"student-work-reviewed": studentWorkReviewed,
	"graduate-review-request": graduateReviewRequest,
	"certificate-issued": certificateIssued,
	"admin-morning-digest": adminMorningDigest,
	"admin-weekly-report": adminWeeklyReport,
	"checkout-reminder": checkoutReminder,
	"payment-confirmed": paymentConfirmed,
	"order-confirmed": orderConfirmed,
	"pay-link": payLink,
	"pay-link-cancelled": payLinkCancelled,
	"order-paid-admin": orderPaidAdmin,
	"balance-reminder": balanceReminder,
	"balance-paid": balancePaid
};
//#endregion
export { TEMPLATES as t };
