import type { HighlightListItem, InfoCardItem, SectionIntroContent } from '$lib/types/content';

export const aboutIntro: SectionIntroContent = {
	eyebrow: 'About',
	title:
		'I build backend platforms that help product teams ship faster without sacrificing reliability.',
	description:
		'I am a backend engineer with 5+ years of experience across LMS, AI-enabled products, and cloud platforms. My focus is not only writing scalable code, but also shaping technical decisions that reduce delivery risk, improve operational confidence, and keep systems maintainable as requirements evolve.'
};

export const aboutCards: InfoCardItem[] = [
	{
		title: 'Positioning',
		description:
			'Backend-first engineer who connects architecture, delivery execution, and product outcomes in one flow.'
	},
	{
		title: 'How I work',
		description:
			'I align teams on measurable goals early, break delivery into small safe iterations, and document trade-offs so decisions stay clear over time.'
	},
	{
		title: 'Technical strengths',
		description:
			'Service design, API reliability, performance tuning, and practical AI integration with production-aware constraints.'
	},
	{
		title: 'Delivery principles',
		description:
			'Bias for clarity, progressive hardening, and operational visibility from day one.'
	}
];

export const contributionItems: HighlightListItem[] = [
	{
		label: 'Architecture with intent',
		description: 'define boundaries early so features can scale without constant rewrites.'
	},
	{
		label: 'Execution with ownership',
		description:
			'drive work from design to rollout, including observability and incident feedback loops.'
	},
	{
		label: 'Collaboration that compounds',
		description:
			'align backend, product, and QA on risk, impact, and release readiness.'
	},
	{
		label: 'Optimization where it matters',
		description:
			'prioritize bottlenecks that impact user experience, throughput, or team velocity.'
	}
];
