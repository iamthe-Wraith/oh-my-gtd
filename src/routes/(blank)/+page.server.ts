import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthService } from '$lib/services/auth';
import { ApiError } from '$lib/utils/api-error';
import { ApiResponse } from '$lib/utils/api-response';
import { WaitlistService } from '$lib/services/waitlist';

export const actions: Actions = {
    joinWaitlist: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email')! as string;

        const waitlistService = new WaitlistService();

        try {
            await waitlistService.join(email);
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    signin: async ({ request, cookies }) => {
        const authService = new AuthService(cookies);

        const data = await request.formData();
        const emailOrUsername = data.get('email_or_username')! as string;
        const password = data.get('password')! as string;

        try {
            await authService.signin({ emailOrUsername, password });
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    },
    signout: async ({ locals, cookies }) => {
        locals.session?.delete(cookies);
        redirect(302, '/');
    },
	signup: async ({ request, cookies, locals }) => {
        const authService = new AuthService(cookies);

		const data = await request.formData();
		const email = data.get('email')! as string;
        const username = data.get('username')! as string;
		const password = data.get('password')! as string;

        try {
            await authService.signup({ email, username, password }, locals.featureFlags);
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
	},
};