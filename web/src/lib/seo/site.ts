import { env } from '$env/dynamic/public';
import { localeToOg, type Locale } from '$lib/i18n/config';

const defaultMetaByLocale: Record<Locale, { title: string; description: string }> = {
	vi: {
		title: 'Nguyen Van Hai | Kỹ sư Backend & Kiến trúc sư Hệ thống',
		description:
			'Portfolio của Nguyen Van Hai — backend engineering, system architecture và ứng dụng AI thực tế cho sản phẩm mở rộng.'
	},
	en: {
		title: 'Nguyen Van Hai | Backend Engineer & System Architect',
		description:
			'Portfolio of Nguyen Van Hai — backend engineering, system architecture, and practical AI integration for scalable products.'
	}
};

export const siteConfig = {
	name: 'Nguyen Van Hai',
	siteName: 'Nguyen Van Hai Portfolio',
	twitterHandle: '@nvhai2408',
	defaultOgImagePath: '/og/cover.svg',
	defaultMetaByLocale,
	defaultLocale: localeToOg.en
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
