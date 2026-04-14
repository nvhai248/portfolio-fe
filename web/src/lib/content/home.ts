import type { MetricItem, SectionIntroContent } from '$lib/types/content';

export const homeIntro: SectionIntroContent = {
	title: 'I build backend systems that scale reliably and deliver measurable outcomes.',
	description:
		'I help teams modernize architecture, reduce delivery risk, and ship AI-enabled features with clear performance goals.'
};

export const homeTagline = 'Backend Engineering • System Architecture • AI Integration';

export const homeHighlights: MetricItem[] = [
	{ label: 'Years building backend products', value: '5+' },
	{ label: 'Latency reduction in LMS APIs', value: '40%' },
	{ label: 'Focus areas', value: 'Architecture, AI, DX' }
];

export const recentInsights = {
	title: 'Recent insights',
	description: 'Technical writing on architecture, platform delivery, and AI implementation.'
};
