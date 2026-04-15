import { client } from '$lib/sanity';
import { fallbackLocale, type Locale } from '$lib/i18n/config';
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
	ProjectContent,
	ProjectsContent,
	SectionIntroContent,
	TechSkillsContent
} from '$lib/types/content';

const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && !defined(language)][0]{
	seo,
	intro,
	cards,
	contributionPanel
}`;

const AUTHOR_ABOUT_BY_LOCALE_QUERY = `coalesce(
	*[_id == ("drafts.author-main-" + $locale)][0],
	*[_id == ("author-main-" + $locale)][0],
	*[_type == "author" && language == $locale && slug.current == "hai-nguyen" && !(_id in path("drafts.**"))][0]
){
	aboutPage
}`;

const AUTHOR_ABOUT_QUERY = `coalesce(
	*[_id == "drafts.author-main"][0],
	*[_id == "author-main"][0],
	*[_id == "author-hai-nguyen"][0],
	*[_type == "author" && slug.current == "hai-nguyen" && !(_id in path("drafts.**"))][0]
){
	aboutPage
}`;

const PROJECTS_PAGE_BY_LOCALE_QUERY = `*[_type == "projectsPage" && language == $locale][0]{
	seo,
	intro,
	labels
}`;

const PROJECTS_PAGE_QUERY = `*[_type == "projectsPage" && !defined(language)][0]{
	seo,
	intro,
	labels
}`;

const PROJECTS_QUERY_BY_LOCALE = `*[_type == "project" && language == $locale && !(_id in path("drafts.**"))] | order(sortOrder asc, _createdAt asc){
	title,
	"slug": slug.current,
	role,
	domain,
	overview,
	detailLists[]{heading, items},
	techStack,
	problemStatement,
	responsibilities,
	architectureHighlights,
	deliveryOutcomes,
	lessonsLearned,
	timeline,
	teamContext,
	links[]{label, url},
	sortOrder
}`;

const PROJECTS_QUERY = `*[_type == "project" && !defined(language) && !(_id in path("drafts.**"))] | order(sortOrder asc, _createdAt asc){
	title,
	"slug": slug.current,
	role,
	domain,
	overview,
	detailLists[]{heading, items},
	techStack,
	problemStatement,
	responsibilities,
	architectureHighlights,
	deliveryOutcomes,
	lessonsLearned,
	timeline,
	teamContext,
	links[]{label, url},
	sortOrder
}`;

const PROJECT_BY_SLUG_QUERY_BY_LOCALE = `*[_type == "project" && language == $locale && slug.current == $slug && !(_id in path("drafts.**"))][0]{
	title,
	"slug": slug.current,
	role,
	domain,
	overview,
	detailLists[]{heading, items},
	techStack,
	problemStatement,
	responsibilities,
	architectureHighlights,
	deliveryOutcomes,
	lessonsLearned,
	timeline,
	teamContext,
	links[]{label, url},
	sortOrder
}`;

const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && !defined(language) && slug.current == $slug && !(_id in path("drafts.**"))][0]{
	title,
	"slug": slug.current,
	role,
	domain,
	overview,
	detailLists[]{heading, items},
	techStack,
	problemStatement,
	responsibilities,
	architectureHighlights,
	deliveryOutcomes,
	lessonsLearned,
	timeline,
	teamContext,
	links[]{label, url},
	sortOrder
}`;

const CV_BY_LOCALE_QUERY = `coalesce(
	*[_id == ("drafts.cv-main-" + $locale)][0],
	*[_id == ("cv-main-" + $locale)][0],
	*[_type == "cv" && language == $locale && !(_id in path("drafts.**"))][0]
){
	seo,
	intro,
	contactEmail,
	experienceItems,
	techSkills,
	education
}`;

const CV_QUERY = `coalesce(
	*[_id == "drafts.cv-main"][0],
	*[_id == "cv-main"][0],
	*[_type == "cv" && !defined(language) && !(_id in path("drafts.**"))][0]
){
	seo,
	intro,
	contactEmail,
	experienceItems,
	techSkills,
	education
}`;

