import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { SessionUser } from './types';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

const scopes = [
	'openid',
	'email',
	'profile',
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/drive.file'
];

type GoogleTokenResponse = {
	access_token?: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
	token_type?: string;
	id_token?: string;
	error?: string;
	error_description?: string;
};

type GoogleAccessTokenResponse = GoogleTokenResponse & {
	access_token: string;
};

type GoogleProfile = {
	sub?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	picture?: string;
};

const getGoogleConfig = () => {
	const clientId = env.GOOGLE_CLIENT_ID;
	const clientSecret = env.GOOGLE_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw error(500, 'Google OAuth is not configured.');
	}

	return { clientId, clientSecret };
};

const getRedirectUri = (origin: string) => `${origin}/auth/google/callback`;

export const buildGoogleAuthUrl = (origin: string, state: string): string => {
	const { clientId } = getGoogleConfig();

	const url = new URL(GOOGLE_AUTH_URL);
	url.searchParams.set('client_id', clientId);
	url.searchParams.set('redirect_uri', getRedirectUri(origin));
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('scope', scopes.join(' '));
	url.searchParams.set('state', state);
	url.searchParams.set('access_type', 'offline');
	url.searchParams.set('prompt', 'consent');

	return url.toString();
};

export const exchangeGoogleCode = async (origin: string, code: string): Promise<GoogleAccessTokenResponse> => {
	const { clientId, clientSecret } = getGoogleConfig();

	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			grant_type: 'authorization_code',
			redirect_uri: getRedirectUri(origin)
		})
	});

	const token = (await response.json()) as GoogleTokenResponse;

	if (!response.ok || !token.access_token) {
		throw error(400, token.error_description || 'Unable to complete Google login.');
	}

	return token as GoogleAccessTokenResponse;
};

export const fetchGoogleProfile = async (accessToken: string): Promise<GoogleProfile> => {
	const response = await fetch(GOOGLE_USERINFO_URL, {
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		throw error(400, 'Unable to fetch Google profile.');
	}

	const profile = (await response.json()) as GoogleProfile;

	if (!profile.sub || !profile.email || profile.email_verified === false) {
		throw error(403, 'Google account email is not verified.');
	}

	return profile;
};

export const createSessionUser = (profile: GoogleProfile): SessionUser => {
	const email = profile.email?.toLowerCase();
	const adminEmail = env.ADMIN_GOOGLE_USER?.toLowerCase();

	if (!profile.sub || !email) {
		throw error(400, 'Google profile is missing required identity fields.');
	}

	return {
		id: profile.sub,
		email,
		name: profile.name,
		picture: profile.picture,
		isAdmin: Boolean(adminEmail && email === adminEmail)
	};
};
