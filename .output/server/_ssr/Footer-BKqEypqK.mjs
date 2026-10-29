import { a as __toESM } from "../_runtime.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as useLocation$1, t as Link$1 } from "./router-compat-DeSPa1fq.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-VUUBE8Tw.mjs";
import { i as mightHaveSession, t as getSupabase } from "./lazy-BHIYDGla.mjs";
import { i as useUser, r as useCurrency } from "./UserContext-uFGsrvio.mjs";
import { E as ShoppingBag, Ht as Check, J as Menu, Nt as Circle, O as ShieldCheck, Qt as BookOpen, Vt as ChevronDown, X as Mail, Xt as BriefcaseBusiness, Y as MapPin, Z as LogOut, in as ArrowRight, kt as Compass, q as MessageCircle, r as X, rt as LayoutDashboard, tt as Linkedin, vt as Facebook, zt as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/Footer-BKqEypqK.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var tech_faculty_logo_default = "/assets/tech-faculty-logo-DcsKkRJI.png";
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-secondary hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
/**
* Server-enforced staff check. The user_roles policies only ever return the
* signed-in user's own rows, so this cannot be spoofed from the client — and
* every write is guarded again by RLS on the server.
*/
function useIsStaff() {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isStaff, setIsStaff] = (0, import_react.useState)(false);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const notStaff = () => {
				if (active) {
					setIsStaff(false);
					setIsAdmin(false);
					setLoading(false);
				}
			};
			if (!mightHaveSession()) return notStaff();
			const supabase = await getSupabase();
			const { data: auth } = await supabase.auth.getUser();
			if (!auth.user) return notStaff();
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id);
			if (!active) return;
			const roles = (data ?? []).map((r) => r.role);
			setIsAdmin(roles.includes("admin"));
			setIsStaff(roles.includes("admin") || roles.includes("recruiter"));
			setLoading(false);
		})();
		return () => {
			active = false;
		};
	}, []);
	return {
		loading,
		isStaff,
		isAdmin
	};
}
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-[state=open]:bg-accent focus:bg-accent", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto h-4 w-4" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var CurrencyToggle = () => {
	const { currencyCode, toggleCurrency } = useCurrency();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		size: "sm",
		onClick: toggleCurrency,
		className: "text-xs font-semibold gap-1 px-2",
		title: "Toggle currency",
		children: [
			currencyCode === "NGN" ? "🇳🇬" : "🌍",
			" ",
			currencyCode
		]
	});
};
var navGroups = [
	{
		label: "Programmes",
		icon: BookOpen,
		items: [
			{
				label: "Departments",
				description: "Explore our training courses",
				href: "/departments"
			},
			{
				label: "SIWES / IT placements",
				href: "/siwes"
			},
			{
				label: "Virtual SIWES (online IT)",
				href: "/virtual-siwes"
			},
			{
				label: "SIWES Success Kit",
				href: "/siwes-success-kit"
			}
		]
	},
	{
		label: "Explore",
		icon: Compass,
		items: [
			{
				label: "Careers",
				href: "/careers"
			},
			{
				label: "Events",
				href: "/events"
			},
			{
				label: "Tech hubs directory",
				href: "/hubs"
			}
		]
	},
	{
		label: "Resources",
		icon: BriefcaseBusiness,
		items: [
			{
				label: "Blog",
				href: "/blog"
			},
			{
				label: "Products",
				href: "/products"
			},
			{
				label: "Tech Store",
				href: "/tech-store"
			},
			{
				label: "Business partnerships",
				href: "/business-partnerships"
			},
			{
				label: "School collaborations",
				href: "/school-collaborations"
			}
		]
	}
];
var directLinks = [
	{
		label: "Home",
		href: "/"
	},
	{
		label: "Locations",
		href: "/locations",
		icon: MapPin
	},
	{
		label: "About",
		href: "/about"
	}
];
var Header = () => {
	const [isVisible, setIsVisible] = (0, import_react.useState)(true);
	const [lastScrollY, setLastScrollY] = (0, import_react.useState)(0);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const location = useLocation$1();
	const { isLoggedIn, logout } = useUser();
	const { isStaff } = useIsStaff();
	(0, import_react.useEffect)(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const currentScrollY = window.scrollY;
					if (Math.abs(currentScrollY - lastScrollY) > 5) {
						if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
						else if (currentScrollY < lastScrollY) setIsVisible(true);
						setLastScrollY(currentScrollY);
					}
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);
	const handleNavClick = (href) => {
		setMobileOpen(false);
		if (href.startsWith("/#")) {
			const id = href.replace("/#", "");
			if (location.pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
		}
	};
	const handleSignUpClick = () => {
		setMobileOpen(false);
		if (location.pathname === "/") document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
		else window.location.href = "/#get-started";
	};
	const isActive = (href) => {
		if (href === "/") return location.pathname === "/";
		if (href.startsWith("/#")) return false;
		return location.pathname === href || location.pathname.startsWith(`${href}/`);
	};
	const isGroupActive = (items) => items.some((item) => isActive(item.href));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: `fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container mx-auto px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-16 items-center justify-between gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
						to: "/",
						className: "flex min-w-0 shrink items-center gap-2 sm:gap-2.5",
						"aria-label": "Tech Faculty home",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: tech_faculty_logo_default,
							alt: "",
							className: "h-8 w-8 shrink-0 sm:h-9 sm:w-9"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-bold leading-tight sm:text-base",
								children: "Tech Faculty"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[9px] leading-tight text-muted-foreground sm:text-[10px]",
								children: "Train, Certify and Employ"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden min-w-0 flex-1 items-center justify-end gap-0.5 lg:flex",
						"aria-label": "Main navigation",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: isActive("/") ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/",
									children: "Home"
								})
							}),
							navGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: `gap-1 ${isGroupActive(group.items) ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"}`,
									children: [
										group.label,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" })
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
								align: "start",
								className: "w-64 p-1.5",
								children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									className: "p-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
										to: item.href,
										className: `flex w-full flex-col items-start rounded-sm px-3 py-2.5 ${isActive(item.href) ? "bg-muted font-semibold text-foreground" : ""}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), "description" in item && item.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground",
											children: item.description
										}) : null]
									})
								}, item.href))
							})] }, group.label)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: `gap-1.5 ${isActive("/locations") ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: "/locations",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), " Locations"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								size: "sm",
								className: isActive("/about") ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/about",
									children: "About"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-2 flex items-center gap-1 border-l border-border pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyToggle, {}), isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "ghost",
										className: `gap-1 ${isActive("/admin") ? "bg-muted font-semibold" : ""}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/admin",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 14 }), " Admin"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "ghost",
										className: "gap-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
											to: "/dashboard",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 14 }), " Dashboard"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: logout,
										className: "gap-1",
										children: ["Log Out ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 14 })]
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: handleSignUpClick,
									className: "ml-1 gap-1",
									children: ["Sign Up Free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open: mobileOpen,
							onOpenChange: setMobileOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Open navigation menu",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 22 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: "Open navigation menu"
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "right",
								className: "w-[min(22rem,88vw)] overflow-y-auto px-4 pt-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-5 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
										className: "text-base font-bold",
										children: "Menu"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Learn, explore and connect"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
									className: "flex flex-col gap-5 pb-8",
									"aria-label": "Mobile navigation",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-2",
											children: directLinks.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												variant: isActive(link.href) ? "secondary" : "outline",
												className: "h-11 justify-start gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
													to: link.href,
													onClick: () => handleNavClick(link.href),
													children: [link.icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(link.icon, { className: "h-4 w-4" }) : null, link.label]
												})
											}, link.href))
										}),
										navGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-1.5 flex items-center gap-2 px-2 text-xs font-semibold uppercase text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(group.icon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: group.label })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-0.5",
											children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												variant: "ghost",
												className: `h-10 w-full justify-start px-3 ${isActive(item.href) ? "bg-muted font-semibold text-foreground" : "text-foreground"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
													to: item.href,
													onClick: () => setMobileOpen(false),
													children: [item.label === "Tech Store" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }) : null, item.label]
												})
											}, item.href))
										})] }, group.label)),
										isLoggedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 border-t border-border pt-4",
											children: [
												isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													variant: "outline",
													className: "w-full justify-start gap-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
														to: "/admin",
														onClick: () => setMobileOpen(false),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 16 }), " Admin"]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													variant: "outline",
													className: "w-full justify-start gap-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
														to: "/dashboard",
														onClick: () => setMobileOpen(false),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { size: 16 }), " Dashboard"]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													onClick: () => {
														setMobileOpen(false);
														logout();
													},
													className: "w-full gap-1",
													children: ["Log Out ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 14 })]
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: handleSignUpClick,
											className: "h-11 w-full gap-1",
											children: ["Sign Up Free ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
										})
									]
								})]
							})]
						})]
					})
				]
			})
		})
	});
};
var Footer = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "py-16 px-4 border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-10 mb-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-bold",
								children: "Tech Faculty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Get trained, certified, and employed."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://x.com/TechFacultyNG",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-muted-foreground hover:text-primary transition-colors",
										"aria-label": "X (Twitter)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "18",
											height: "18",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 4l11.733 16h4.267l-11.733 -16z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://facebook.com/TechFacultyNG",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-muted-foreground hover:text-primary transition-colors",
										"aria-label": "Facebook",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { size: 18 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://www.linkedin.com/company/techfaculty",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-muted-foreground hover:text-primary transition-colors",
										"aria-label": "LinkedIn",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { size: 18 })
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold",
							children: "Training"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-col gap-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/departments",
									className: "hover:text-primary transition-colors",
									children: "Departments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/locations",
									className: "hover:text-primary transition-colors",
									children: "Campus Locations"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/study-online-africa",
									className: "hover:text-primary transition-colors",
									children: "Study Online from Africa"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/hubs",
									className: "hover:text-primary transition-colors",
									children: "Tech Hubs Directory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/talent",
									className: "hover:text-primary transition-colors",
									children: "Talent Pool"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/hire",
									className: "hover:text-primary transition-colors",
									children: "Hire Talent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/#pricing",
									className: "hover:text-primary transition-colors",
									children: "Pricing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/#get-started",
									className: "hover:text-primary transition-colors",
									children: "Get Started"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-semibold",
								children: "Services"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex flex-col gap-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/business-partnerships",
										className: "hover:text-primary transition-colors",
										children: "Business Partnerships"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/school-collaborations",
										className: "hover:text-primary transition-colors",
										children: "School Collaborations"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/events",
										className: "hover:text-primary transition-colors",
										children: "Events"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/siwes",
										className: "hover:text-primary transition-colors",
										children: "Internships"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/siwes/courses",
										className: "hover:text-primary transition-colors",
										children: "SIWES by Course"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/virtual-siwes",
										className: "hover:text-primary transition-colors",
										children: "Virtual SIWES (Online IT)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
										to: "/siwes-success-kit",
										className: "hover:text-primary transition-colors",
										children: "SIWES Success Kit"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-semibold pt-4",
								children: "Partners"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex flex-col gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/tinypeople",
									className: "hover:text-primary transition-colors",
									children: "Tiny People AI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/lovable",
									className: "hover:text-primary transition-colors",
									children: "Lovable"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold",
							children: "Company"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex flex-col gap-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/about",
									className: "hover:text-primary transition-colors",
									children: "About"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/outcomes",
									className: "hover:text-primary transition-colors",
									children: "Student Outcomes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/reports/nigeria-tech-salaries",
									className: "hover:text-primary transition-colors",
									children: "Tech Salary Report"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/blog",
									className: "hover:text-primary transition-colors",
									children: "Blog"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/careers",
									className: "hover:text-primary transition-colors",
									children: "Careers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, {
									to: "/products",
									className: "hover:text-primary transition-colors",
									children: "Products"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/verify",
									className: "hover:text-primary transition-colors",
									children: "Verify Certificate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link$1, {
									to: "/tech-store",
									className: "hover:text-primary transition-colors flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { size: 14 }), " Tech Store"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "mailto:thetechfaculty@gmail.com",
									className: "hover:text-primary transition-colors flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { size: 14 }), " Email Us"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://wa.me/2348068597140",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "hover:text-primary transition-colors flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { size: 14 }), " WhatsApp"]
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border pt-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"© Tech Faculty ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						". All rights reserved."
					]
				})
			})]
		})
	});
};
//#endregion
export { Footer as a, useIsStaff as c, DropdownMenuTrigger as i, DropdownMenuContent as n, Header as o, DropdownMenuItem as r, tech_faculty_logo_default as s, DropdownMenu as t };
