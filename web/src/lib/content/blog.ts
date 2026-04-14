import type { FeaturedPost, SectionIntroContent } from '$lib/types/content';

export const blogIntro: SectionIntroContent = {
	eyebrow: 'Blog',
	title: 'Technical insights and engineering notes',
	description:
		'Articles about backend architecture, platform reliability, AI integration, and lessons from production delivery.'
};

export const featuredPost: FeaturedPost = {
	title: 'Optimizing Moodle with Ollama AI',
	slug: 'optimizing-moodle-with-ollama-ai',
	description:
		'A practical walkthrough of integrating local LLM workflows into Moodle while preserving privacy, speed, and operational control.',
	date: 'Jan 24, 2024',
	tags: ['Architecture', 'AI Integration', 'Performance'],
	readTime: '12 min read'
};

export const featuredPostSeo = {
	title: 'Optimizing Moodle with Ollama AI | Nguyen Van Hai',
	description:
		'How to integrate Ollama with Moodle for private, high-performance AI tutoring workflows without relying on external API providers.',
	pathname: `/blog/${featuredPost.slug}`,
	publishedAt: '2024-01-24T00:00:00.000Z',
	tags: featuredPost.tags
};

export const blogBacklogMessage =
	"I'm currently preparing additional write-ups on service decomposition, platform observability, and high-throughput API optimization.";
