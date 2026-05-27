import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { Buffer } from 'node:buffer';
import { mkdir, readFile, writeFile, chmod } from 'node:fs/promises';
import { dirname, isAbsolute, resolve } from 'node:path';

type EncryptedTokenFile = {
	version: 1;
	iv: string;
	payload: string;
	updatedAt: string;
};

export type AdminDriveToken = {
	accessToken: string;
	expiresAt: number;
	refreshToken?: string;
	scope?: string;
	tokenType?: string;
};

export type GoogleOAuthToken = {
	access_token: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
	token_type?: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const DEFAULT_LOCAL_TOKEN_STORE_PATH = '.data/google-admin-token.json';
const DEFAULT_VERCEL_TOKEN_STORE_PATH = '/tmp/.data/google-admin-token.json';

const hasCode = (caught: unknown, code: string): boolean =>
	caught instanceof Error && 'code' in caught && (caught as NodeJS.ErrnoException).code === code;

const shouldIgnoreChmodError = (caught: unknown): boolean =>
	hasCode(caught, 'ENOSYS') || hasCode(caught, 'EPERM') || hasCode(caught, 'EINVAL');

const getTokenStorePath = () => {
	const configuredPath = env.GOOGLE_TOKEN_STORE_PATH;

	if (!configuredPath) {
		// Vercel serverless functions cannot persist files under /var/task.
		return env.VERCEL
			? DEFAULT_VERCEL_TOKEN_STORE_PATH
			: resolve(process.cwd(), DEFAULT_LOCAL_TOKEN_STORE_PATH);
	}

	if (env.VERCEL && !isAbsolute(configuredPath)) {
		return DEFAULT_VERCEL_TOKEN_STORE_PATH;
	}

	return isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath);
};

const getEncryptionSecret = () => {
	const secret = env.GOOGLE_TOKEN_ENCRYPTION_KEY || env.SESSION_SECRET;

	if (!secret) {
		throw error(500, 'Google token encryption is not configured.');
	}

	return secret;
};

const importEncryptionKey = async () => {
	const digest = await crypto.subtle.digest('SHA-256', encoder.encode(getEncryptionSecret()));

	return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
};

const encodeBase64 = (bytes: Uint8Array): string => Buffer.from(bytes).toString('base64');
const decodeBase64 = (value: string): ArrayBuffer => {
	const buffer = Buffer.from(value, 'base64');

	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
};

const encryptToken = async (token: AdminDriveToken): Promise<EncryptedTokenFile> => {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const key = await importEncryptionKey();
	const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(token)));

	return {
		version: 1,
		iv: encodeBase64(iv),
		payload: encodeBase64(new Uint8Array(encrypted)),
		updatedAt: new Date().toISOString()
	};
};

const decryptToken = async (file: EncryptedTokenFile): Promise<AdminDriveToken> => {
	if (file.version !== 1) {
		throw error(500, 'Unsupported Google token store version.');
	}

	const key = await importEncryptionKey();
	const decrypted = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: new Uint8Array(decodeBase64(file.iv)) },
		key,
		decodeBase64(file.payload)
	);

	return JSON.parse(decoder.decode(decrypted)) as AdminDriveToken;
};

export const readAdminDriveToken = async (): Promise<AdminDriveToken | null> => {
	try {
		const raw = await readFile(getTokenStorePath(), 'utf8');
		const file = JSON.parse(raw) as EncryptedTokenFile;

		return await decryptToken(file);
	} catch {
		return null;
	}
};

export const writeAdminDriveToken = async (token: AdminDriveToken) => {
	const tokenStorePath = getTokenStorePath();
	const encrypted = await encryptToken(token);

	await mkdir(dirname(tokenStorePath), { recursive: true });
	await writeFile(tokenStorePath, `${JSON.stringify(encrypted, null, 2)}\n`, { mode: 0o600 });
	try {
		await chmod(tokenStorePath, 0o600);
	} catch (caught) {
		if (!shouldIgnoreChmodError(caught)) {
			throw caught;
		}
	}
};

export const persistAdminDriveToken = async (token: GoogleOAuthToken) => {
	const existingToken = await readAdminDriveToken();
	const refreshToken = token.refresh_token || existingToken?.refreshToken;

	if (!refreshToken) {
		throw error(428, 'Google Drive refresh token was not returned. Reconnect Google with consent.');
	}

	await writeAdminDriveToken({
		accessToken: token.access_token,
		refreshToken,
		scope: token.scope,
		tokenType: token.token_type,
		expiresAt: Date.now() + (token.expires_in ?? 3600) * 1000
	});
};
