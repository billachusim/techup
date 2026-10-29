import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useParams$1, n as Navigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { n as campuses } from "./campuses-DtkbL75I.mjs";
import { C as Sparkles, Mt as Clock, Wt as Calendar, an as ArrowLeft, ct as Heart, ht as FileText, in as ArrowRight, k as Share2, nt as Link, p as Twitter, q as MessageCircle, tt as Linkedin } from "../_libs/lucide-react.mjs";
import { a as Footer, i as DropdownMenuTrigger, n as DropdownMenuContent, o as Header, r as DropdownMenuItem, t as DropdownMenu } from "./Footer-BKqEypqK.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { n as formatNaira, t as SUCCESS_KIT } from "./successKit-Ca2aXOxu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as getCategoryByName } from "./blogCategories-DJ3ikanU.mjs";
import { n as articleOgImage } from "./og-image-DZ-4tmP2.mjs";
import { n as BLOG_AUTHOR, r as authorSchema } from "./author-DxxB3mAx.mjs";
import { t as LeadCaptureForm } from "./LeadCaptureForm-CYmnefhx.mjs";
import { t as VirtualSiwesOffer } from "./VirtualSiwesOffer-CCEytK5u.mjs";
import { a as getPostLinks, n as getCityGuideForCity, o as isCityGuide } from "./internalLinks-CcRpzT8J.mjs";
import { t as useAllBlogPosts } from "./useBlogPostsData-CG3KP4TR.mjs";
import { n as formatDate } from "./LastUpdated-DLGRZy9q.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/blog._slug-yM6ViITy.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var getVisitorId = () => {
	const key = "tf_visitor_id";
	let id = localStorage.getItem(key);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(key, id);
	}
	return id;
};
var BlogActions = ({ slug, title, description }) => {
	const [count, setCount] = (0, import_react.useState)(0);
	const [liked, setLiked] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const url = `https://techfaculty.ng/blog/${slug}`;
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const visitorId = getVisitorId();
			const { count: c } = await supabase.from("blog_post_likes").select("*", {
				count: "exact",
				head: true
			}).eq("post_slug", slug);
			if (!cancelled && typeof c === "number") setCount(c);
			const { data } = await supabase.from("blog_post_likes").select("id").eq("post_slug", slug).eq("visitor_id", visitorId).maybeSingle();
			if (!cancelled) setLiked(!!data);
		})();
		return () => {
			cancelled = true;
		};
	}, [slug]);
	const toggleLike = async () => {
		if (busy) return;
		setBusy(true);
		const visitorId = getVisitorId();
		const { data: userRes } = await supabase.auth.getUser();
		const userId = userRes.user?.id ?? null;
		if (liked) {
			setLiked(false);
			setCount((c) => Math.max(0, c - 1));
			const { error } = await supabase.from("blog_post_likes").delete().eq("post_slug", slug).eq("visitor_id", visitorId);
			if (error) {
				setLiked(true);
				setCount((c) => c + 1);
				toast.error("Couldn't remove like");
			}
		} else {
			setLiked(true);
			setCount((c) => c + 1);
			const { error } = await supabase.from("blog_post_likes").insert({
				post_slug: slug,
				visitor_id: visitorId,
				user_id: userId
			});
			if (error) {
				setLiked(false);
				setCount((c) => Math.max(0, c - 1));
				if (!error.message.toLowerCase().includes("duplicate")) toast.error("Couldn't save like");
			}
		}
		setBusy(false);
	};
	const nativeShare = async () => {
		if (typeof navigator !== "undefined" && "share" in navigator) try {
			await navigator.share({
				title,
				text: description,
				url
			});
			return true;
		} catch {
			return true;
		}
		return false;
	};
	const shareWhatsApp = () => {
		const text = encodeURIComponent(`${title}\n${url}`);
		window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
	};
	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied");
		} catch {
			toast.error("Couldn't copy link");
		}
	};
	const handleShareClick = async () => {
		if (!await nativeShare()) {}
	};
	const hasNativeShare = typeof navigator !== "undefined" && "share" in navigator;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 my-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: liked ? "default" : "outline",
			size: "sm",
			onClick: toggleLike,
			disabled: busy,
			"aria-pressed": liked,
			"aria-label": liked ? "Unlike article" : "Like article",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
					size: 16,
					className: "mr-1.5",
					fill: liked ? "currentColor" : "none"
				}),
				liked ? "Liked" : "Like",
				count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-1.5 text-xs opacity-80",
					children: count
				})
			]
		}), hasNativeShare ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			size: "sm",
			onClick: handleShareClick,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
				size: 16,
				className: "mr-1.5"
			}), " Share"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {
					size: 16,
					className: "mr-1.5"
				}), " Share"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: shareWhatsApp,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
					size: 16,
					className: "mr-2"
				}), " Share on WhatsApp"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: copyLink,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					size: 16,
					className: "mr-2"
				}), " Copy link"]
			})]
		})] })]
	});
};
var SuccessKitCTA = ({ source, variant = "capture" }) => {
	if (variant === "inline") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "not-prose my-10 rounded-lg border border-border bg-muted/40 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
				size: 18,
				className: "mt-0.5 text-primary shrink-0"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold leading-snug",
				children: "Doing SIWES this session? Get the free 7-step placement checklist."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: [
					"Plus the full ",
					SUCCESS_KIT.name,
					" — templates, logbook pack and report outline — from",
					" ",
					formatNaira(SUCCESS_KIT.priceNGN),
					"."
				]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 sm:mt-0 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
					to: "/siwes-success-kit",
					children: ["See the kit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
						size: 14,
						className: "ml-1.5"
					})]
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "not-prose my-12 rounded-xl border border-border bg-card p-6 md:p-8",
		"aria-labelledby": `kit-cta-${source}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
					size: 16,
					className: "text-primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-wide text-primary",
					children: "Free download"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: `kit-cta-${source}`,
				className: "text-xl md:text-2xl font-bold mb-2",
				children: "Get the free SIWES placement checklist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mb-6 max-w-2xl",
				children: "The 7 steps our placed students follow — from confirming your course is ITF-approved to registering your placement before Day 1. Choose email or WhatsApp, whichever you actually check."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadCaptureForm, {
				interest: "free_checklist",
				source: `blog:${source}`,
				submitLabel: "Send me the checklist",
				whatsappMessage: "Hello Tech Faculty, I requested the free SIWES placement checklist from your blog."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Want the full templates, logbook pack and report outline?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: "/siwes-success-kit",
						children: [
							"View the ",
							SUCCESS_KIT.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								size: 14,
								className: "ml-1.5"
							})
						]
					})
				})]
			})
		]
	});
};
var linkClass = "text-primary hover:underline";
/** "a", "a and b", "a, b and c" for a list of nodes. */
var joinNodes = (nodes) => nodes.map((node, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [i > 0 && (i === nodes.length - 1 ? " and " : ", "), node] }, i));
/** In-article links from a blog post to the departments, campuses and SIWES pages it relates to. */
var PostInternalLinks = ({ post }) => {
	if (isCityGuide(post.slug)) return null;
	const links = getPostLinks(post);
	const cityGuides = links.campuses.map((c) => getCityGuideForCity(c.city)).filter((g) => Boolean(g) && g.slug !== post.slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12 border-t border-border pt-8",
		"aria-labelledby": "learn-this-heading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: "learn-this-heading",
			className: "text-2xl font-bold mb-4",
			children: "Where to learn this at Tech Faculty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 text-muted-foreground leading-relaxed",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: links.departments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Tech Faculty teaches this in",
					" ",
					joinNodes(links.departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: `/departments/${d.slug}`,
						className: linkClass,
						children: [
							"the ",
							d.title,
							" programme"
						]
					}, d.slug))),
					", online, hybrid or in person. You can also",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/departments",
						className: linkClass,
						children: "compare all Tech Faculty departments"
					}),
					"."
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Compare",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/departments",
						className: linkClass,
						children: "every Tech Faculty department"
					}),
					" ",
					"to find the course that fits, online, hybrid or in person."
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: links.campuses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"You can study in person at",
					" ",
					joinNodes(links.campuses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: `/locations/${c.slug}`,
						className: linkClass,
						children: ["the Tech Faculty campus in ", c.city]
					}, c.slug))),
					", or",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/locations",
						className: linkClass,
						children: "find a Tech Faculty campus near you"
					}),
					".",
					cityGuides.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" ",
						"For the wider local picture, read",
						" ",
						joinNodes(cityGuides.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
							to: `/blog/${g.slug}`,
							className: linkClass,
							children: [
								"our guide to the ",
								g.city,
								" tech scene"
							]
						}, g.slug))),
						"."
					] })
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Classes also run in person at",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: "/locations",
						className: linkClass,
						children: [
							"Tech Faculty campuses in ",
							campuses.length,
							" cities across Nigeria"
						]
					}),
					"."
				] }) }),
				links.siwes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Students on industrial training can do their",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/siwes",
						className: linkClass,
						children: "tech SIWES placement at Tech Faculty"
					}),
					", or apply for",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/virtual-siwes",
						className: linkClass,
						children: "Virtual SIWES with logbook signing"
					}),
					" ",
					"if they cannot attend in person. See",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
						to: "/siwes/courses",
						className: linkClass,
						children: "SIWES placements by course of study"
					}),
					" ",
					"for what the work looks like for your course."
				] })
			]
		})]
	});
};
/** Markdown to plain text for schema answers: keeps link text, drops formatting. */
var plain = (markdown) => markdown.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
/**
* The questions and answers in a post's "## Frequently asked questions" (or
* "## FAQ") section, where each question is a "### " heading and the answer is
* the text under it. Used for the post's FAQPage markup.
*/
function extractFaq(markdown) {
	const section = markdown.match(/^##\s+(?:Frequently asked questions|FAQs?)\b[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/im);
	if (!section) return [];
	return [...section[1].matchAll(/^###\s+(.+)\n([\s\S]*?)(?=^###\s|(?![\s\S]))/gm)].map((m) => ({
		question: plain(m[1]),
		answer: plain(m[2])
	})).filter((item) => item.question && item.answer);
}
var headingText = (children) => Array.isArray(children) ? children.map(headingText).join("") : typeof children === "string" || typeof children === "number" ? String(children) : children && typeof children === "object" && "props" in children ? headingText(children.props.children) : "";
var slugify = (text) => text.toLowerCase().replace(/[*_`[\]()]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** "## " headings in the post, for the table of contents. */
var tocItems = (markdown) => [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => {
	const text = m[1].replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
	return {
		text,
		id: slugify(text)
	};
});
var markdownComponents = {
	h1: ({ node, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		id: slugify(headingText(children)),
		className: "scroll-mt-24",
		...props,
		children
	}),
	h2: ({ node, children, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		id: slugify(headingText(children)),
		className: "scroll-mt-24",
		...props,
		children
	}),
	table: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "not-prose my-8 w-full overflow-x-auto rounded-md border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: "w-full min-w-[480px] border-collapse text-sm",
			...props
		})
	}),
	th: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "border-b border-border bg-muted px-3 py-2 text-left font-semibold text-foreground",
		...props
	}),
	td: ({ node, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: "border-b border-border px-3 py-2 align-top text-muted-foreground",
		...props
	})
};
/**
* Splits markdown just before the "## " heading nearest its middle, so an
* offer can sit between sections. Returns [content, ""] when there is no
* heading past the first one, or it is inside a code fence.
*/
var splitAtMiddleHeading = (content) => {
	const starts = [];
	let inFence = false;
	let offset = 0;
	for (const line of content.split("\n")) {
		if (line.startsWith("```")) inFence = !inFence;
		else if (!inFence && /^## /.test(line)) starts.push(offset);
		offset += line.length + 1;
	}
	const candidates = starts.slice(1);
	if (candidates.length === 0) return [content, ""];
	const middle = content.length / 2;
	const at = candidates.reduce((best, s) => Math.abs(s - middle) < Math.abs(best - middle) ? s : best);
	return [content.slice(0, at), content.slice(at)];
};
var BlogPost = () => {
	const { slug } = useParams$1();
	const { posts, isLoading } = useAllBlogPosts();
	const post = slug ? posts.find((p) => p.slug === slug) : void 0;
	if (!post) {
		if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-32 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-3xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-2/3 rounded bg-muted animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-full rounded bg-muted animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-5/6 rounded bg-muted animate-pulse" })
					]
				})
			})]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate$1, {
			to: "/blog",
			replace: true
		});
	}
	const relatedPosts = posts.filter((p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag))).slice(0, 2);
	const category = getCategoryByName(post.tags[0]);
	const modified = post.updated ?? post.date;
	const showUpdated = modified.slice(0, 10) > post.date.slice(0, 10);
	const isSiwesPost = /siwes|internship|industrial training|\bIT placement\b/i.test(`${post.slug} ${post.title} ${post.tags.join(" ")}`);
	const isVirtualSiwesPost = /siwes|industrial training|\bIT placement\b/i.test(`${post.slug} ${post.title} ${post.tags.join(" ")}`);
	const body = post.content.replace(/^\s*\*By [^*\n]+\*[ \t]*\n?/m, "");
	const faq = extractFaq(body);
	const [firstHalf, secondHalf] = isVirtualSiwesPost ? splitAtMiddleHeading(body) : [body, ""];
	const proseClass = "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:mb-6 prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-ul:mb-6 prose-ol:mb-6 prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline prose-hr:my-8";
	const renderMarkdown = (markdown) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: proseClass,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
			remarkPlugins: [remarkGfm],
			components: markdownComponents,
			children: markdown
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: post.title,
					description: post.description,
					datePublished: post.date,
					dateModified: modified,
					image: [articleOgImage(post)],
					author: authorSchema,
					publisher: {
						"@type": "Organization",
						name: "Tech Faculty NG",
						url: "https://techfaculty.ng"
					},
					url: `https://techfaculty.ng/blog/${post.slug}`,
					keywords: post.tags.join(", "),
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": `https://techfaculty.ng/blog/${post.slug}`
					}
				})
			}), faq.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: faq.map((item) => ({
						"@type": "Question",
						name: item.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: item.answer
						}
					}))
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "py-16 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: "/blog",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "mb-6 -ml-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
										size: 16,
										className: "mr-1"
									}), " Back to Blog"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 mb-4",
								children: [
									category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: `/blog/category/${category.slug}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "hover:bg-secondary/80",
											children: post.tags[0]
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: post.tags[0]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-muted-foreground flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { size: 14 }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
												dateTime: post.date,
												children: formatDate(post.date)
											})
										]
									}),
									showUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-muted-foreground",
										children: ["Last updated ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
											dateTime: modified,
											children: formatDate(modified)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-muted-foreground flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { size: 14 }),
											" ",
											post.readTime,
											" min read"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl md:text-4xl font-bold mb-4",
								children: post.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"By ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: BLOG_AUTHOR.path,
											rel: "author",
											className: "font-medium text-foreground hover:underline",
											children: BLOG_AUTHOR.name
										}),
										", ",
										BLOG_AUTHOR.role
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: BLOG_AUTHOR.linkedin,
										target: "_blank",
										rel: "author noopener",
										"aria-label": "Bill Achusim on LinkedIn",
										className: "hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { size: 15 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: BLOG_AUTHOR.x,
										target: "_blank",
										rel: "author noopener",
										"aria-label": "Bill Achusim on X",
										className: "hover:text-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { size: 15 })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogActions, {
								slug: post.slug,
								title: post.title,
								description: post.description
							}),
							isSiwesPost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessKitCTA, {
								source: post.slug,
								variant: "inline"
							}),
							tocItems(body).length >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								"aria-label": "Table of contents",
								className: "my-8 rounded-lg border border-border bg-muted/40 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 font-semibold text-foreground",
									children: "In this guide"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "list-decimal space-y-1.5 pl-5 text-sm",
									children: tocItems(body).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `#${item.id}`,
										className: "text-muted-foreground hover:text-primary hover:underline",
										children: item.text
									}) }, item.id))
								})]
							}),
							renderMarkdown(firstHalf),
							secondHalf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualSiwesOffer, {
								source: post.slug,
								variant: "inline"
							}), renderMarkdown(secondHalf)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostInternalLinks, { post }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 rounded-lg border border-border p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Written by"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: BLOG_AUTHOR.path,
											rel: "author",
											className: "hover:underline",
											children: BLOG_AUTHOR.name
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted-foreground mb-3",
										children: [BLOG_AUTHOR.role, ". Building Africa's remote and physical tech workforce."]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-sm text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: BLOG_AUTHOR.linkedin,
											target: "_blank",
											rel: "author noopener",
											"aria-label": "Bill Achusim on LinkedIn",
											className: "hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { size: 15 })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: BLOG_AUTHOR.x,
											target: "_blank",
											rel: "author noopener",
											"aria-label": "Bill Achusim on X",
											className: "hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { size: 15 })
										})]
									})
								]
							}),
							isVirtualSiwesPost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VirtualSiwesOffer, {
								source: post.slug,
								variant: "full"
							}),
							isSiwesPost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessKitCTA, {
								source: post.slug,
								variant: "capture"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlogActions, {
								slug: post.slug,
								title: post.title,
								description: post.description
							})
						]
					})
				}), relatedPosts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-12 px-4 bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-3xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold mb-6",
							children: "More Articles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: relatedPosts.map((rp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
								to: `/blog/${rp.slug}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-lg border border-border hover:border-primary/50 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-xs mb-2",
											children: rp.tags[0]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-sm mb-1",
											children: rp.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [rp.readTime, " min read"]
										})
									]
								})
							}, rp.slug))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = BlogPost;
//#endregion
export { SplitComponent as component };
