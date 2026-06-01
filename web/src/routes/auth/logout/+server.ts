import { clearSessionCookie, sanitizeLocalPath } from '$lib/auth/session.server';
import { clearAdminDriveTokenCookie } from '$lib/google-drive/tokenStore.server';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies, url }) => {
	clearSessionCookie(cookies);
	clearAdminDriveTokenCookie();

	throw redirect(302, sanitizeLocalPath(url.searchParams.get('next')));
};
