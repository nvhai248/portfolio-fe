import type { ProjectContent } from '$lib/types/content';
import { authorProfile, siteConfig, toAbsoluteUrl } from '$lib/seo/site';

export const getPersonSchema = (origin?: string) => ({
	'@context': 'https://schema.org',
	'@type': 'Person',
	'@id': `${toAbsoluteUrl('/', origin)}#person`,
	name: authorProfile.name,
	jobTitle: authorProfile.jobTitle,
	url: toAbsoluteUrl('/', origin),
	email: authorProfile.email
});

export const getWebsiteSchema = (origin?: string) => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': `${toAbsoluteUrl('/', origin)}#website`,
	url: toAbsoluteUrl('/', origin),
	name: siteConfig.siteName,
	description: siteConfig.defaultDescription,
	inLanguage: 'en'
});

interface ArticleSchemaInput {
	origin?: string;
	pathname: string;
	title: string;
	description: string;
	datePublished: string;
	dateModified?: string;
	tags?: string[];
}

export const getArticleSchema = ({
	origin,
	pathname,
	title,
	description,
	datePublished,
	dateModified,
	tags
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
	inLanguage: 'en'
});

interface ProjectsSchemaInput {
	origin?: string;
	pathname: string;
	projects: ProjectContent[];
}

export const getProjectsSchema = ({ origin, pathname, projects }: ProjectsSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'CollectionPage',
	url: toAbsoluteUrl(pathname, origin),
	name: 'Projects',
	hasPart: projects.map((project) => ({
		'@type': 'CreativeWork',
		name: project.title,
		description: project.overview,
		url: toAbsoluteUrl(`/projects/${project.slug}`, origin),
		about: project.domain,
		keywords: project.techStack.join(', ')
	}))
});

interface ProjectDetailSchemaInput {
	origin?: string;
	pathname: string;
	project: ProjectContent;
}

export const getProjectDetailSchema = ({
	origin,
	pathname,
	project
}: ProjectDetailSchemaInput) => ({
	'@context': 'https://schema.org',
	'@type': 'CreativeWork',
	name: project.title,
	description: project.overview,
	url: toAbsoluteUrl(pathname, origin),
	about: project.domain,
	keywords: project.techStack.join(', '),
	author: {
		'@type': 'Person',
		name: authorProfile.name
	}
});
