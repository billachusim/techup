import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { $ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as useToast } from "./use-toast-DIJoD3Kd.mjs";
import { t as Input } from "./input-NDzQLmvT.mjs";
import { t as Label } from "./label-qSgNmrl1.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/LoginForm-BlYf1i3R.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var loadLovable = () => Promise.all([import("./lovable-Ct9yZuJj.mjs"), getSupabase()]).then(([m]) => m.lovable);
var GoogleAuthButton = ({ label = "Continue with Google", onSuccess }) => {
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const { toast } = useToast();
	(0, import_react.useEffect)(() => {
		loadLovable().catch(() => {});
	}, []);
	const handleClick = async () => {
		setIsLoading(true);
		const result = await (await loadLovable()).auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
		if (result.error) {
			setIsLoading(false);
			toast({
				title: "Google sign-in failed",
				description: result.error.message || "Please try again or use your email and password.",
				variant: "destructive"
			});
			return;
		}
		if (result.redirected) return;
		setIsLoading(false);
		onSuccess?.();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		className: "w-full gap-2",
		onClick: handleClick,
		disabled: isLoading,
		children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "h-4 w-4",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#4285F4",
					d: "M23.5 12.3c0-.9-.1-1.7-.2-2.5H12v4.8h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.9z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#34A853",
					d: "M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.3v3.1A12 12 0 0 0 12 24z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#FBBC05",
					d: "M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#EA4335",
					d: "M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z"
				})
			]
		}), label]
	});
};
var SignupForm = ({ onSuccess }) => {
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		email: "",
		password: "",
		location: ""
	});
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [emailSent, setEmailSent] = (0, import_react.useState)(false);
	const { toast } = useToast();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
			toast({
				title: "Check your details",
				description: "Please enter your name and a valid email address.",
				variant: "destructive"
			});
			return;
		}
		if (formData.password.length < 6) {
			toast({
				title: "Weak password",
				description: "Use at least 6 characters.",
				variant: "destructive"
			});
			return;
		}
		setIsLoading(true);
		try {
			const { data, error } = await (await getSupabase()).auth.signUp({
				email: formData.email.trim(),
				password: formData.password,
				options: {
					emailRedirectTo: window.location.origin,
					data: {
						full_name: formData.name.trim(),
						...formData.location.trim() ? { location: formData.location.trim().slice(0, 160) } : {}
					}
				}
			});
			if (error) throw error;
			if (data.session) {
				toast({
					title: "Welcome to Tech Faculty!",
					description: "Your account is ready."
				});
				onSuccess();
				return;
			}
			setEmailSent(true);
		} catch (error) {
			console.error("Signup error:", error);
			toast({
				title: "Could not create your account",
				description: error instanceof Error ? error.message : "Please try again.",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};
	if (emailSent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded-lg border border-border bg-muted/40 p-4 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium text-foreground",
			children: "Check your email"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"We sent a confirmation link to ",
				formData.email.trim(),
				". Click it to finish creating your account, then sign in."
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleAuthButton, {
				label: "Sign up with Google",
				onSuccess
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "or"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "signup-name",
						children: "Full name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "signup-name",
						value: formData.name,
						onChange: (e) => setFormData({
							...formData,
							name: e.target.value
						}),
						placeholder: "John Doe",
						maxLength: 100,
						autoComplete: "name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						htmlFor: "signup-location",
						children: ["City / State ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "(optional)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "signup-location",
						value: formData.location,
						onChange: (e) => setFormData({
							...formData,
							location: e.target.value
						}),
						placeholder: "e.g. Nnewi, Anambra",
						maxLength: 160,
						autoComplete: "address-level2"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "signup-email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "signup-email",
						type: "email",
						value: formData.email,
						onChange: (e) => setFormData({
							...formData,
							email: e.target.value
						}),
						placeholder: "john@example.com",
						maxLength: 255,
						autoComplete: "email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "signup-password",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "signup-password",
						type: "password",
						value: formData.password,
						onChange: (e) => setFormData({
							...formData,
							password: e.target.value
						}),
						placeholder: "Minimum 6 characters",
						minLength: 6,
						autoComplete: "new-password"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: isLoading,
						children: isLoading ? "Creating account..." : "Create account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "You only need these details to get in. We ask for more when you build a talent profile or send a hiring brief."
					})
				]
			})
		]
	});
};
var LoginForm = ({ onSuccess, onForgotPassword }) => {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const { toast } = useToast();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) {
			toast({
				title: "Missing Credentials",
				description: "Please enter your email and password.",
				variant: "destructive"
			});
			return;
		}
		setIsLoading(true);
		try {
			const { data, error } = await (await getSupabase()).auth.signInWithPassword({
				email: email.trim(),
				password
			});
			if (error) throw error;
			toast({
				title: "Welcome Back!",
				description: "You've been signed in successfully."
			});
			onSuccess();
		} catch (error) {
			console.error("Login error:", error);
			toast({
				title: "Login Failed",
				description: error instanceof Error && error.message || "Invalid email or password.",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleAuthButton, {
				label: "Continue with Google",
				onSuccess
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "or"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "login-email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "login-email",
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "john@example.com",
						autoComplete: "email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "login-password",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "login-password",
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Enter your password",
						autoComplete: "current-password"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onForgotPassword,
							className: "text-sm text-primary hover:underline",
							children: "Forgot your password?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: isLoading,
						children: isLoading ? "Signing In..." : "Sign In"
					})
				]
			})
		]
	});
};
//#endregion
export { SignupForm as n, LoginForm as t };
