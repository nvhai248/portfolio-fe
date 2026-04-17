import { resolveLocale } from '$lib/i18n/locale';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { sendContactEmail } from '$lib/services/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const locale = resolveLocale(params.lang);
	return {
		locale,
		pathname: url.pathname
	};
};

const contactSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	subject: z.string().min(1),
	message: z.string().min(1)
});

export const actions: Actions = {
	send: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const data = contactSchema.parse(formData);
			await sendContactEmail(data);
			return { success: true };
		} catch (error) {
			console.error('Contact form submission failed:', error);
			if (error instanceof z.ZodError) {
				return fail(400, { errors: error.flatten().fieldErrors });
			}
			return fail(500, { message: 'Internal server error' });
		}
	}
};
