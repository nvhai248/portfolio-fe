import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import type { SessionUser } from './types';

const SESSION_COOKIE = 'portfolio_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type SessionPayload = {
	user: SessionUser;
	expiresAt: number;
};

const cookieOptions = {
	httpOnly: true,
	path: '/',
	sameSite: 'lax' as const,
	secure: !dev
};

const getSessionSecret = () => {
	if (!env.SESSION_SECRET) {
		throw new Error('SESSION_SECRET is not configured.');
	}

	return env.SESSION_SECRET;
};

const toBase64Url = (bytes: Uint8Array): string => {
	let binary = '';

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const fromBase64Url = (value: string): Uint8Array => {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}

	return bytes;
};

const sign = async (payload: string): Promise<string> => {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(getSessionSecret()),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));

	return toBase64Url(new Uint8Array(signature));
};

const signaturesMatch = (left: string, right: string): boolean => {
	if (left.length !== right.length) return false;

	let mismatch = 0;

	for (let index = 0; index < left.length; index += 1) {
		mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
	}

	return mismatch === 0;
};

export const sanitizeLocalPath = (path: string | null): string => {
	if (!path || !path.startsWith('/') || path.startsWith('//')) return '/';
	if (path.startsWith('/auth/google/callback')) return '/';

	return path;
};

export const createSessionToken = async (user: SessionUser): Promise<string> => {
	const payloadBody: SessionPayload = {
		user,
		expiresAt: Date.now() + SESSION_MAX_AGE * 1000
	};
	const payload = toBase64Url(encoder.encode(JSON.stringify(payloadBody)));
	const signature = await sign(payload);

	return `${payload}.${signature}`;
};

export const readSessionUser = async (cookies: Cookies): Promise<SessionUser | null> => {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return null;

	const [payload, signature] = token.split('.');
	if (!payload || !signature) return null;

	try {
		const expectedSignature = await sign(payload);
		if (!signaturesMatch(signature, expectedSignature)) return null;

		const parsed = JSON.parse(decoder.decode(fromBase64Url(payload))) as SessionPayload;
		if (!parsed.user || parsed.expiresAt <= Date.now()) return null;

		// Sliding session: if the session is older than 1 day (i.e. remaining time is less than 29 days),
		// refresh the session cookie to extend the session.
		const remainingTime = parsed.expiresAt - Date.now();
		const refreshThreshold = (SESSION_MAX_AGE - 24 * 60 * 60) * 1000;
		if (remainingTime < refreshThreshold) {
			await setSessionCookie(cookies, parsed.user);
		}

		return parsed.user;
	} catch {
		return null;
	}
};

export const setSessionCookie = async (cookies: Cookies, user: SessionUser) => {
	cookies.set(SESSION_COOKIE, await createSessionToken(user), {
		...cookieOptions,
		maxAge: SESSION_MAX_AGE
	});
};

export const clearSessionCookie = (cookies: Cookies) => {
	cookies.delete(SESSION_COOKIE, cookieOptions);
};
