import type { Locale } from '$lib/i18n/config';

export const getPrimaryNavItems = (locale: Locale) => [
	{ href: `/${locale}`, label: locale === 'vi' ? 'Trang chủ' : 'Home' },
	{ href: `/${locale}/about`, label: locale === 'vi' ? 'Giới thiệu' : 'About' },
	{ href: `/${locale}/projects`, label: locale === 'vi' ? 'Dự án' : 'Projects' },
	{ href: `/${locale}/cv`, label: 'CV' },
	{ href: `/${locale}/tools`, label: locale === 'vi' ? 'Công cụ' : 'Tools' },
	{ href: `/${locale}/blog`, label: 'Blog' }
];

export const getFooterProfileLinks = (locale: Locale) => [
	{ href: 'https://github.com', label: 'GitHub', external: true },
	{ href: 'https://linkedin.com', label: 'LinkedIn', external: true },
	{ href: `/${locale}/blog`, label: locale === 'vi' ? 'Bài viết' : 'Insights' }
];
