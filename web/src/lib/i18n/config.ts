export const locales = ['vi', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export const fallbackLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
	vi: 'Tiếng Việt',
	en: 'English'
};

export const localeToOg: Record<Locale, string> = {
	vi: 'vi_VN',
	en: 'en_US'
};

export const localeToSchemaLang: Record<Locale, string> = {
	vi: 'vi',
	en: 'en'
};
