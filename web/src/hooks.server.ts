import { redirect, type Handle } from '@sveltejs/kit';
import { detectPreferredLocale, isLocale } from '$lib/i18n/locale';

const bypassPrefixes = ['/robots.txt', '/sitemap.xml', '/favicon', '/_app', '/static'];

const shouldBypass = (pathname: string): boolean => {
	if (bypassPrefixes.some((prefix) => pathname.startsWith(prefix))) {
		return true;
	}

	return /\.[a-zA-Z0-9]+$/.test(pathname);
};

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (!shouldBypass(pathname)) {
		const segments = pathname.split('/').filter(Boolean);
		const first = segments[0];

		if (!first || !isLocale(first)) {
			const preferred = detectPreferredLocale(event.request.headers.get('accept-language'));
			const nextPath = pathname === '/' ? `/${preferred}` : `/${preferred}${pathname}`;
			throw redirect(307, nextPath);
		}
	}

	return resolve(event);
};
