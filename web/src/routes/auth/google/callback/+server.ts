import { dev } from '$app/environment';
import { createSessionUser, exchangeGoogleCode, fetchGoogleProfile } from '$lib/auth/google.server';
import { sanitizeLocalPath, setSessionCookie } from '$lib/auth/session.server';
import { persistAdminDriveToken } from '$lib/google-drive/tokenStore.server';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

const STATE_COOKIE = 'google_oauth_state';
const NEXT_COOKIE = 'google_oauth_next';

const oauthCookieOptions = {
	httpOnly: true,
	path: '/',
	sameSite: 'lax' as const,
	secure: !dev
};

export const GET: RequestHandler = async ({ cookies, url }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expectedState = cookies.get(STATE_COOKIE);
	const next = sanitizeLocalPath(cookies.get(NEXT_COOKIE) ?? null);

	cookies.delete(STATE_COOKIE, oauthCookieOptions);
	cookies.delete(NEXT_COOKIE, oauthCookieOptions);

	if (!code || !state || !expectedState || state !== expectedState) {
		throw error(400, 'Invalid Google OAuth callback.');
	}

	const token = await exchangeGoogleCode(url.origin, code);
	const profile = await fetchGoogleProfile(token.access_token);
	const user = createSessionUser(profile);

	if (user.isAdmin) {
		await persistAdminDriveToken(token);
	}

	await setSessionCookie(cookies, user);

	throw redirect(302, next);
};
