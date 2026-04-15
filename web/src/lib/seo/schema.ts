import type { Locale } from '$lib/i18n/config';
import { localeToSchemaLang } from '$lib/i18n/config';
import type { ProjectContent } from '$lib/types/content';
import { authorProfile, siteConfig, toAbsoluteUrl } from '$lib/seo/site';

export const getPersonSchema = (origin?: string, locale: Locale = 'en') => ({
	'@context': 'https://schema.org',
	'@type': 'Person',
	'@id': `${toAbsoluteUrl('/', origin)}#person`,
	name: authorProfile.name,
	jobTitle: authorProfile.jobTitle,
	url: toAbsoluteUrl('/', origin),
	email: authorProfile.email,
	inLanguage: localeToSchemaLang[locale]
});

export const getWebsiteSchema = (origin?: string, locale: Locale = 'en') => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': `${toAbsoluteUrl('/', origin)}#website`,
	url: toAbsoluteUrl('/', origin),
	name: siteConfig.siteName,
	description: siteConfig.defaultMetaByLocale[locale].description,
	inLanguage: localeToSchemaLang[locale]
});

interface ArticleSchemaInput {
	origin?: string;
	pathname: string;
	title: string;
	description: string;
	datePublished: string;
	dateModified?: string;
	tags?: string[];
	locale?: Locale;
}

export const getArticleSchema = ({
	origin,
	pathname,
	title,
	description,
	datePublished,
	dateModified,
	tags,
	locale = 'en'
}: ArticleSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'Article',
	headline: title,
	description,
	url: toAbsoluteUrl(pathname, origin),
	mainEntityOfPage: toAbsoluteUrl(pathname, origin),
	author: {
		'@type': 'Person',
		name: authorProfile.name
	},
	publisher: {
		'@type': 'Person',
		name: authorProfile.name
	},
	datePublished,
	dateModified: dateModified ?? datePublished,
	keywords: tags?.join(', '),
	inLanguage: localeToSchemaLang[locale]
});

interface ProjectsSchemaInput {
	origin?: string;
	pathname: string;
	projects: ProjectContent[];
	locale?: Locale;
}

export const getProjectsSchema = ({ origin, pathname, projects, locale = 'en' }: ProjectsSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'CollectionPage',
	url: toAbsoluteUrl(pathname, origin),
	name: locale === 'vi' ? 'Dự án' : 'Projects',
	inLanguage: localeToSchemaLang[locale],
	hasPart: projects.map((project) => ({
		'@type': 'CreativeWork',
		name: project.title,
		description: project.overview,
		url: toAbsoluteUrl(`/${locale}/projects/${project.slug}`, origin),
		about: project.domain,
		keywords: project.techStack.join(', ')
	}))
});

interface ProjectDetailSchemaInput {
	origin?: string;
	pathname: string;
	project: ProjectContent;
	locale?: Locale;
}

export const getProjectDetailSchema = ({
	origin,
	pathname,
	project,
	locale = 'en'
}: ProjectDetailSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'CreativeWork',
	name: project.title,
	description: project.overview,
	url: toAbsoluteUrl(pathname, origin),
	about: project.domain,
	keywords: project.techStack.join(', '),
	inLanguage: localeToSchemaLang[locale],
	author: {
		'@type': 'Person',
		name: authorProfile.name
	}
});
