import { a as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DiboEcwk.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { O as ShieldCheck, j as Search, nn as Award, tn as BadgeCheck } from "../_libs/lucide-react.mjs";
import { a as Footer, o as Header } from "./Footer-BKqEypqK.mjs";
import { a as CardHeader, n as CardContent, t as Card } from "./card-BWmmnMPu.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/verify._-_9cXm1fW.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var Verify = () => {
	const [certificateId, setCertificateId] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [message, setMessage] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const normalizedId = (0, import_react.useMemo)(() => certificateId.trim().toUpperCase(), [certificateId]);
	const handleVerify = async () => {
		if (!normalizedId) {
			setStatus("error");
			setResult(null);
			setMessage("Please enter a certificate ID.");
			return;
		}
		setLoading(true);
		const { data: rows, error } = await supabase.rpc("verify_certificate", { cert_number: normalizedId });
		setLoading(false);
		const data = Array.isArray(rows) ? rows[0] : null;
		if (error || !data) {
			setStatus("error");
			setResult(null);
			setMessage(`Certificate ID "${normalizedId}" was not found in the Tech Faculty NG database.`);
			return;
		}
		if (data.revoked) {
			setStatus("error");
			setResult(null);
			setMessage(`Certificate ID "${normalizedId}" has been revoked by Tech Faculty NG and is no longer valid.`);
			return;
		}
		const fallbackDate = data.issued_at ? new Date(data.issued_at).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "2-digit"
		}) : "";
		setStatus("success");
		setResult({
			name: data.student_name ?? "—",
			course: data.course_name,
			certificateType: data.certificate_type ?? "Certificate of Achievement",
			issuedBy: data.issued_by ?? "Tech Faculty NG",
			dateIssued: data.date_issued ?? fallbackDate
		});
		setMessage("Certificate verified successfully.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container mx-auto px-4 pt-32 pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-4xl space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card shadow-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/verify/TFNGCertVerify.jpg",
										alt: "Tech Faculty NG certificate verification logo",
										className: "h-full w-full object-cover"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold uppercase tracking-[0.3em] text-primary",
									children: "Official verification portal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-bold tracking-tight text-gradient md:text-5xl",
									children: "Certificate Verification System"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto max-w-2xl text-base text-muted-foreground md:text-lg",
									children: "Authenticate any credential issued by Tech Faculty NG. Enter the unique certificate ID to confirm authenticity."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border bg-card/90 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-primary" }), "Verify a certificate"]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 md:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: certificateId,
										onChange: (event) => setCertificateId(event.target.value),
										onKeyDown: (event) => {
											if (event.key === "Enter") handleVerify();
										},
										placeholder: "e.g. TFNG202601",
										"aria-label": "Certificate ID",
										className: "h-12 flex-1 rounded-xl"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										onClick: handleVerify,
										disabled: loading,
										className: "h-12 rounded-xl px-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), loading ? "Verifying..." : "Verify Certificate"]
									})]
								}), message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: ["rounded-2xl border px-4 py-3 text-sm", status === "success" ? "border-primary/30 bg-primary/10 text-foreground" : "border-destructive/30 bg-destructive/10 text-destructive"].join(" "),
									children: message
								}) : null]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border bg-card/90 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-5 w-5 text-primary" }), "Verified record"]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-lg font-semibold",
											children: result.name
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Course"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-lg font-semibold",
											children: result.course
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Certificate Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-lg font-semibold",
											children: result.certificateType
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Certificate ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-lg font-semibold",
											children: normalizedId
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Issued By"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-lg font-semibold",
											children: result.issuedBy
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Date Issued"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-lg font-semibold",
											children: result.dateIssued
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "mb-3 h-10 w-10 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-semibold",
										children: "No certificate verified yet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 max-w-xl text-sm text-muted-foreground",
										children: "Enter a certificate ID above to display the official verification record."
									})
								]
							}) })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = Verify;
//#endregion
export { SplitComponent as component };
