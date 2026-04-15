import { defaultLocale, fallbackLocale, locales, type Locale } from '$lib/i18n/config';

const localeSet = new Set<Locale>(locales);

export const isLocale = (value: string): value is Locale => localeSet.has(value as Locale);

export const resolveLocale = (value?: string | null): Locale => {
	if (!value) return defaultLocale;
	return isLocale(value) ? value : defaultLocale;
};

export const stripLocalePrefix = (pathname: string): string => {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) {
		return '/';
	}

	if (isLocale(segments[0])) {
		const next = segments.slice(1).join('/');
		return next ? `/${next}` : '/';
	}

	return pathname.startsWith('/') ? pathname : `/${pathname}`;
};

export const localizePath = (pathname: string, locale: Locale): string => {
	const bare = stripLocalePrefix(pathname);
	if (bare === '/') {
		return `/${locale}`;
	}
	return `/${locale}${bare}`;
};

export const localeFromPathname = (pathname: string): Locale => {
	const first = pathname.split('/').filter(Boolean)[0];
	return resolveLocale(first);
};

export const detectPreferredLocale = (headerValue: string | null | undefined): Locale => {
	if (!headerValue) return defaultLocale;

	const values = headerValue
		.split(',')
		.map((item) => item.trim().toLowerCase())
		.filter(Boolean);

	for (const value of values) {
		const code = value.split(';')[0]?.split('-')[0];
		if (code === 'vi') return 'vi';
		if (code === 'en') return 'en';
	}

	return fallbackLocale;
};
