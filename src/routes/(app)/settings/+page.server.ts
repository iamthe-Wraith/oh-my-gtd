import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from "./$types";
import { HttpStatus } from '$lib/constants/error';
import { UserService } from '$lib/services/user';
import { ApiResponse } from '$lib/utils/api-response';
import { ApiError } from '$lib/utils/api-error';
import { Session } from '$lib/services/session';

export const actions: Actions = {
    updateUserInfo: async ({ request, locals, cookies }) => {
        if (!locals.session.user) return fail(HttpStatus.UNAUTHORIZED, { errors: ['Unauthorized'] });

        const data = await request.formData();
        const username = data.get('username')! as string;
        const email = data.get('email')! as string;

        const userService = new UserService({ user: locals.session.user });

        try {
            const user = await userService.update({ username, email });
            if (!user) throw new ApiError('User not found.', HttpStatus.NOT_FOUND, 'user');

            const session = new Session();
            await session.save(user);
            session.setCookie(cookies);
            await session.loadUser();

            return { user: session.user };
        } catch (err) {
            const response = new ApiResponse({ errors: ApiError.parse(err) });
            return fail(response.statusCode, { errors: response.errors });
        }
    }
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session.user) redirect(303, '/?signin=true');

    return {};
};