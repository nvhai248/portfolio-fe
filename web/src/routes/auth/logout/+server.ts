import { clearSessionCookie, sanitizeLocalPath } from '$lib/auth/session.server';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies, url }) => {
	clearSessionCookie(cookies);

	throw redirect(302, sanitizeLocalPath(url.searchParams.get('next')));
};

