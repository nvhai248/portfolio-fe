import { env } from '$env/dynamic/public';

export const siteConfig = {
	name: 'Nguyen Van Hai',
	siteName: 'Nguyen Van Hai Portfolio',
	defaultLocale: 'en_US',
	twitterHandle: '@nvhai2408',
	defaultTitle: 'Nguyen Van Hai | Backend Engineer & System Architect',
	defaultDescription:
		'Portfolio of Nguyen Van Hai — backend engineering, system architecture, and practical AI integration for scalable products.',
	defaultOgImagePath: '/og/cover.svg'
} as const;

export const authorProfile = {
	name: 'Nguyen Van Hai',
	jobTitle: 'Backend Engineer & System Architect',
	email: 'mailto:nvhai2408@gmail.com'
} as const;

export const normalizePathname = (pathname: string): string => {
	if (!pathname) return '/';
	let next = pathname.startsWith('/') ? pathname : `/${pathname}`;
	if (next.length > 1 && next.endsWith('/')) next = next.slice(0, -1);
	return next;
};

export const normalizeSiteUrl = (input: string): string => {
	const parsed = new URL(input);
	return parsed.origin;
};

export const resolveSiteUrl = (origin?: string): string => {
	if (env.PUBLIC_SITE_URL?.trim()) {
		return normalizeSiteUrl(env.PUBLIC_SITE_URL.trim());
	}

	if (origin) {
		return normalizeSiteUrl(origin);
	}

	return 'http://localhost:5173';
};

export const toAbsoluteUrl = (pathname: string, origin?: string): string => {
	const siteUrl = resolveSiteUrl(origin);
	return new URL(normalizePathname(pathname), siteUrl).toString();
};
