import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as useNavigate$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { i as useUser } from "./UserContext-uFGsrvio.mjs";
import { $ as LoaderCircle, Dt as Copy, Ft as CircleCheck, Lt as CircleAlert, Mt as Clock, P as RefreshCw, Qt as BookOpen, St as Download, Wt as Calendar, Y as MapPin, Z as LogOut, a as Wallet, bt as ExternalLink, f as Upload, ft as Globe, ht as FileText, k as Share2, n as Youtube, nn as Award, pt as Gift, q as MessageCircle, s as Users, tn as BadgeCheck, ut as Hash } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header, s as tech_faculty_logo_default } from "./Footer-BKqEypqK.mjs";
import { t as fmsti_logo_default } from "./fmsti-logo-CyQYTmKO.mjs";
import { n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { n as lagosToday, t as formatDay } from "./dates-Sj88MuGL.mjs";
import { i as isFreePlan } from "./enrollment-access-BaRzVf28.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as useServerFn } from "./useServerFn-BWpHjTBs.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as requestAiWorkReview, t as briefNextClass } from "./student-review.functions-C42EUvGr.mjs";
import { i as slackChannelUrl, r as findProgram, t as SLACK_JOIN_URL } from "./coursePrograms-ONlp_ggE.mjs";
import { n as COMMUNITY_WHATSAPP_URL } from "./whatsapp-BIGKDc9S.mjs";
import { t as JoinWhatsAppButton } from "./JoinWhatsAppButton-gx5qEaAI.mjs";
import { t as Progress } from "./progress-DcTj7PSD.mjs";
import { n as notifyStudentWork, r as onboardStudent, t as ScrollArea } from "./student-onboarding.functions-CZppZl7C.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/dashboard-D4mGaQJv.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var HandoutModal = ({ open, onOpenChange, classTitle, classNumber, course, resources, handoutContent, description }) => {
	const [showFullHandout, setShowFullHandout] = (0, import_react.useState)(false);
	const getResourceIcon = (type) => {
		switch (type.toLowerCase()) {
			case "youtube": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" });
			case "website": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" });
		}
	};
	const generatePDF = async () => {
		const { default: jsPDF } = await import("../_libs/_26.mjs");
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		const margin = 20;
		const maxWidth = pageWidth - 40;
		doc.setFontSize(20);
		doc.text(`Class ${classNumber} Handout`, margin, 20);
		doc.setFontSize(14);
		doc.text(course, margin, 30);
		doc.setFontSize(16);
		doc.text(classTitle, margin, 40);
		doc.setFontSize(11);
		let yPosition = 50;
		if (description) {
			doc.setFontSize(12);
			doc.text("Description:", margin, yPosition);
			yPosition += 8;
			doc.setFontSize(11);
			doc.splitTextToSize(description, maxWidth).forEach((line) => {
				if (yPosition > 280) {
					doc.addPage();
					yPosition = 20;
				}
				doc.text(line, margin, yPosition);
				yPosition += 7;
			});
			yPosition += 10;
		}
		doc.splitTextToSize(handoutContent.replace(/[#*]/g, ""), maxWidth).forEach((line) => {
			if (yPosition > 280) {
				doc.addPage();
				yPosition = 20;
			}
			doc.text(line, margin, yPosition);
			yPosition += 7;
		});
		if (resources && resources.length > 0) {
			if (yPosition > 250) {
				doc.addPage();
				yPosition = 20;
			}
			yPosition += 10;
			doc.setFontSize(14);
			doc.text("Resources", margin, yPosition);
			yPosition += 10;
			doc.setFontSize(10);
			resources.forEach((resource) => {
				if (yPosition > 280) {
					doc.addPage();
					yPosition = 20;
				}
				doc.text(`• ${resource.title}: ${resource.url}`, margin, yPosition);
				yPosition += 7;
			});
		}
		doc.save(`${course}-Class-${classNumber}-Handout.pdf`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl w-[95vw] max-h-[90vh] sm:max-h-[80vh] flex flex-col min-h-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "text-lg sm:text-2xl leading-tight",
				children: [
					"Class ",
					classNumber,
					" - ",
					classTitle
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm text-muted-foreground",
				children: course
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "flex-1 min-h-0 pr-2 sm:pr-4",
				children: !showFullHandout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 sm:space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 sm:h-5 sm:w-5" }), "Resources"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 sm:space-y-3",
						children: resources && resources.length > 0 ? resources.map((resource, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: resource.url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex items-center gap-2 sm:gap-3 p-3 sm:p-3 rounded-lg border border-border hover:bg-accent transition-colors active:bg-accent min-h-[44px]",
							children: [
								getResourceIcon(resource.type),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-sm sm:text-base break-words",
									children: resource.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" })
							]
						}, index)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm",
							children: "No resources available"
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-2 sm:gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setShowFullHandout(true),
							className: "w-full sm:flex-1",
							variant: "outline",
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm sm:text-base",
								children: "Show Full Handout"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: generatePDF,
							className: "w-full sm:flex-1",
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm sm:text-base",
								children: "Download PDF"
							})]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 sm:space-y-4 h-full flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setShowFullHandout(false),
							variant: "outline",
							size: "default",
							className: "min-h-[44px]",
							children: "← Back to Resources"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "prose prose-sm max-w-none space-y-4 overflow-y-auto flex-1 pr-2",
							children: [description && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-muted-foreground",
									children: description
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "whitespace-pre-wrap text-xs sm:text-sm leading-relaxed",
								children: handoutContent
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: generatePDF,
							className: "w-full",
							size: "lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4 mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm sm:text-base",
								children: "Download PDF"
							})]
						})
					]
				})
			})]
		})
	});
};
var CertificateCard = ({ certificate, studentName }) => {
	const handleDownload = async () => {
		const { default: jsPDF } = await import("../_libs/_26.mjs");
		const doc = new jsPDF({
			orientation: "landscape",
			unit: "mm",
			format: "a4"
		});
		doc.setFillColor(255, 255, 255);
		doc.rect(0, 0, 297, 210, "F");
		doc.setDrawColor(59, 130, 246);
		doc.setLineWidth(2);
		doc.rect(10, 10, 277, 190);
		doc.setLineWidth(.5);
		doc.rect(15, 15, 267, 180);
		doc.setFontSize(40);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(59, 130, 246);
		doc.text("Certificate of Completion", 148.5, 50, { align: "center" });
		doc.setFontSize(14);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(100, 100, 100);
		doc.text("This is to certify that", 148.5, 70, { align: "center" });
		doc.setFontSize(32);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(0, 0, 0);
		doc.text(studentName, 148.5, 90, { align: "center" });
		doc.setFontSize(14);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(100, 100, 100);
		doc.text("has successfully completed the", 148.5, 105, { align: "center" });
		doc.setFontSize(24);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(59, 130, 246);
		doc.text(certificate.course_name, 148.5, 120, { align: "center" });
		doc.setFontSize(12);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(100, 100, 100);
		const issueDate = new Date(certificate.issued_at ?? 0).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
		doc.text(`Issued on ${issueDate}`, 148.5, 145, { align: "center" });
		doc.setFontSize(10);
		doc.setTextColor(150, 150, 150);
		doc.text(`Certificate No: ${certificate.certificate_number}`, 148.5, 160, { align: "center" });
		doc.setFontSize(12);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(59, 130, 246);
		doc.text("Tech Faculty", 148.5, 180, { align: "center" });
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text("Building Tomorrow's Tech Leaders", 148.5, 187, { align: "center" });
		doc.save(`${certificate.certificate_number}.pdf`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-6 h-6 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg",
							children: certificate.course_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: ["Issued: ", new Date(certificate.issued_at ?? 0).toLocaleDateString()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: ["Certificate No: ", certificate.certificate_number]
						}),
						certificate.revoked_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-destructive mt-1",
							children: "This certificate has been revoked. Contact Tech Faculty NG if you think this is a mistake."
						}) : null
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => window.open("/verify", "_blank"),
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "w-4 h-4" }), "Verify"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: handleDownload,
						disabled: !!certificate.revoked_at,
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), "Download"]
					})]
				})]
			})
		})
	});
};
var STATUS_LABEL = {
	submitted: "Awaiting review",
	reviewed: "Accepted",
	needs_changes: "Needs changes"
};
var StudentClassroom = ({ facultyId, department, courseName, classNumber, classTitle, meetingLink, whatsappGroupLink, liveClassMessage }) => {
	const { toast } = useToast();
	const runOnboarding = useServerFn(onboardStudent);
	const runNotify = useServerFn(notifyStudentWork);
	const runAiReview = useServerFn(requestAiWorkReview);
	const program = findProgram(department);
	const [channelName, setChannelName] = (0, import_react.useState)(program.channel);
	const [channelId, setChannelId] = (0, import_react.useState)(null);
	const [slackLinked, setSlackLinked] = (0, import_react.useState)(null);
	const [joinUrl, setJoinUrl] = (0, import_react.useState)(SLACK_JOIN_URL);
	const [connecting, setConnecting] = (0, import_react.useState)(false);
	const [items, setItems] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [proofUrl, setProofUrl] = (0, import_react.useState)("");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const loadDeliverables = async () => {
		const { data } = await supabase.from("student_deliverables").select("id, title, proof_url, status, score, reviewer_note, reviewed_by, class_number, created_at").order("created_at", { ascending: false }).limit(10);
		setItems(data ?? []);
	};
	const connect = async (silent = false) => {
		setConnecting(true);
		try {
			const res = await runOnboarding();
			if (res?.ok) {
				setChannelName(res.channelName ?? program.channel);
				if (res.channelId) setChannelId(res.channelId);
				setSlackLinked(!!res.slackLinked);
				if (res.joinUrl) setJoinUrl(res.joinUrl);
				if (!silent) toast({
					title: res.slackLinked ? "You're in your class group" : "Join Slack with your email",
					description: res.slackLinked ? `Added to #${res.channelName}. Class briefings and questions happen there.` : "Join the Tech Faculty Slack with the same email you registered with, then tap Connect again."
				});
			}
		} catch (e) {
			if (!silent) toast({
				title: "Could not connect your class group",
				description: e.message,
				variant: "destructive"
			});
		} finally {
			setConnecting(false);
		}
	};
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const init = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user || cancelled) return;
			const { data: profile } = await supabase.from("profiles").select("slack_user_id, slack_channel_name, slack_channel_id").eq("id", user.id).maybeSingle();
			if (cancelled) return;
			if (profile?.slack_channel_name) setChannelName(profile.slack_channel_name);
			if (profile?.slack_channel_id) setChannelId(profile.slack_channel_id);
			setSlackLinked(!!profile?.slack_user_id);
			await loadDeliverables();
			if (!profile?.slack_channel_name || !profile?.slack_user_id) connect(true);
		};
		init();
		return () => {
			cancelled = true;
		};
	}, [facultyId]);
	const submit = async () => {
		if (!facultyId) {
			toast({
				title: "Enrol first",
				description: "You need a Faculty ID before submitting work.",
				variant: "destructive"
			});
			return;
		}
		if (title.trim().length < 3) {
			toast({
				title: "Add a title",
				description: "Tell us what you worked on.",
				variant: "destructive"
			});
			return;
		}
		setSaving(true);
		try {
			const { data, error } = await supabase.from("student_deliverables").insert({
				faculty_id: facultyId,
				title: title.trim().slice(0, 160),
				proof_url: proofUrl.trim() ? proofUrl.trim().slice(0, 500) : null,
				summary: summary.trim() ? summary.trim().slice(0, 1e3) : null,
				course_name: courseName ?? program.title,
				class_number: classNumber ?? null
			}).select("id").single();
			if (error) throw error;
			setTitle("");
			setProofUrl("");
			setSummary("");
			await loadDeliverables();
			if (data?.id) {
				try {
					await runNotify({ data: { deliverableId: data.id } });
				} catch {}
				runAiReview({ data: { deliverableId: data.id } }).then(loadDeliverables, () => void 0);
			}
			toast({
				title: "Work submitted",
				description: "Your AI tutor is scoring it now. You'll get feedback here and by email in a minute or two."
			});
		} catch (e) {
			toast({
				title: "Could not submit",
				description: e.message,
				variant: "destructive"
			});
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Your class group"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: slackLinked ? "default" : "secondary",
						children: slackLinked ? "Connected" : "Not connected"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						program.title,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium text-foreground",
							children: ["#", channelName]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: slackLinked ? "Class briefings, notes and questions happen in your class group on Slack." : "Join the Tech Faculty Slack with the same email you registered with, then connect to be added automatically."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						slackChannelUrl(channelId) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => window.open(slackChannelUrl(channelId), "_blank"),
							children: [
								"Open #",
								channelName,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-2 h-4 w-4" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => window.open(joinUrl, "_blank"),
							children: ["Tech Faculty Slack ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-2 h-4 w-4" })]
						}),
						meetingLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => window.open(meetingLink, "_blank"),
							children: ["Join Class ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-2 h-4 w-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(liveClassMessage ?? `Hi! I'm ready for my next ${program.title} class`)}`, "_blank"),
							children: "Join Live Class"
						}),
						whatsappGroupLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => window.open(whatsappGroupLink, "_blank"),
							children: ["Class WhatsApp Group ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "ml-2 h-4 w-4" })]
						}),
						!slackLinked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => connect(false),
							disabled: connecting,
							children: [connecting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Connect my class group"]
						})
					]
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold",
						children: "Submit this week's work"
					})]
				}),
				classTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Current class: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: classTitle
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "work-title",
								children: "What did you build or complete?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "work-title",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "e.g. Class 3 project: portfolio page",
								maxLength: 160
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "work-link",
								children: "Link to your work (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "work-link",
								value: proofUrl,
								onChange: (e) => setProofUrl(e.target.value),
								placeholder: "GitHub, live link, Figma or Google Doc",
								maxLength: 500
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "work-notes",
								children: "Anything you struggled with? (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "work-notes",
								value: summary,
								onChange: (e) => setSummary(e.target.value),
								rows: 3,
								maxLength: 1e3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: submit,
							disabled: saving,
							children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Submit my work"]
						})
					]
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Your submissions"
					}), items.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-3 space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium",
									children: [d.class_number ? `Class ${d.class_number}: ` : "", d.title]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: d.status === "reviewed" ? "default" : d.status === "needs_changes" ? "destructive" : "secondary",
									className: "shrink-0",
									children: [d.status === "reviewed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }) : d.status === "needs_changes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mr-1 h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mr-1 h-3 w-3" }), STATUS_LABEL[d.status] ?? d.status]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									new Date(d.created_at).toLocaleDateString(),
									typeof d.score === "number" ? ` · Score ${d.score}%` : "",
									d.reviewed_by === "ai" ? " · AI tutor" : d.reviewed_by === "staff" ? " · Tutor" : ""
								]
							}),
							d.proof_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: d.proof_url,
								target: "_blank",
								rel: "noreferrer",
								className: "text-xs underline break-all",
								children: d.proof_url
							}),
							d.reviewer_note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground border-l-2 pl-2",
								children: d.reviewer_note
							})
						]
					}, d.id))]
				})
			]
		}) })]
	});
};
var money$1 = (currency, amount) => `${currency === "USD" ? "$" : "₦"}${Number(amount).toLocaleString()}`;
/** A student's alumni referral code, with how many friends joined and rewards earned. */
function ReferralCard() {
	const [info, setInfo] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.rpc("get_my_referral").then(({ data, error }) => {
			if (error) console.error("Could not load referral code:", error);
			else setInfo(data);
		});
	}, []);
	if (!info) return null;
	if (!info.eligible || !info.code) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-6 space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-xl font-semibold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
				className: "text-primary",
				size: 20
			}), "Refer a friend"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"Once you graduate or your paid plan is confirmed, you'll get a referral code here. Friends who join with it save ",
				10,
				"%, and you earn a reward for each one."
			]
		})]
	}) });
	const shareUrl = `https://techfaculty.ng/?ref=${encodeURIComponent(info.code)}#pricing`;
	const shareText = `Join me at Tech Faculty NG. Use my referral code ${info.code} to save 10% on your plan: ${shareUrl}`;
	const copy = async (text, what) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`${what} copied`);
		} catch {
			toast.error("Couldn't copy. Select it and copy by hand.");
		}
	};
	const earned = (info.rewards ?? []).filter((r) => r.earned > 0);
	const paid = (info.rewards ?? []).filter((r) => r.paid_out > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-6 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-xl font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
					className: "text-primary",
					size: 20
				}), "Refer a friend"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Friends who join with your code save ",
					10,
					"% on their plan. Once they've paid, you earn ",
					10,
					"% of what they paid, and Tech Faculty pays it to you."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "rounded-md border bg-muted px-3 py-2 text-lg font-bold tracking-wider",
						children: info.code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => copy(info.code, "Code"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), "Copy code"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
							target: "_blank",
							rel: "noopener noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "mr-2 h-4 w-4" }), "Share on WhatsApp"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => copy(shareUrl, "Link"),
						children: "Copy link"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: info.joined ?? 0
					}),
					" friend",
					info.joined === 1 ? "" : "s",
					" joined with your code",
					earned.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: earned.map((r) => money$1(r.currency, r.earned)).join(" + ")
						}),
						" reward due to you"
					] }),
					paid.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" · ",
						paid.map((r) => money$1(r.currency, r.paid_out)).join(" + "),
						" paid out"
					] })
				]
			})
		]
	}) });
}
var money = (currency, amount) => `${currency === "USD" ? "$" : "₦"}${Number(amount).toLocaleString()}`;
/** For a student on an instalment plan: what is left to pay, and a button to pay it. */
function BalanceDue({ enrollment }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const balance = Number(enrollment.balance_due ?? 0);
	if (!(balance > 0) || !["active", "confirmed"].includes(enrollment.status)) return null;
	const pay = async () => {
		setBusy(true);
		try {
			const { data, error } = await supabase.functions.invoke("create-checkout", { body: {
				balanceForEnrollmentId: enrollment.id,
				successUrl: `${window.location.origin}/payment-success`
			} });
			const url = data?.url?.trim();
			if (error || !url || !/^https?:\/\//i.test(url)) throw new Error(data?.error || error?.message || "Could not start the payment");
			window.location.assign(url);
		} catch (e) {
			toast.error(e.message);
			setBusy(false);
		}
	};
	const overdue = enrollment.balance_due_by && enrollment.balance_due_by < lagosToday();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: overdue ? "border-destructive/50" : "border-primary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-6 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-lg font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary" }), " Balance to pay"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xl font-bold",
					children: money(enrollment.currency, balance)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"The rest of your ",
						enrollment.plan_name,
						" plan",
						enrollment.balance_due_by ? `, ${overdue ? "was due" : "due"} by ${formatDay(enrollment.balance_due_by)}` : "",
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: pay,
					disabled: busy,
					className: "w-full",
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Pay balance"]
				})
			]
		})
	});
}
var SKIP_KEY = "tf_location_prompt_skipped";
/** One-time optional prompt for students (mainly Google sign-ups) without a saved location. */
var LocationPrompt = () => {
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [show, setShow] = (0, import_react.useState)(false);
	const [value, setValue] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem(SKIP_KEY)) return;
		(async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;
			const { data } = await supabase.from("profiles").select("location").eq("id", user.id).maybeSingle();
			if (data && !data.location) {
				setUserId(user.id);
				setShow(true);
			}
		})();
	}, []);
	if (!show || !userId) return null;
	const save = async () => {
		const loc = value.trim().slice(0, 160);
		if (!loc) return;
		setSaving(true);
		const { error } = await supabase.from("profiles").update({ location: loc }).eq("id", userId);
		setSaving(false);
		if (!error) setShow(false);
	};
	const skip = () => {
		localStorage.setItem(SKIP_KEY, "1");
		setShow(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 16 }), " Where are you based?"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value,
				onChange: (e) => setValue(e.target.value),
				placeholder: "e.g. Nnewi, Anambra",
				maxLength: 160,
				className: "sm:flex-1",
				"aria-label": "City / State"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: save,
					disabled: saving || !value.trim(),
					children: "Save"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: skip,
					children: "Skip"
				})]
			})
		]
	}) });
};
/**
* Student: issue any certificate they have now earned, right after they tick
* their last class. Only ever looks at the signed-in student's own courses;
* the rules are in certificate-auto-issue.server.ts.
*/
var claimMyCertificates = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8b4b010cfd753c12296592a06c22209a96286db208591eca54fa4ad1f724dfd5"));
var google_logo_default = "/assets/google-logo-Cbw5lC6a.png";
var microsoft_logo_default = "/assets/microsoft-logo-CnK93WgN.png";
var Dashboard = () => {
	const [enrollmentData, setEnrollmentData] = (0, import_react.useState)(null);
	const [coursesData, setCoursesData] = (0, import_react.useState)([]);
	const [lecturesData, setLecturesData] = (0, import_react.useState)([]);
	const [nextLecture, setNextLecture] = (0, import_react.useState)(null);
	const [nextClassNumber, setNextClassNumber] = (0, import_react.useState)(1);
	const [showAllCourses, setShowAllCourses] = (0, import_react.useState)(false);
	const [handoutModalOpen, setHandoutModalOpen] = (0, import_react.useState)(false);
	const [aiGeneratedContent, setAiGeneratedContent] = (0, import_react.useState)(null);
	const [isLoadingAiContent, setIsLoadingAiContent] = (0, import_react.useState)(false);
	const [certificates, setCertificates] = (0, import_react.useState)([]);
	const [isRefreshingContent, setIsRefreshingContent] = (0, import_react.useState)(false);
	const { toast } = useToast();
	const { isLoggedIn, userData, logout, setUserData, facultyId } = useUser();
	const navigate = useNavigate$1();
	const fetchUserDashboardData = async (facultyIdToFetch) => {
		try {
			const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("faculty_id", facultyIdToFetch).single();
			if (profileError) throw profileError;
			const { data: enrollment } = await supabase.from("enrollments").select("*").eq("faculty_id", facultyIdToFetch).order("created_at", { ascending: false }).limit(1).maybeSingle();
			setEnrollmentData(enrollment);
			const planMapping = {
				"Free Bootcamp": "free_bootcamp",
				"Bootcamp Starter": "bootcamp_starter",
				"Developer Pro": "developer_pro",
				"Data Wizard": "data_wizard",
				"Security Shield": "security_shield",
				"AI Innovator": "ai_innovator",
				"Cloud Architect": "cloud_architect",
				"Design Master": "design_master",
				"Digital Marketing Pro": "digital_marketing_pro"
			};
			const departmentMapping = {
				"Free Bootcamp": "General Tech",
				"Bootcamp Starter": "General Tech",
				"Developer Pro": "Web Development",
				"Data Wizard": "Data Science",
				"Security Shield": "Cyber Security",
				"AI Innovator": "Machine Learning",
				"Cloud Architect": "Cloud Computing",
				"Design Master": "UI/UX Design",
				"Digital Marketing Pro": "Digital Marketing"
			};
			const dbPlanName = planMapping[enrollment?.plan_name || ""] || "free_bootcamp";
			const resolvedDepartment = profileData?.department || departmentMapping[enrollment?.plan_name || ""] || "General Tech";
			setUserData({
				...profileData,
				department: resolvedDepartment
			});
			const { data: courses } = await supabase.from("courses").select("*").eq("plan_required", dbPlanName).eq("department", resolvedDepartment);
			let courseEnrollments = [];
			try {
				const { data: userCourses, error: userCoursesError } = await supabase.functions.invoke("user-courses", { body: { facultyId: facultyIdToFetch } });
				if (userCoursesError) throw userCoursesError;
				courseEnrollments = userCourses?.enrollments || [];
				setCoursesData(courseEnrollments);
				try {
					const { data: refreshedProfile } = await supabase.from("profiles").select("*").eq("faculty_id", facultyIdToFetch).single();
					if (refreshedProfile) setUserData(refreshedProfile);
				} catch (e) {
					console.warn("Could not refresh profile after syncing courses:", e);
				}
			} catch (fnErr) {
				console.error("Error fetching user courses via function:", fnErr);
				setCoursesData([]);
			}
			try {
				const { data: certs, error: certsError } = await supabase.from("certificates").select("*").eq("faculty_id", facultyIdToFetch).order("issued_at", { ascending: false });
				if (!certsError && certs) setCertificates(certs);
			} catch (certErr) {
				console.error("Error fetching certificates:", certErr);
			}
			if (courseEnrollments && courseEnrollments.length > 0) {
				const courseIds = courseEnrollments.map((ce) => ce.course_id);
				const { data: allLectures } = await supabase.from("lectures").select("*, courses (*)").in("course_id", courseIds).order("scheduled_at", { ascending: true });
				setLecturesData(allLectures || []);
				const { data: progressRecords } = await supabase.from("course_progress").select("*").eq("faculty_id", facultyIdToFetch);
				let nextLectureToShow = null;
				let calculatedNextClassNumber = 1;
				for (const enrollment of courseEnrollments) {
					const classesCompleted = (enrollment.course_progress?.[0])?.classes_completed || 0;
					if (classesCompleted < 4) {
						const courseLectures = (allLectures || []).filter((l) => l.course_id === enrollment.course_id);
						nextLectureToShow = courseLectures[classesCompleted] || courseLectures[0];
						calculatedNextClassNumber = classesCompleted + 1;
						if (nextLectureToShow) break;
					}
				}
				setNextLecture(nextLectureToShow);
				setNextClassNumber(calculatedNextClassNumber);
				if (nextLectureToShow && courseEnrollments.length > 0) {
					setIsLoadingAiContent(true);
					try {
						const courseName = courseEnrollments.find((ce) => ce.course_id === nextLectureToShow.course_id)?.courses?.name || nextLectureToShow.courses?.name || "General Tech Course";
						const { data: aiContent, error: aiError } = await supabase.functions.invoke("generate-class-content", { body: {
							classTitle: nextLectureToShow.title,
							courseName,
							classNumber: calculatedNextClassNumber,
							courseId: nextLectureToShow.course_id,
							forceRefresh: false
						} });
						if (!aiError && aiContent) setAiGeneratedContent(aiContent);
					} catch (error) {
						console.error("Error generating AI content:", error);
					} finally {
						setIsLoadingAiContent(false);
					}
				}
				if (!allLectures || allLectures.length === 0) {
					const cacheKey = `aiNextClass_${facultyIdToFetch}`;
					const cachedData = localStorage.getItem(cacheKey);
					if (cachedData) try {
						const parsed = JSON.parse(cachedData);
						if (Date.now() - parsed.timestamp < 864e5) setNextLecture(parsed.lecture);
						else localStorage.removeItem(cacheKey);
					} catch (e) {
						localStorage.removeItem(cacheKey);
					}
					if (!cachedData || !nextLecture) try {
						const { data: aiData, error: aiError } = await supabase.functions.invoke("generate-next-class", { body: { courses: courseEnrollments } });
						if (aiError) throw aiError;
						if (aiData?.nextClass) {
							const daysAhead = Math.floor(Math.random() * 5) + 3;
							const futureDate = /* @__PURE__ */ new Date();
							futureDate.setDate(futureDate.getDate() + daysAhead);
							const lecture = {
								title: aiData.nextClass.title,
								description: aiData.nextClass.description,
								scheduled_at: futureDate.toISOString(),
								duration_minutes: parseInt(aiData.nextClass.duration) || 90,
								courses: { name: aiData.nextClass.course },
								meeting_link: null,
								isAiGenerated: true,
								classNumber: aiData.nextClass.classNumber || 1,
								resources: aiData.nextClass.resources || [],
								handoutContent: aiData.nextClass.handoutContent || "",
								course_id: courseEnrollments[0]?.course_id
							};
							setNextLecture(lecture);
							if (courseEnrollments[0]?.course_progress?.[0]) setNextClassNumber(Math.min((courseEnrollments[0].course_progress[0].classes_completed || 0) + 1, 4));
							else setNextClassNumber(1);
							localStorage.setItem(cacheKey, JSON.stringify({
								lecture,
								timestamp: Date.now()
							}));
						}
					} catch (aiError) {
						console.error("Error generating next class with AI:", aiError);
					}
				}
			}
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		}
	};
	const handleSignOut = async () => {
		await logout();
		toast({
			title: "Signed Out",
			description: "You've been signed out successfully."
		});
		navigate("/");
	};
	const runClaimCertificates = useServerFn(claimMyCertificates);
	const handleCheckpointComplete = async (courseId, checkpointNumber) => {
		if (!userData?.faculty_id) return;
		try {
			const { data: progressData } = await supabase.from("course_progress").select("*").eq("faculty_id", userData.faculty_id).eq("course_id", courseId).maybeSingle();
			const currentCompleted = progressData?.classes_completed || 0;
			let newClassesCompleted;
			if (checkpointNumber === currentCompleted) newClassesCompleted = Math.max(0, currentCompleted - 1);
			else if (checkpointNumber === currentCompleted + 1) newClassesCompleted = checkpointNumber;
			else {
				toast({
					title: "Complete in Order",
					description: "Please complete classes in order.",
					variant: "destructive"
				});
				return;
			}
			const newProgress = newClassesCompleted * 25;
			if (progressData) {
				const { error } = await supabase.from("course_progress").update({
					classes_completed: newClassesCompleted,
					progress_percentage: newProgress,
					last_accessed: (/* @__PURE__ */ new Date()).toISOString(),
					...newProgress === 100 ? { completed_at: (/* @__PURE__ */ new Date()).toISOString() } : { completed_at: null }
				}).eq("id", progressData.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("course_progress").insert({
					faculty_id: userData.faculty_id,
					course_id: courseId,
					classes_completed: newClassesCompleted,
					progress_percentage: newProgress,
					last_accessed: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (error) throw error;
			}
			toast({
				title: "Progress Updated",
				description: newClassesCompleted > currentCompleted ? `Class ${newClassesCompleted} of 4 completed!` : `Progress reset to ${newClassesCompleted} of 4 classes`
			});
			localStorage.removeItem(`aiNextClass_${userData.faculty_id}`);
			if (newProgress === 100) try {
				const result = await runClaimCertificates();
				if (result.issued > 0) toast({
					title: "Certificate issued",
					description: "Congratulations! We've emailed you the link to verify it."
				});
				else if (result.waitingPayment > 0) toast({
					title: "Course complete",
					description: "Your certificate will be issued once your fees are paid in full."
				});
				else if (result.waitingWork > 0) toast({
					title: "Course complete",
					description: "Your certificate will be issued once a tutor accepts your submitted work."
				});
			} catch {}
			await fetchUserDashboardData(userData.faculty_id);
		} catch (error) {
			console.error("Error updating progress:", error);
			toast({
				title: "Error",
				description: "Failed to update progress. Please try again.",
				variant: "destructive"
			});
		}
	};
	const runBrief = useServerFn(briefNextClass);
	(0, import_react.useEffect)(() => {
		if (!nextLecture?.title || !facultyId) return;
		const title = String(nextLecture.title).replace(/\s*-?\s*(Session|Class)\s+\d+/gi, "").slice(0, 200) || "Your next class";
		const classKey = `${nextLecture.course_id ?? "general"}:${nextClassNumber}`;
		runBrief({ data: {
			classKey,
			classTitle: title,
			classNumber: nextClassNumber,
			date: nextLecture.scheduled_at ? new Date(nextLecture.scheduled_at).toDateString() : void 0
		} }).catch(() => {});
	}, [
		nextLecture?.course_id,
		nextLecture?.title,
		nextClassNumber,
		facultyId
	]);
	const handleRefreshContent = async () => {
		if (!nextLecture?.course_id || !facultyId) return;
		setIsRefreshingContent(true);
		try {
			const courseName = nextLecture?.courses?.name || "General Tech Course";
			const { data: aiContent, error: aiError } = await supabase.functions.invoke("generate-class-content", { body: {
				classTitle: nextLecture.title,
				courseName,
				classNumber: nextClassNumber,
				courseId: nextLecture.course_id,
				forceRefresh: true
			} });
			if (!aiError && aiContent) {
				setAiGeneratedContent(aiContent);
				toast({
					title: "Content Refreshed",
					description: "Class content has been regenerated successfully."
				});
			} else throw aiError;
		} catch (error) {
			console.error("Error refreshing content:", error);
			toast({
				title: "Refresh Failed",
				description: "Could not refresh content. Please try again.",
				variant: "destructive"
			});
		} finally {
			setIsRefreshingContent(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (isLoggedIn && facultyId) fetchUserDashboardData(facultyId);
	}, [isLoggedIn, facultyId]);
	if (!isLoggedIn) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container mx-auto max-w-2xl py-24 px-4 text-center space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold",
							children: "Student Dashboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Please log in to access your dashboard."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
							to: "/#get-started",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								children: "Go to Login"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "py-16 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container mx-auto max-w-6xl space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-3xl md:text-4xl font-bold mb-2",
									children: [
										"Welcome Back, ",
										userData?.name,
										"!"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: ["Your Faculty ID: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-semibold text-foreground",
										children: userData?.faculty_id
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: handleSignOut,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
										className: "mr-2",
										size: 18
									}), "Sign Out"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationPrompt, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid md:grid-cols-2 gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "bg-gradient-to-br from-card via-background to-card border-2 border-primary/20 shadow-xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "p-8 space-y-6 relative overflow-hidden",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
														size: 300,
														className: "text-primary"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary/30 rounded-tl-lg" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-primary/30 rounded-tr-lg" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-primary/30 rounded-bl-lg" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-primary/30 rounded-br-lg" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex justify-center pt-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: tech_faculty_logo_default,
														alt: "Tech Faculty",
														className: "h-16 w-auto object-contain"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-center space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "text-2xl font-bold bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent",
														children: "Student Profile"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground uppercase tracking-widest",
														children: "Tech Faculty NG"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-4 py-4",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-center border-b border-border/50 pb-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-2xl font-bold text-foreground",
																children: userData?.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-sm text-muted-foreground mt-1",
																children: "Student Name"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "grid grid-cols-2 gap-4 text-center",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "border-r border-border/50",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "font-mono text-sm font-semibold text-primary",
																	children: userData?.faculty_id
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-xs text-muted-foreground mt-1",
																	children: "Faculty ID"
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: enrollmentData?.plan_name === "Developer Pro" ? "default" : "secondary",
																	className: "text-xs",
																	children: enrollmentData?.plan_name || "Free Bootcamp"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-xs text-muted-foreground mt-1",
																	children: "Plan"
																}),
																enrollmentData?.status === "pending" && !isFreePlan(enrollmentData.plan_name) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-xs font-medium text-amber-600 mt-1",
																	children: "Awaiting payment"
																})
															] })]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-center border-t border-border/50 pt-4 space-y-2",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground",
																children: "Department"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-medium text-sm",
																children: userData?.department || "Not assigned"
															})] })
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border-t border-border/50 pt-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-center text-muted-foreground mb-3 uppercase tracking-wide",
														children: "In Partnership With"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-center items-center gap-4 flex-wrap",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: google_logo_default,
																alt: "Google",
																className: "h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: microsoft_logo_default,
																alt: "Microsoft",
																className: "h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
																src: fmsti_logo_default,
																alt: "Federal Ministry of Science Technology and Innovation",
																className: "h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
															})
														]
													})]
												})
											]
										})
									}),
									enrollmentData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceDue, { enrollment: enrollmentData }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-6 space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
												className: "text-xl font-semibold flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
													className: "text-primary",
													size: 20
												}), "Next Class"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "text-sm",
												children: [
													"Class ",
													nextClassNumber,
													" of 4"
												]
											})]
										}), nextLecture ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
															className: "font-semibold",
															children: (aiGeneratedContent?.title || nextLecture.title).replace(/\s*-?\s*(Session|Class)\s+\d+/gi, "")
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "secondary",
															className: "ml-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
																className: "mr-1",
																size: 14
															}), "AI Course Rep"]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: nextLecture.courses?.name
													}),
													isLoadingAiContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground mt-2 italic",
														children: "Loading class summary..."
													}) : aiGeneratedContent?.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground mt-2",
														children: aiGeneratedContent.summary
													}) : aiGeneratedContent?.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground mt-2",
														children: aiGeneratedContent.description.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ") + (aiGeneratedContent.description.match(/[.!?]$/) ? "" : ".")
													}) : nextLecture.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground mt-2",
														children: nextLecture.description
													}) : null
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Date:"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium",
															children: new Date(nextLecture.scheduled_at).toLocaleDateString()
														})
													] }), !nextLecture.isAiGenerated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Time:"
														}),
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium",
															children: new Date(nextLecture.scheduled_at).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit"
															})
														})
													] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													className: "w-full",
													onClick: () => setHandoutModalOpen(true),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
														className: "mr-2",
														size: 16
													}), "View Class Handout"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "ghost",
													className: "w-full",
													onClick: handleRefreshContent,
													disabled: isRefreshingContent,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
														className: `mr-2 ${isRefreshingContent ? "animate-spin" : ""}`,
														size: 16
													}), isRefreshingContent ? "Refreshing..." : "Refresh Content"]
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center py-8 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
												className: "mx-auto mb-2 opacity-50",
												size: 32
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No upcoming classes scheduled yet." })]
										})]
									}) })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentClassroom, {
								facultyId: facultyId || userData?.faculty_id,
								department: userData?.department,
								courseName: nextLecture?.courses?.name,
								classNumber: nextClassNumber,
								classTitle: (aiGeneratedContent?.title || nextLecture?.title || "").replace(/\s*-?\s*(Session|Class)\s+\d+/gi, ""),
								meetingLink: nextLecture && !nextLecture.isAiGenerated ? nextLecture.meeting_link : null,
								whatsappGroupLink: nextLecture && !nextLecture.isAiGenerated ? nextLecture.courses?.whatsapp_group_link : null,
								liveClassMessage: nextLecture ? `Hi! I'm ready for the next class: ${nextLecture.title} (${nextLecture.courses?.name})` : null
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-xl font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
										className: "text-primary",
										size: 20
									}), "Your Courses"]
								}), coursesData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-6",
									children: [(showAllCourses ? coursesData : coursesData.slice(0, 3)).map((enrollment, index) => {
										const classesCompleted = (enrollment.course_progress?.[0])?.classes_completed || 0;
										const progressPercentage = classesCompleted * 25;
										const allCoursesToDisplay = showAllCourses ? coursesData : coursesData.slice(0, 3);
										const isCourseActive = !(index > 0 && allCoursesToDisplay.slice(0, index).some((prev) => {
											return (prev.course_progress?.[0]?.classes_completed || 0) < 4;
										}));
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border rounded-lg p-4 space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-start",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-semibold",
													children: enrollment.courses?.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: enrollment.courses?.description
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: classesCompleted === 4 ? "default" : "outline",
													children: [classesCompleted, "/4 Classes"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-center text-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Progress"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-medium",
															children: [progressPercentage, "%"]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
														value: progressPercentage,
														className: "h-2"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 pt-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted-foreground min-w-fit",
															children: "Mark class:"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex gap-2 flex-1",
															children: [
																1,
																2,
																3,
																4
															].map((checkpoint) => {
																const isCompleted = classesCompleted >= checkpoint;
																const isNext = checkpoint === classesCompleted + 1;
																const isCurrentLast = checkpoint === classesCompleted;
																const canInteract = isCourseActive && (isNext || isCurrentLast);
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																	onClick: () => canInteract && handleCheckpointComplete(enrollment.course_id, checkpoint),
																	disabled: !canInteract,
																	className: `flex-1 h-8 rounded-md border-2 transition-all flex items-center justify-center ${!isCourseActive ? "bg-background border-muted-foreground/20 cursor-not-allowed opacity-40" : isCompleted ? "bg-primary border-primary text-primary-foreground" : isNext ? "bg-background border-primary/50 hover:border-primary hover:bg-primary/5 cursor-pointer" : "bg-background border-muted-foreground/20 cursor-not-allowed opacity-50"} ${isCourseActive && isCurrentLast && isCompleted ? "cursor-pointer hover:opacity-80" : ""}`,
																	title: !isCourseActive ? "Complete previous course first" : isCurrentLast && isCompleted ? "Click to undo" : isNext ? "Click to complete" : isCompleted ? "Completed" : "Complete previous classes first",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-xs font-medium",
																		children: checkpoint
																	})
																}, checkpoint);
															})
														})]
													}),
													!isCourseActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground italic pt-2",
														children: "Complete the previous course to unlock this one"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex gap-2 pt-2",
														children: enrollment.courses?.whatsapp_group_link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "outline",
															size: "sm",
															onClick: () => window.open(enrollment.courses?.whatsapp_group_link, "_blank"),
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
																className: "mr-2",
																size: 14
															}), "Course Group"]
														})
													})
												]
											})]
										}, enrollment.id);
									}), coursesData.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-center pt-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											onClick: () => setShowAllCourses(!showAllCourses),
											children: showAllCourses ? "See Less Courses" : `See More Courses (${coursesData.length - 3} more)`
										})
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center py-8 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
											className: "mx-auto mb-2 opacity-50",
											size: 32
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No courses enrolled yet." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
											to: "/#pricing",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												className: "mt-4",
												children: "Choose Your Plan"
											})
										})
									]
								})]
							}) }),
							certificates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-xl font-semibold mb-4 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
										className: "text-primary",
										size: 20
									}), "Your Certificates"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: certificates.map((cert) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateCard, {
										certificate: cert,
										studentName: userData?.name || ""
									}, cert.id))
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferralCard, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-semibold mb-4",
									children: "Quick Actions"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => {
											const message = `Hi! I'm ${userData?.name} (Faculty ID: ${userData?.faculty_id}). I need assistance with my account.`;
											window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
											className: "mr-2",
											size: 18
										}), "Contact Support"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JoinWhatsAppButton, {
										variant: "outline",
										capture: false,
										url: COMMUNITY_WHATSAPP_URL,
										groupName: "the Tech Faculty WhatsApp community",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center justify-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
												className: "mr-2",
												size: 18
											}), "Community Hub"]
										})
									})]
								})]
							}) })
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandoutModal, {
				open: handoutModalOpen,
				onOpenChange: setHandoutModalOpen,
				classTitle: (aiGeneratedContent?.title || nextLecture?.title || "").replace(/\s*-?\s*(Session|Class)\s+\d+/gi, ""),
				classNumber: nextClassNumber,
				course: nextLecture?.courses?.name || "",
				resources: aiGeneratedContent?.resources || [],
				handoutContent: aiGeneratedContent?.handoutContent || "No handout content available yet. Check back later or contact your instructor.",
				description: aiGeneratedContent?.description || nextLecture?.description || void 0
			})
		]
	});
};
var SplitComponent = Dashboard;
//#endregion
export { SplitComponent as component };
