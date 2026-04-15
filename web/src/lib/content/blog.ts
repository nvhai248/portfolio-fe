import type { Locale } from '$lib/i18n/config';
import type { FeaturedPost, SectionIntroContent } from '$lib/types/content';

const byLocale = {
	vi: {
		blogIntro: {
			eyebrow: 'Blog',
			title: 'Ghi chú kỹ thuật và góc nhìn triển khai',
			description:
				'Các bài viết về kiến trúc backend, độ tin cậy nền tảng, tích hợp AI và bài học từ môi trường production.'
		},
		featuredPost: {
			title: 'Tối ưu Moodle với Ollama AI',
			slug: 'optimizing-moodle-with-ollama-ai',
			description:
				'Hướng dẫn tích hợp quy trình LLM cục bộ vào Moodle, vẫn đảm bảo quyền riêng tư, hiệu năng và khả năng vận hành.',
			date: '24 Thg 1, 2024',
			tags: ['Kiến trúc', 'Tích hợp AI', 'Hiệu năng'],
			readTime: '12 phút đọc'
		},
		blogBacklogMessage:
			'Tôi đang chuẩn bị thêm nội dung về tách dịch vụ, observability cho nền tảng và tối ưu API lưu lượng cao.'
	},
	en: {
		blogIntro: {
			eyebrow: 'Blog',
			title: 'Technical insights and engineering notes',
			description:
				'Articles about backend architecture, platform reliability, AI integration, and lessons from production delivery.'
		},
		featuredPost: {
			title: 'Optimizing Moodle with Ollama AI',
			slug: 'optimizing-moodle-with-ollama-ai',
			description:
				'A practical walkthrough of integrating local LLM workflows into Moodle while preserving privacy, speed, and operational control.',
			date: 'Jan 24, 2024',
			tags: ['Architecture', 'AI Integration', 'Performance'],
			readTime: '12 min read'
		},
		blogBacklogMessage:
			"I'm currently preparing additional write-ups on service decomposition, platform observability, and high-throughput API optimization."
	}
} as const;

export const getBlogContent = (locale: Locale): {
	blogIntro: SectionIntroContent;
	featuredPost: FeaturedPost;
	featuredPostSeo: {
		title: string;
		description: string;
		pathname: string;
		publishedAt: string;
		tags: string[];
	};
	blogBacklogMessage: string;
} => {
	const content = byLocale[locale];
	return {
		blogIntro: content.blogIntro,
		featuredPost: {
			...content.featuredPost,
			tags: [...content.featuredPost.tags]
		},
		featuredPostSeo: {
			title: `${content.featuredPost.title} | Nguyen Van Hai`,
			description: content.featuredPost.description,
			pathname: `/${locale}/blog/${content.featuredPost.slug}`,
			publishedAt: '2024-01-24T00:00:00.000Z',
			tags: [...content.featuredPost.tags]
		},
		blogBacklogMessage: content.blogBacklogMessage
	};
};

export const {
	blogIntro,
	featuredPost,
	blogBacklogMessage
} = byLocale.en;

export const featuredPostSeo = getBlogContent('en').featuredPostSeo;
