import { client } from '$lib/sanity';
import { aboutContent as fallbackAboutContent } from '$lib/content/about';
import { cvIntro, education, experienceItems, techSkillsContent } from '$lib/content/cv';
import { projectsContent as fallbackProjectsContent } from '$lib/content/projects';
import {
	defineAboutContent,
	defineProjectsContent,
	defineTechSkillsContent
} from '$lib/content/validate';
import type {
	AboutContent,
	CvPageContent,
	EducationContent,
	ExperienceItem,
	ProjectsContent,
	SectionIntroContent,
	TechSkillsContent
} from '$lib/types/content';

const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
	seo,
	intro,
	cards,
	contributionPanel
}`;

const PROJECTS_PAGE_QUERY = `*[_type == "projectsPage"][0]{
	seo,
	intro,
	labels,
	items
}`;

const CV_PAGE_QUERY = `*[_type == "cvPage"][0]{
	seo,
	intro,
	contactEmail,
	experienceItems,
	techSkills,
	education
}`;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> => {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
	});

	return Promise.race([promise, timeoutPromise]);
};

const fallbackCvContent: CvPageContent = {
	seo: {
		title: 'CV | Nguyen Van Hai',
		description:
			'CV of Nguyen Van Hai — backend engineering experience, technical capabilities, and measurable project outcomes.'
	},
	intro: cvIntro,
	contactEmail: 'nvhai2408@gmail.com',
	experienceItems,
	techSkills: techSkillsContent,
	education
};

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0;

const safeIntro = (
	value: unknown,
	fallback: SectionIntroContent,
	path: string
): SectionIntroContent => {
	if (typeof value !== 'object' || !value) {
		return fallback;
	}

	const intro = value as Partial<SectionIntroContent>;

	if (!isNonEmptyString(intro.title)) {
		throw new Error(`[content] ${path}.title must be a non-empty string`);
	}

	return {
		eyebrow: isNonEmptyString(intro.eyebrow) ? intro.eyebrow : fallback.eyebrow,
		title: intro.title,
		description: isNonEmptyString(intro.description) ? intro.description : fallback.description
	};
};

export const getAboutContent = async (): Promise<AboutContent> => {
	try {
		const raw = await withTimeout(client.fetch<Partial<AboutContent> | null>(ABOUT_PAGE_QUERY));

		if (!raw) {
			return fallbackAboutContent;
		}

		return defineAboutContent({
			seo: {
				title: isNonEmptyString(raw.seo?.title)
					? raw.seo.title
					: fallbackAboutContent.seo.title,
				description: isNonEmptyString(raw.seo?.description)
					? raw.seo.description
					: fallbackAboutContent.seo.description
			},
			intro: safeIntro(raw.intro, fallbackAboutContent.intro, 'about.intro'),
			cards: Array.isArray(raw.cards) && raw.cards.length > 0 ? raw.cards : fallbackAboutContent.cards,
			contributionPanel:
				raw.contributionPanel?.title &&
				Array.isArray(raw.contributionPanel.items) &&
				raw.contributionPanel.items.length > 0
					? {
						...raw.contributionPanel,
						title: raw.contributionPanel.title
					  }
					: fallbackAboutContent.contributionPanel
		});
	} catch (error) {
		console.error('Failed to fetch about page content from Sanity:', error);
		return fallbackAboutContent;
	}
};

export const getProjectsContent = async (): Promise<ProjectsContent> => {
	try {
		const raw = await withTimeout(client.fetch<Partial<ProjectsContent> | null>(PROJECTS_PAGE_QUERY));

		if (!raw) {
			return fallbackProjectsContent;
		}

		return defineProjectsContent({
			seo: {
				title: isNonEmptyString(raw.seo?.title)
					? raw.seo.title
					: fallbackProjectsContent.seo.title,
				description: isNonEmptyString(raw.seo?.description)
					? raw.seo.description
					: fallbackProjectsContent.seo.description
			},
			intro: safeIntro(raw.intro, fallbackProjectsContent.intro, 'projects.intro'),
			labels:
				isNonEmptyString(raw.labels?.overview) && isNonEmptyString(raw.labels?.techStack)
					? {
						overview: raw.labels.overview,
						techStack: raw.labels.techStack
					  }
					: fallbackProjectsContent.labels,
			items: Array.isArray(raw.items) && raw.items.length > 0 ? raw.items : fallbackProjectsContent.items
		});
	} catch (error) {
		console.error('Failed to fetch projects page content from Sanity:', error);
		return fallbackProjectsContent;
	}
};

const safeTechSkills = (value: unknown, fallback: TechSkillsContent): TechSkillsContent => {
	if (typeof value !== 'object' || !value) {
		return fallback;
	}

	const skills = value as Partial<TechSkillsContent>;

	return defineTechSkillsContent({
		title: isNonEmptyString(skills.title) ? skills.title : fallback.title,
		description: isNonEmptyString(skills.description) ? skills.description : fallback.description,
		categories:
			Array.isArray(skills.categories) && skills.categories.length > 0
				? skills.categories
				: fallback.categories
	});
};

const safeExperienceItems = (value: unknown, fallback: ExperienceItem[]): ExperienceItem[] =>
	Array.isArray(value) && value.length > 0 ? (value as ExperienceItem[]) : fallback;

const safeEducation = (value: unknown, fallback: EducationContent): EducationContent => {
	if (typeof value !== 'object' || !value) {
		return fallback;
	}

	const edu = value as Partial<EducationContent>;

	if (!isNonEmptyString(edu.school) || !isNonEmptyString(edu.degree) || !isNonEmptyString(edu.details)) {
		return fallback;
	}

	return {
		school: edu.school,
		degree: edu.degree,
		details: edu.details
	};
};

export const getCvContent = async (): Promise<CvPageContent> => {
	try {
		const raw = await withTimeout(client.fetch<Partial<CvPageContent> | null>(CV_PAGE_QUERY));

		if (!raw) {
			return fallbackCvContent;
		}

		return {
			seo: {
				title: isNonEmptyString(raw.seo?.title) ? raw.seo.title : fallbackCvContent.seo.title,
				description: isNonEmptyString(raw.seo?.description)
					? raw.seo.description
					: fallbackCvContent.seo.description
			},
			intro: safeIntro(raw.intro, fallbackCvContent.intro, 'cv.intro'),
			contactEmail: isNonEmptyString(raw.contactEmail)
				? raw.contactEmail
				: fallbackCvContent.contactEmail,
			experienceItems: safeExperienceItems(raw.experienceItems, fallbackCvContent.experienceItems),
			techSkills: safeTechSkills(raw.techSkills, fallbackCvContent.techSkills),
			education: safeEducation(raw.education, fallbackCvContent.education)
		};
	} catch (error) {
		console.error('Failed to fetch CV page content from Sanity:', error);
		return fallbackCvContent;
	}
};
