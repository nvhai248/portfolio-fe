export interface SeoMeta {
	title: string;
	description: string;
}

export interface SectionIntroContent {
	eyebrow?: string;
	title: string;
	description?: string;
}

export interface MetricItem {
	label: string;
	value: string;
}

export interface ContentCardItem {
	heading: string;
	body: string;
}

export interface LabeledContentItem {
	label: string;
	text: string;
}

export interface AboutContent {
	seo: SeoMeta;
	intro: SectionIntroContent;
	cards: ContentCardItem[];
	contributionPanel: {
		title: string;
		items: LabeledContentItem[];
	};
}

export interface ProjectDetailList {
	heading: string;
	items: string[];
}

export interface ProjectLink {
	label: string;
	url: string;
}

export interface ProjectContent {
	title: string;
	slug: string;
	role: string;
	domain: string;
	overview: string;
	detailLists: ProjectDetailList[];
	techStack: string[];
	problemStatement: string;
	responsibilities: string[];
	architectureHighlights: string[];
	deliveryOutcomes: string[];
	lessonsLearned: string[];
	timeline?: string;
	teamContext?: string;
	links?: ProjectLink[];
	sortOrder?: number;
}

export interface ProjectsContent {
	seo: SeoMeta;
	intro: SectionIntroContent;
	labels: {
		overview: string;
		techStack: string;
	};
	items: ProjectContent[];
}

export interface ExperienceItem {
	role: string;
	focus: string;
	duration: string;
	achievements: string[];
}

export interface TechSkillCategory {
	heading: string;
	summary: string;
	context: string;
	wide?: boolean;
}

export interface TechSkillsContent {
	title: string;
	description: string;
	categories: TechSkillCategory[];
}

export interface EducationContent {
	school: string;
	degree: string;
	details: string;
}

export interface CvPageContent {
	seo: SeoMeta;
	intro: SectionIntroContent;
	contactEmail: string;
	experienceItems: ExperienceItem[];
	techSkills: TechSkillsContent;
	education: EducationContent;
}

export interface FeaturedPost {
	title: string;
	slug: string;
	description: string;
	date: string;
	tags: string[];
	readTime: string;
}

export interface SocialProfile {
	platform: string;
	url: string;
}
