import { a as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as NGN_TO_USD_RATE } from "./fees-B-53IxaZ.mjs";
import { a as onSupabaseLoaded, i as mightHaveSession, n as isAuthStorageKey, r as isSupabaseLoaded, t as getSupabase } from "./lazy-BHIYDGla.mjs";
//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/UserContext-uFGsrvio.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var CurrencyContext = (0, import_react.createContext)({
	symbol: "₦",
	currencyCode: "NGN",
	isNigeria: true,
	convertPrice: (amount) => amount,
	formatPrice: (amount) => `₦${amount.toLocaleString()}`,
	toggleCurrency: () => {}
});
var CurrencyProvider = ({ children }) => {
	const [isNigeria, setIsNigeria] = (0, import_react.useState)(true);
	const [manualOverride, setManualOverride] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (manualOverride) return;
		const detectCountry = async () => {
			try {
				const data = await (await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5e3) })).json();
				if (data.country_code && data.country_code !== "NG") setIsNigeria(false);
			} catch {
				setIsNigeria(true);
			}
		};
		detectCountry();
	}, [manualOverride]);
	const toggleCurrency = () => {
		setManualOverride(true);
		setIsNigeria((prev) => !prev);
	};
	const convertPrice = (ngnAmount) => {
		if (isNigeria || ngnAmount === 0) return ngnAmount;
		return Math.round(ngnAmount / NGN_TO_USD_RATE);
	};
	const formatPrice = (ngnAmount) => {
		if (ngnAmount === 0) return isNigeria ? "₦0" : "$0";
		if (isNigeria) return `₦${ngnAmount.toLocaleString()}`;
		return `$${Math.round(ngnAmount / NGN_TO_USD_RATE).toLocaleString()}`;
	};
	const symbol = isNigeria ? "₦" : "$";
	const currencyCode = isNigeria ? "NGN" : "USD";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyContext.Provider, {
		value: {
			symbol,
			currencyCode,
			isNigeria,
			convertPrice,
			formatPrice,
			toggleCurrency
		},
		children
	});
};
var useCurrency = () => (0, import_react.useContext)(CurrencyContext);
var UserContext = (0, import_react.createContext)(void 0);
var UserProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = (0, import_react.useState)(false);
	const [facultyId, setFacultyId] = (0, import_react.useState)(null);
	const [userData, setUserData] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	(0, import_react.useEffect)(() => {
		let unsubscribe;
		const stopWaiting = onSupabaseLoaded((supabase) => {
			supabase.auth.getSession().then(({ data: { session } }) => {
				if (session?.user) {
					setUser(session.user);
					setIsLoggedIn(true);
					supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data: profile }) => {
						if (profile) {
							setFacultyId(profile.faculty_id);
							setUserData(profile);
						}
					});
				}
			});
			const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
				if (session?.user) {
					setUser(session.user);
					setIsLoggedIn(true);
					supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data: profile }) => {
						if (profile) {
							setFacultyId(profile.faculty_id);
							setUserData(profile);
						}
					});
				} else {
					setUser(null);
					setIsLoggedIn(false);
					setFacultyId(null);
					setUserData(null);
				}
			});
			unsubscribe = () => subscription.unsubscribe();
		});
		const onStorage = (event) => {
			if (isAuthStorageKey(event.key) && event.newValue) getSupabase();
		};
		window.addEventListener("storage", onStorage);
		return () => {
			stopWaiting();
			unsubscribe?.();
			window.removeEventListener("storage", onStorage);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isSupabaseLoaded() && mightHaveSession()) getSupabase();
	}, [pathname]);
	const login = (authUser, profile) => {
		setUser(authUser);
		setFacultyId(profile.faculty_id);
		setUserData(profile);
		setIsLoggedIn(true);
	};
	const logout = async () => {
		await (await getSupabase()).auth.signOut();
		setUser(null);
		setFacultyId(null);
		setUserData(null);
		setIsLoggedIn(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserContext.Provider, {
		value: {
			isLoggedIn,
			facultyId,
			userData,
			user,
			setUserData,
			login,
			logout
		},
		children
	});
};
var useUser = () => {
	const context = (0, import_react.useContext)(UserContext);
	if (context === void 0) throw new Error("useUser must be used within a UserProvider");
	return context;
};
//#endregion
export { useUser as i, UserProvider as n, useCurrency as r, CurrencyProvider as t };
