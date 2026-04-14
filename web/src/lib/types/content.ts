export interface SectionIntroContent {
	eyebrow?: string;
	title: string;
	description?: string;
}

export interface MetricItem {
	label: string;
	value: string;
}

export interface InfoCardItem {
	title: string;
	description: string;
}

export interface HighlightListItem {
	label: string;
	description: string;
}

export interface ProjectDetailGroup {
	heading: string;
	items: string[];
}

export interface ProjectContent {
	title: string;
	role: string;
	domain: string;
	context: string;
	contributions: string[];
	impact: string[];
	stack: string;
}

export interface ExperienceItem {
	role: string;
	focus: string;
	duration: string;
	achievements: string[];
}

export interface SkillCategory {
	title: string;
	description: string;
	note: string;
	wide?: boolean;
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
