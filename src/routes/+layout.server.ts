import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.session.user,
		featureFlags: locals.featureFlags,
	};
};