import { dev } from '$app/environment';
import { buildGoogleAuthUrl } from '$lib/auth/google.server';
import { sanitizeLocalPath } from '$lib/auth/session.server';
import { redirect, type RequestHandler } from '@sveltejs/kit';

const STATE_COOKIE = 'google_oauth_state';
const NEXT_COOKIE = 'google_oauth_next';
const STATE_MAX_AGE = 60 * 10;

const oauthCookieOptions = {
	httpOnly: true,
	path: '/',
	sameSite: 'lax' as const,
	secure: !dev,
	maxAge: STATE_MAX_AGE
};

export const GET: RequestHandler = ({ cookies, url }) => {
	const state = crypto.randomUUID();
	const next = sanitizeLocalPath(url.searchParams.get('next'));

	cookies.set(STATE_COOKIE, state, oauthCookieOptions);
	cookies.set(NEXT_COOKIE, next, oauthCookieOptions);

	throw redirect(302, buildGoogleAuthUrl(url.origin, state));
};
