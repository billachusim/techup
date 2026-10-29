import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { in as ArrowRight, tt as Linkedin } from "../_libs/lucide-react.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/GraduateStories-Dcn_GfqR.js
var import_jsx_runtime = require_jsx_runtime();
var GOOGLE_PLACE_ID = "ChIJ5ZxSzmi9QxAR23OzR7YbAkM";
var GOOGLE_RATING = {
	rating: 4.9,
	count: 90,
	checked: "October 2026"
};
/** Opens the Google Maps listing on its reviews. */
var GOOGLE_REVIEWS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;
/** Opens Google's "write a review" box for the listing. */
var GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
var googleReviews = [
	{
		name: "Onah Emmanuella",
		context: "Data Analytics scholarship",
		text: "My Experience at Nnewi Tech Faculty was Awesome. Was offered a scholarship to learn Data Analytics. This opportunity was a game-changer for me, equipping me with valuable skills and knowledge in a field that's in high demand."
	},
	{
		name: "Odoh Nchedo",
		context: "Website Development and Product Design",
		text: "I'm here at Nnewi Tech Hub in Anambra as someone who finished secondary school and waiting for university. I'm happy I can learn Website Development and Product Design here while waiting one year for university admission. Happy to learn tech skills in Nnewi without traveling to Lagos or anywhere else."
	},
	{
		name: "Isreal Sunday",
		text: "Nnewi Tech Faculty is a great place for learning and growth. The team is professional, supportive, and always ready to guide you. The environment is friendly and motivating, I'd definitely recommend them to anyone interested in tech and innovation."
	},
	{
		name: "Stephanie Chinazom",
		context: "UI/UX Design",
		text: "This place is actually so fantastic with a lot of things to learn and a very patient tutor to make learning tech easy and enjoyable."
	},
	{
		name: "Queen Obiji",
		context: "Data Science and Analysis",
		text: "Nnewi Tech Faculty is a very good place to Learn tech skills. The environment is very conducive."
	},
	{
		name: "Chidimma Chianumba",
		text: "They gave me the platform to unlearn and learn in my tech journey alongside connecting with great tech sisturssss"
	}
];
var graduateStories = [];
var StoryCard = ({ story }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
	className: "bg-card border-border h-full",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-6 flex flex-col gap-4 h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [story.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: story.photo,
					alt: story.name,
					width: 56,
					height: 56,
					loading: "lazy",
					className: "w-14 h-14 rounded-full object-cover shrink-0"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-bold text-primary-foreground",
						children: story.name.charAt(0)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: story.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						story.course,
						story.campus ? `, ${story.campus}` : "",
						" · ",
						story.graduated
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: story.before
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						size: 14,
						className: "text-primary shrink-0",
						"aria-label": "now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold",
						children: [story.now, story.company ? ` at ${story.company}` : ""]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
				className: "text-muted-foreground leading-relaxed flex-1",
				children: [
					"“",
					story.quote,
					"”"
				]
			}),
			story.linkedin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: story.linkedin,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "inline-flex items-center gap-1 text-sm text-primary hover:underline",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {
						size: 14,
						"aria-hidden": "true"
					}),
					" ",
					story.name,
					" on LinkedIn"
				]
			})
		]
	})
});
var GraduateStories = ({ limit, className = "py-16 px-4" }) => {
	const stories = limit ? graduateStories.slice(0, limit) : graduateStories;
	if (stories.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "graduate-stories",
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-10 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-4xl font-bold",
					children: "Graduate stories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground max-w-2xl mx-auto",
					children: "Where some of our graduates started, and where they are now, in their own words."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
				children: stories.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { story }, story.name))
			})]
		})
	});
};
//#endregion
export { googleReviews as a, GraduateStories as i, GOOGLE_REVIEWS_URL as n, GOOGLE_WRITE_REVIEW_URL as r, GOOGLE_RATING as t };