const CV_PAGE_BY_LOCALE_QUERY = `*[_type == "cvPage" && language == $locale][0]{
	seo,
	intro,
	contactEmail,
	experienceItems,
	techSkills,
	education
}`;

const CV_PAGE_QUERY = `*[_type == "cvPage" && !defined(language)][0]{
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

const safeStringArray = (value: unknown): string[] =>
	Array.isArray(value)
		? value.filter((item): item is string => isNonEmptyString(item)).map((item) => item.trim())
		: [];

const safeDetailLists = (
	value: unknown
): Array<{
	heading: string;
	items: string[];
}> => {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.map((detail) => {
			if (typeof detail !== 'object' || !detail) {
				return null;
			}

			const heading = isNonEmptyString((detail as { heading?: unknown }).heading)
				? (detail as { heading: string }).heading.trim()
				: '';
			const items = safeStringArray((detail as { items?: unknown }).items);

			if (!heading || items.length === 0) {
				return null;
			}

			return { heading, items };
		})
		.filter((item): item is { heading: string; items: string[] } => item !== null);
};

const sanitizeProject = (value: unknown): ProjectContent | null => {
	if (typeof value !== 'object' || !value) {
		return null;
	}

	const project = value as Partial<ProjectContent> & {
		teamContext?: unknown;
	};

	if (
		!isNonEmptyString(project.title) ||
		!isNonEmptyString(project.slug) ||
		!isNonEmptyString(project.role) ||
		!isNonEmptyString(project.domain) ||
		!isNonEmptyString(project.overview) ||
		!isNonEmptyString(project.problemStatement)
	) {
		return null;
	}

	const detailLists = safeDetailLists(project.detailLists);
	const techStack = safeStringArray(project.techStack);
	const responsibilities = safeStringArray(project.responsibilities);
	const architectureHighlights = safeStringArray(project.architectureHighlights);
	const deliveryOutcomes = safeStringArray(project.deliveryOutcomes);
	const lessonsLearned = safeStringArray(project.lessonsLearned);

	if (
		detailLists.length === 0 ||
		techStack.length === 0 ||
		responsibilities.length === 0 ||
		architectureHighlights.length === 0 ||
		deliveryOutcomes.length === 0 ||
		lessonsLearned.length === 0
	) {
		return null;
	}

	const links = Array.isArray(project.links)
		? project.links
				.map((link) => {
					if (typeof link !== 'object' || !link) {
						return null;
					}

					const label = isNonEmptyString((link as { label?: unknown }).label)
						? (link as { label: string }).label.trim()
						: '';
					const url = isNonEmptyString((link as { url?: unknown }).url)
						? (link as { url: string }).url.trim()
						: '';

					return label && url ? { label, url } : null;
				})
				.filter((item): item is { label: string; url: string } => item !== null)
		: [];

	return {
		title: project.title.trim(),
		slug: project.slug.trim(),
		role: project.role.trim(),
		domain: project.domain.trim(),
		overview: project.overview.trim(),
		problemStatement: project.problemStatement.trim(),
		detailLists,
		techStack,
		responsibilities,
		architectureHighlights,
		deliveryOutcomes,
		lessonsLearned,
		timeline: isNonEmptyString(project.timeline) ? project.timeline.trim() : undefined,
		teamContext: isNonEmptyString(project.teamContext) ? project.teamContext.trim() : undefined,
		links: links.length > 0 ? links : undefined,
		sortOrder: typeof project.sortOrder === 'number' ? project.sortOrder : undefined
	};
};

export const getAboutContent = async (locale: Locale = fallbackLocale): Promise<AboutContent> => {
	try {
		const [rawAuthorByLocale, rawAuthorFallback, rawAboutByLocale, rawAboutPage] = await Promise.all([
			withTimeout(
				client.fetch<{ aboutPage?: Partial<AboutContent> } | null>(AUTHOR_ABOUT_BY_LOCALE_QUERY, { locale })
			),
			withTimeout(client.fetch<{ aboutPage?: Partial<AboutContent> } | null>(AUTHOR_ABOUT_QUERY)),
			withTimeout(client.fetch<Partial<AboutContent> | null>(`*[_type == "aboutPage" && language == $locale][0]{ seo, intro, cards, contributionPanel }`, { locale })),
			withTimeout(client.fetch<Partial<AboutContent> | null>(ABOUT_PAGE_QUERY))
		]);

		const raw = rawAuthorByLocale?.aboutPage ?? rawAuthorFallback?.aboutPage ?? rawAboutByLocale ?? rawAboutPage;

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
				isNonEmptyString(raw.contributionPanel?.title) &&
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

const fetchProjectsFromSanity = async (locale: Locale): Promise<ProjectContent[]> => {
	const rawProjects = await withTimeout(client.fetch<unknown[]>(PROJECTS_QUERY_BY_LOCALE, { locale }));
	if (!Array.isArray(rawProjects) || rawProjects.length === 0) {
		const legacyProjects = await withTimeout(client.fetch<unknown[]>(PROJECTS_QUERY));
		if (!Array.isArray(legacyProjects)) {
			return [];
		}

		return legacyProjects
			.map((project) => sanitizeProject(project))
			.filter((project): project is ProjectContent => project !== null);
	}

	return rawProjects
		.map((project) => sanitizeProject(project))
		.filter((project): project is ProjectContent => project !== null);
};

export const getProjectsContent = async (locale: Locale = fallbackLocale): Promise<ProjectsContent> => {
	try {
		const [rawPageByLocale, rawPageFallback, projects] = await Promise.all([
			withTimeout(client.fetch<Partial<ProjectsContent> | null>(PROJECTS_PAGE_BY_LOCALE_QUERY, { locale })),
			withTimeout(client.fetch<Partial<ProjectsContent> | null>(PROJECTS_PAGE_QUERY)),
			fetchProjectsFromSanity(locale)
		]);

		const rawPage = rawPageByLocale ?? rawPageFallback;

		if (!rawPage || projects.length === 0) {
			return fallbackProjectsContent;
		}

		return defineProjectsContent({
			seo: {
				title: isNonEmptyString(rawPage.seo?.title)
					? rawPage.seo.title
					: fallbackProjectsContent.seo.title,
				description: isNonEmptyString(rawPage.seo?.description)
					? rawPage.seo.description
					: fallbackProjectsContent.seo.description
			},
			intro: safeIntro(rawPage.intro, fallbackProjectsContent.intro, 'projects.intro'),
			labels:
				isNonEmptyString(rawPage.labels?.overview) && isNonEmptyString(rawPage.labels?.techStack)
					? {
						overview: rawPage.labels.overview,
						techStack: rawPage.labels.techStack
					  }
					: fallbackProjectsContent.labels,
			items: projects
		});
	} catch (error) {
		console.error('Failed to fetch projects content from Sanity:', error);
		return fallbackProjectsContent;
	}
};

export const getProjectBySlug = async (slug: string, locale: Locale = fallbackLocale): Promise<ProjectContent | null> => {
	try {
		const raw = await withTimeout(
			client.fetch<unknown | null>(PROJECT_BY_SLUG_QUERY_BY_LOCALE, {
				slug,
				locale
			})
		);

		if (raw) {
			return sanitizeProject(raw);
		}

		const legacy = await withTimeout(
			client.fetch<unknown | null>(PROJECT_BY_SLUG_QUERY, {
				slug
			})
		);

		if (!legacy) {
			return null;
		}

		return sanitizeProject(legacy);
	} catch (error) {
		console.error(`Failed to fetch project by slug "${slug}" from Sanity:`, error);
		return null;
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

const safeExperienceItems = (value: unknown, fallback: ExperienceItem[]): ExperienceItem[] => {
	if (!Array.isArray(value) || value.length === 0) {
		return fallback;
	}

	const items = value
		.map((entry) => {
			if (typeof entry !== 'object' || !entry) {
				return null;
			}

			const item = entry as Partial<ExperienceItem>;
			if (!isNonEmptyString(item.role) || !isNonEmptyString(item.focus) || !isNonEmptyString(item.duration)) {
				return null;
			}

			const achievements = safeStringArray(item.achievements);
			if (achievements.length === 0) {
				return null;
			}

			const normalized: ExperienceItem = {
				role: item.role.trim(),
				focus: item.focus.trim(),
				duration: item.duration.trim(),
				achievements,
				company: isNonEmptyString(item.company) ? item.company.trim() : undefined,
				employmentType: isNonEmptyString(item.employmentType)
					? item.employmentType.trim()
					: undefined,
				location: isNonEmptyString(item.location) ? item.location.trim() : undefined,
				impactSummary: isNonEmptyString(item.impactSummary) ? item.impactSummary.trim() : undefined,
				stack: safeStringArray(item.stack),
				highlights: safeStringArray(item.highlights)
			};

			return normalized;
		})
		.filter((item): item is ExperienceItem => item !== null);

	return items.length > 0 ? items : fallback;
};

const safeEducation = (value: unknown, fallback: EducationContent): EducationContent => {
	if (typeof value !== 'object' || !value) {
		return fallback;
	}

	const edu = value as Partial<EducationContent>;

	if (!isNonEmptyString(edu.school) || !isNonEmptyString(edu.degree) || !isNonEmptyString(edu.details)) {
		return fallback;
	}

	return {
		school: edu.school.trim(),
		degree: edu.degree.trim(),
		details: edu.details.trim(),
		specialization: isNonEmptyString(edu.specialization) ? edu.specialization.trim() : undefined,
		coursework: safeStringArray(edu.coursework),
		awards: safeStringArray(edu.awards)
	};
};

const toCvContent = (raw: Partial<CvPageContent>): CvPageContent => ({
	seo: {
		title: isNonEmptyString(raw.seo?.title) ? raw.seo.title : fallbackCvContent.seo.title,
		description: isNonEmptyString(raw.seo?.description)
			? raw.seo.description
			: fallbackCvContent.seo.description
	},
	intro: safeIntro(raw.intro, fallbackCvContent.intro, 'cv.intro'),
	contactEmail: isNonEmptyString(raw.contactEmail) ? raw.contactEmail : fallbackCvContent.contactEmail,
	experienceItems: safeExperienceItems(raw.experienceItems, fallbackCvContent.experienceItems),
	techSkills: safeTechSkills(raw.techSkills, fallbackCvContent.techSkills),
	education: safeEducation(raw.education, fallbackCvContent.education)
});

export const getCvContent = async (locale: Locale = fallbackLocale): Promise<CvPageContent> => {
	try {
		const rawCvByLocale = await withTimeout(
			client.fetch<Partial<CvPageContent> | null>(CV_BY_LOCALE_QUERY, { locale })
		);
		if (rawCvByLocale) {
			return toCvContent(rawCvByLocale);
		}

		const rawCv = await withTimeout(client.fetch<Partial<CvPageContent> | null>(CV_QUERY));
		if (rawCv) {
			return toCvContent(rawCv);
		}

		const rawCvPageByLocale = await withTimeout(
			client.fetch<Partial<CvPageContent> | null>(CV_PAGE_BY_LOCALE_QUERY, { locale })
		);
		if (rawCvPageByLocale) {
			return toCvContent(rawCvPageByLocale);
		}

		const rawCvPage = await withTimeout(client.fetch<Partial<CvPageContent> | null>(CV_PAGE_QUERY));
		if (rawCvPage) {
			return toCvContent(rawCvPage);
		}

		return fallbackCvContent;
	} catch (error) {
		console.error('Failed to fetch CV content from Sanity:', error);
		return fallbackCvContent;
	}
};
