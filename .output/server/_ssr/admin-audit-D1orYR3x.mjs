//#region ../../../tmp/claude-0/-home-claude-techup/6ef4cad5-0fa7-5b2a-928f-84af921f0d32/scratchpad/deps/node_modules/.nitro/vite/services/ssr/assets/admin-audit-D1orYR3x.js
/**
* Writes a row to the admin activity log for an action done with the service key.
* The audit triggers can't see who did these (auth.uid() is empty), so the server
* code records the acting admin itself. Never fails the action it describes.
*/
async function recordAdminAction(admin, actorId, entry) {
	try {
		const { data: actor } = await admin.auth.admin.getUserById(actorId);
		const { error } = await admin.from("admin_audit_log").insert({
			...entry,
			actor_id: actorId,
			actor_email: actor?.user?.email ?? null
		});
		if (error) console.error("Couldn't write admin audit log", error.message);
	} catch (err) {
		console.error("Couldn't write admin audit log", err);
	}
}
//#endregion
export { recordAdminAction as t };
