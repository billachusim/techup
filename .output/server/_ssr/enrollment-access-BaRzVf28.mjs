//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/enrollment-access-BaRzVf28.js
var FREE_PLAN_NAMES = ["Bootcamp Starter", "Free Bootcamp"];
var PAID_UP_STATUSES = ["active", "confirmed"];
function isFreePlan(planName) {
	return FREE_PLAN_NAMES.includes(planName);
}
function grantsAccess(enrollment) {
	if (enrollment.status === "cancelled") return false;
	return isFreePlan(enrollment.plan_name) || PAID_UP_STATUSES.includes(enrollment.status);
}
/** The newest enrolment that grants access. Pass rows newest first. */
function accessEnrollment(rows) {
	return (rows ?? []).find(grantsAccess) ?? null;
}
/** The newest enrolment, when it is a paid plan still waiting on payment. */
function awaitingPayment(rows) {
	const latest = (rows ?? [])[0];
	return latest && latest.status === "pending" && !isFreePlan(latest.plan_name) ? latest : null;
}
//#endregion
export { isFreePlan as i, awaitingPayment as n, grantsAccess as r, accessEnrollment as t };
