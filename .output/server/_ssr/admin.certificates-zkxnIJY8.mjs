import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle, B as Pencil, M as RotateCcw, O as ShieldCheck, en as Ban, j as Search, nn as Award } from "../_libs/lucide-react.mjs";
import { a as Footer, c as useIsStaff, o as Header } from "./Footer-BKqEypqK.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BWmmnMPu.mjs";
import { l as createServerFn } from "./createServerFn-5DIU6euU.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bs8PGiGX.mjs";
import { c as objectType, n as booleanType, u as stringType } from "../_libs/zod.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as AdminNav } from "./AdminNav-Co4-pzct.mjs";
import { t as Badge } from "./badge-ClE2OJzz.mjs";
import { t as Input$1 } from "./input-NDzQLmvT.mjs";
import { t as useServerFn } from "./useServerFn-BWpHjTBs.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DQeVp_Q7.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
import { t as Textarea } from "./textarea-DtV3K4Va.mjs";
import { t as createSsrRpc } from "./createSsrRpc-yyKrtVKy.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin.certificates-zkxnIJY8.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var SearchInput = objectType({ query: stringType().trim().max(100).default("") });
/** Admin: the latest certificates, or those matching a number, name, course or faculty ID. */
var searchCertificates = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => SearchInput.parse(d)).handler(createSsrRpc("e3290f8bb4ca058ae4a6a36fd10aaabd51e31054ab80d18c88678f75200edae8"));
var UpdateInput = objectType({
	id: stringType().uuid(),
	studentName: stringType().trim().min(1).max(200),
	courseName: stringType().trim().min(1).max(200),
	certificateType: stringType().trim().max(200),
	issuedBy: stringType().trim().max(200),
	dateIssued: stringType().trim().min(1).max(100)
});
/** Admin: correct a certificate's details. The number stays fixed; no email is sent. */
var updateCertificate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => UpdateInput.parse(d)).handler(createSsrRpc("a71f96f37ad38888b313f8040a08adf04ed2874045563a5c69c6df60c081aa5a"));
var RevokeInput = objectType({
	id: stringType().uuid(),
	revoke: booleanType(),
	reason: stringType().trim().max(500).optional()
});
/** Admin: revoke a certificate (it stops verifying on /verify), or reinstate it. */
var setCertificateRevoked = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => RevokeInput.parse(d)).handler(createSsrRpc("056973a04b7534a293cc3779ad940e6553937116d76f91580cec6601d390ecc6"));
/** Search, edit, revoke and reinstate certificates. `refreshKey` reloads the list. */
var CertificateManager = ({ refreshKey }) => {
	const { toast } = useToast();
	const search = useServerFn(searchCertificates);
	const update = useServerFn(updateCertificate);
	const setRevoked = useServerFn(setCertificateRevoked);
	const [query, setQuery] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [editForm, setEditForm] = (0, import_react.useState)(null);
	const [revoking, setRevoking] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async (q) => {
		setLoading(true);
		try {
			setRows(await search({ data: { query: q } }));
		} catch (e) {
			toast({
				title: "Could not load certificates",
				description: e.message,
				variant: "destructive"
			});
		} finally {
			setLoading(false);
		}
	}, [search, toast]);
	(0, import_react.useEffect)(() => {
		load(query);
	}, [refreshKey]);
	const replaceRow = (row) => setRows((rs) => rs.map((r) => r.id === row.id ? row : r));
	const openEdit = (c) => {
		setEditing(c);
		setEditForm({
			studentName: c.student_name ?? "",
			courseName: c.course_name,
			certificateType: c.certificate_type,
			issuedBy: c.issued_by,
			dateIssued: c.date_issued ?? ""
		});
	};
	const saveEdit = async (e) => {
		e.preventDefault();
		if (!editing || !editForm) return;
		if (!editForm.studentName.trim() || !editForm.courseName.trim() || !editForm.dateIssued.trim()) {
			toast({
				title: "Missing fields",
				description: "Student name, course, and date are required.",
				variant: "destructive"
			});
			return;
		}
		setSaving(true);
		try {
			replaceRow(await update({ data: {
				id: editing.id,
				...editForm
			} }));
			toast({
				title: "Certificate updated",
				description: `${editing.certificate_number} now shows the new details on /verify.`
			});
			setEditing(null);
		} catch (err) {
			toast({
				title: "Update failed",
				description: err.message,
				variant: "destructive"
			});
		} finally {
			setSaving(false);
		}
	};
	const confirmRevoke = async (e) => {
		e.preventDefault();
		if (!revoking) return;
		if (!reason.trim()) {
			toast({
				title: "Reason needed",
				description: "Say why this certificate is being revoked.",
				variant: "destructive"
			});
			return;
		}
		setSaving(true);
		try {
			replaceRow(await setRevoked({ data: {
				id: revoking.id,
				revoke: true,
				reason: reason.trim()
			} }));
			toast({
				title: "Certificate revoked",
				description: `${revoking.certificate_number} no longer verifies on /verify.`
			});
			setRevoking(null);
			setReason("");
		} catch (err) {
			toast({
				title: "Revoke failed",
				description: err.message,
				variant: "destructive"
			});
		} finally {
			setSaving(false);
		}
	};
	const reinstate = async (c) => {
		if (!window.confirm(`Reinstate ${c.certificate_number}? It will verify on /verify again.`)) return;
		try {
			replaceRow(await setRevoked({ data: {
				id: c.id,
				revoke: false
			} }));
			toast({
				title: "Certificate reinstated",
				description: `${c.certificate_number} verifies again.`
			});
		} catch (err) {
			toast({
				title: "Reinstate failed",
				description: err.message,
				variant: "destructive"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-primary" }), " Find and manage certificates"]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						load(query);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
						placeholder: "Certificate number, student name, course or faculty ID",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						"aria-label": "Search certificates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "outline",
						disabled: loading,
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Search"
					})]
				}),
				loading && rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-5 w-5 animate-spin" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground",
					children: "No certificates found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-md border border-border",
					children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 space-y-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-sm font-semibold",
										children: c.certificate_number
									}), c.revoked_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										children: "Revoked"
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm",
									children: [
										c.student_name || "—",
										" · ",
										c.course_name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [c.date_issued || (c.issued_at ? new Date(c.issued_at).toLocaleDateString() : ""), c.revoked_at ? ` · Revoked ${new Date(c.revoked_at).toLocaleDateString()}${c.revoked_reason ? `: ${c.revoked_reason}` : ""}` : ""]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => openEdit(c),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" }), " Edit"]
							}), c.revoked_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => reinstate(c),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Reinstate"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "destructive",
								onClick: () => {
									setRevoking(c);
									setReason("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4" }), " Revoke"]
							})]
						})]
					}, c.id))
				}),
				rows.length === 50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Showing the 50 newest matches. Search to narrow the list."
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editing,
			onOpenChange: (open) => !open && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: saveEdit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Edit ", editing?.certificate_number] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "The certificate number can't change. Saving does not email the graduate." })] }),
					editForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3",
						children: [
							["studentName", "Student Name *"],
							["courseName", "Course *"],
							["certificateType", "Certificate Type"],
							["issuedBy", "Issued By"],
							["dateIssued", "Date Issued *"]
						].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `edit-${key}`,
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
								id: `edit-${key}`,
								value: editForm[key],
								onChange: (e) => setEditForm({
									...editForm,
									[key]: e.target.value
								})
							})]
						}, key))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setEditing(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: saving,
						children: saving ? "Saving..." : "Save changes"
					})] })
				]
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!revoking,
			onOpenChange: (open) => !open && setRevoking(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: confirmRevoke,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						"Revoke ",
						revoking?.certificate_number,
						"?"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Anyone checking it on /verify will be told it has been revoked. You can reinstate it later." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "revoke-reason",
							children: "Reason (only admins see this) *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "revoke-reason",
							value: reason,
							onChange: (e) => setReason(e.target.value),
							maxLength: 500
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setRevoking(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "destructive",
						disabled: saving,
						children: saving ? "Revoking..." : "Revoke certificate"
					})] })
				]
			}) })
		})
	] });
};
var Input = objectType({
	certificateNumber: stringType().trim().min(1).max(100),
	email: stringType().trim().email().max(320).optional()
});
/**
* Admin: after a certificate is issued, email the graduate a Google review
* request. Sent at most once per graduate email address.
*/
var requestGraduateReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("16850a24dd02bbc1875e87f9b496b85cad0d39bd271e191e8dfcf368f9d47def"));
function reviewNote(r) {
	if (!r) return "The Google review email could not be sent.";
	switch (r.status) {
		case "sent": return `Google review request emailed to ${r.email}.`;
		case "already_sent": return `${r.email} was already asked for a review, so no new email went out.`;
		case "no_email": return "No graduate email found, so no review request was sent.";
		case "suppressed": return `${r.email} has unsubscribed or bounced, so no review request was sent.`;
		case "failed": return `The Google review email failed: ${r.error}`;
	}
}
var AdminCertificates = () => {
	const { toast } = useToast();
	const { loading, isAdmin } = useIsStaff();
	const askForReview = useServerFn(requestGraduateReview);
	const [form, setForm] = (0, import_react.useState)({
		certificateNumber: "",
		studentName: "",
		courseName: "",
		certificateType: "Certificate of Achievement",
		issuedBy: "Tech Faculty NG",
		dateIssued: "",
		facultyId: "",
		graduateEmail: ""
	});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [addedCount, setAddedCount] = (0, import_react.useState)(0);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.certificateNumber || !form.studentName || !form.courseName || !form.dateIssued) {
			toast({
				title: "Missing fields",
				description: "Certificate number, student name, course, and date are required.",
				variant: "destructive"
			});
			return;
		}
		setSubmitting(true);
		const { data, error } = await (await getSupabase()).functions.invoke("admin-add-certificate", { body: form });
		const fnError = data?.error;
		if (error || fnError) {
			setSubmitting(false);
			toast({
				title: "Failed to add certificate",
				description: fnError || error?.message || "Unknown error",
				variant: "destructive"
			});
			return;
		}
		const review = await askForReview({ data: {
			certificateNumber: form.certificateNumber.trim(),
			email: form.graduateEmail.trim() || void 0
		} }).catch((e) => ({
			status: "failed",
			error: e.message
		}));
		setSubmitting(false);
		setAddedCount((n) => n + 1);
		toast({
			title: "Certificate added",
			description: `${form.certificateNumber.toUpperCase()} is now verifiable at /verify. ${reviewNote(review)}`
		});
		setForm({
			certificateNumber: "",
			studentName: "",
			courseName: "",
			certificateType: "Certificate of Achievement",
			issuedBy: "Tech Faculty NG",
			dateIssued: "",
			facultyId: "",
			graduateEmail: ""
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "container mx-auto px-4 pt-32 pb-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-3xl space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNav, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-7 w-7 text-primary" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-3xl font-bold",
									children: "Certificate Admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-sm",
									children: "Add certificates so they become verifiable on the public /verify page, and find, correct or revoke existing ones."
								})
							]
						}),
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin" }) : !isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "pt-6 text-center text-sm text-muted-foreground",
							children: "This page is for Tech Faculty admins. Sign in with an admin account to manage certificates."
						}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "flex flex-row items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-5 w-5 text-primary" }), " Add new certificate"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "certificateNumber",
											children: "Certificate Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "certificateNumber",
											placeholder: "TFNG202602",
											value: form.certificateNumber,
											onChange: (e) => setForm({
												...form,
												certificateNumber: e.target.value
											}),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "studentName",
											children: "Student Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "studentName",
											value: form.studentName,
											onChange: (e) => setForm({
												...form,
												studentName: e.target.value
											}),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "courseName",
											children: "Course *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "courseName",
											placeholder: "Fullstack Web Development",
											value: form.courseName,
											onChange: (e) => setForm({
												...form,
												courseName: e.target.value
											}),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "certificateType",
											children: "Certificate Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "certificateType",
											value: form.certificateType,
											onChange: (e) => setForm({
												...form,
												certificateType: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "issuedBy",
											children: "Issued By"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "issuedBy",
											value: form.issuedBy,
											onChange: (e) => setForm({
												...form,
												issuedBy: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "dateIssued",
											children: "Date Issued *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "dateIssued",
											placeholder: "April 01, 2026",
											value: form.dateIssued,
											onChange: (e) => setForm({
												...form,
												dateIssued: e.target.value
											}),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "facultyId",
											children: "Faculty ID (optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
											id: "facultyId",
											placeholder: "auto-generated if blank",
											value: form.facultyId,
											onChange: (e) => setForm({
												...form,
												facultyId: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 md:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "graduateEmail",
												children: "Graduate Email (optional)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input$1, {
												id: "graduateEmail",
												type: "email",
												placeholder: "uses the student's profile email if blank",
												value: form.graduateEmail,
												onChange: (e) => setForm({
													...form,
													graduateEmail: e.target.value
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "We email each graduate once, asking for a Google review."
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: submitting,
								className: "w-full",
								children: submitting ? "Adding..." : "Add Certificate"
							})]
						}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CertificateManager, { refreshKey: addedCount })] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
};
var SplitComponent = AdminCertificates;
//#endregion
export { SplitComponent as component };
