import type { AboutContent } from '$lib/types/content';
import { defineAboutContent } from '$lib/content/validate';

export const aboutContent: AboutContent = defineAboutContent({
	seo: {
		title: 'About | Nguyen Van Hai',
		description:
			'About Nguyen Van Hai — backend engineer focused on scalable architecture, reliability, and practical AI integration.'
	},
	intro: {
		eyebrow: 'About',
		title:
			'I build backend platforms that help product teams ship faster without sacrificing reliability.',
		description:
			'I am a backend engineer with 5+ years of experience across LMS, AI-enabled products, and cloud platforms. My focus is not only writing scalable code, but also shaping technical decisions that reduce delivery risk, improve operational confidence, and keep systems maintainable as requirements evolve.'
	},
	cards: [
		{
			heading: 'Positioning',
			body:
				'Backend-first engineer who connects architecture, delivery execution, and product outcomes in one flow.'
		},
		{
			heading: 'How I work',
			body:
				'I align teams on measurable goals early, break delivery into small safe iterations, and document trade-offs so decisions stay clear over time.'
		},
		{
			heading: 'Technical strengths',
			body:
				'Service design, API reliability, performance tuning, and practical AI integration with production-aware constraints.'
		},
		{
			heading: 'Delivery principles',
			body: 'Bias for clarity, progressive hardening, and operational visibility from day one.'
		}
	],
	contributionPanel: {
		title: 'How I contribute inside teams',
		items: [
			{
				label: 'Architecture with intent',
				text: 'define boundaries early so features can scale without constant rewrites.'
			},
			{
				label: 'Execution with ownership',
				text: 'drive work from design to rollout, including observability and incident feedback loops.'
			},
			{
				label: 'Collaboration that compounds',
				text: 'align backend, product, and QA on risk, impact, and release readiness.'
			},
			{
				label: 'Optimization where it matters',
				text: 'prioritize bottlenecks that impact user experience, throughput, or team velocity.'
			}
		]
	}
});
