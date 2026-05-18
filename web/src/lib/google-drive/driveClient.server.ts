import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { readAdminDriveToken, writeAdminDriveToken, type AdminDriveToken } from './tokenStore.server';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_API_BASE_URL = 'https://www.googleapis.com/drive/v3';
const GOOGLE_API_ORIGIN = 'https://www.googleapis.com';
const ACCESS_TOKEN_REFRESH_WINDOW_MS = 60_000;

const getGoogleConfig = () => {
	const clientId = env.GOOGLE_CLIENT_ID;
	const clientSecret = env.GOOGLE_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw error(500, 'Google OAuth is not configured.');
	}

	return { clientId, clientSecret };
};

const refreshAdminDriveToken = async (token: AdminDriveToken): Promise<AdminDriveToken> => {
	if (!token.refreshToken) {
		throw error(428, 'Google Drive is not connected. Sign in with Google as the admin again.');
	}

	const { clientId, clientSecret } = getGoogleConfig();
	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'refresh_token',
			refresh_token: token.refreshToken
		})
	});

	const refreshedToken = (await response.json()) as {
		access_token?: string;
		expires_in?: number;
		scope?: string;
		token_type?: string;
		error_description?: string;
	};

	if (!response.ok || !refreshedToken.access_token) {
		throw error(428, refreshedToken.error_description || 'Google Drive token refresh failed.');
	}

	const nextToken: AdminDriveToken = {
		accessToken: refreshedToken.access_token,
		refreshToken: token.refreshToken,
		scope: refreshedToken.scope || token.scope,
		tokenType: refreshedToken.token_type || token.tokenType,
		expiresAt: Date.now() + (refreshedToken.expires_in ?? 3600) * 1000
	};

	await writeAdminDriveToken(nextToken);

	return nextToken;
};

export const getAdminDriveAccessToken = async (forceRefresh = false): Promise<string> => {
	const token = await readAdminDriveToken();

	if (!token) {
		throw error(428, 'Google Drive is not connected. Sign in with Google as the admin first.');
	}

	if (forceRefresh || token.expiresAt - ACCESS_TOKEN_REFRESH_WINDOW_MS <= Date.now()) {
		return (await refreshAdminDriveToken(token)).accessToken;
	}

	return token.accessToken;
};

const parseDriveError = async (response: Response): Promise<string> => {
	try {
		const payload = (await response.json()) as { error?: { message?: string }; message?: string };

		return payload.error?.message || payload.message || response.statusText;
	} catch {
		return response.statusText;
	}
};

const requestWithAccessToken = async (url: URL, init: RequestInit, accessToken: string) =>
	fetch(url, {
		...init,
		headers: {
			...(init.headers || {}),
			authorization: `Bearer ${accessToken}`
		}
	});

export const driveFetch = async (path: string, init: RequestInit = {}, forceRefresh = false): Promise<Response> => {
	const url = new URL(path.startsWith('/upload/') ? `${GOOGLE_API_ORIGIN}${path}` : `${DRIVE_API_BASE_URL}${path}`);
	const accessToken = await getAdminDriveAccessToken(forceRefresh);
	let response = await requestWithAccessToken(url, init, accessToken);

	if (response.status === 401 && !forceRefresh) {
		const refreshedAccessToken = await getAdminDriveAccessToken(true);
		response = await requestWithAccessToken(url, init, refreshedAccessToken);
	}

	if (!response.ok) {
		throw error(response.status, await parseDriveError(response));
	}

	return response;
};
