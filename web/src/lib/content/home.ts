import type { Locale } from '$lib/i18n/config';
import type { MetricItem, SectionIntroContent } from '$lib/types/content';

const homeContent = {
	vi: {
		homeIntro: {
			title: 'Chào bạn, tôi là Hải. Tôi làm backend.',
			description:
				'Tôi thích tìm cách để phần mềm chạy ổn định hơn, dễ phát triển thêm và dễ vận hành. Công việc của tôi xoay quanh backend, hạ tầng và những ứng dụng AI có ích trong thực tế.'
		},
		homeTagline: 'Kỹ sư Backend & DevOps',
		homeHighlights: [
			{ label: 'Kinh nghiệm làm backend', value: '5+ năm' },
			{ label: 'Thời gian phản hồi API LMS giảm', value: '40%' },
			{ label: 'Công việc chính', value: 'Backend, DevOps, AI' }
		] satisfies MetricItem[],
		recentInsights: {
			title: 'Bài viết gần đây',
			description: 'Những điều tôi học được khi viết code, vận hành hệ thống và thử nghiệm với AI.',
			fallbackTitle: 'Tôi đang chuẩn bị những bài viết đầu tiên',
			fallbackDescription: 'Tôi sẽ chia sẻ những bài toán đã gặp, cách tôi giải quyết và những điều rút ra trong quá trình làm việc.'
		},
		opportunityCTA: {
			title: 'Có ý tưởng muốn trao đổi? Tôi rất vui được nghe.',
			description: 'Nếu bạn đang làm một sản phẩm, cần thêm người cùng giải quyết bài toán kỹ thuật, hoặc đơn giản muốn trò chuyện về backend và AI, cứ nhắn cho tôi nhé.',
			buttonLabel: 'Nhắn cho tôi'
		}
	},
	en: {
		homeIntro: {
			title: 'Hi, I’m Hai. I build backend systems.',
			description:
				'I help teams modernize architecture, reduce delivery risk, and ship AI-enabled features with clear performance goals.'
		},
		homeTagline: 'Backend Engineering • System Architecture • AI Integration',
		homeHighlights: [
			{ label: 'Years building backend products', value: '5+' },
			{ label: 'Latency reduction in LMS APIs', value: '40%' },
			{ label: 'Focus areas', value: 'Architecture, AI, DX' }
		] satisfies MetricItem[],
		recentInsights: {
			title: 'Recent insights',
			description: 'Technical writing on architecture, platform delivery, and AI implementation.',
			fallbackTitle: 'Insights coming soon',
			fallbackDescription: 'No published posts yet. New articles about backend architecture and AI product delivery will be added soon.'
		},
		opportunityCTA: {
			title: 'Open to new projects and professional collaborations.',
			description: "Let's connect if you need to solve complex backend challenges or integrate AI components into your existing workflows.",
			buttonLabel: "Let's Talk"
		}
	}
} as const;

export const getHomeContent = (locale: Locale) => homeContent[locale];

export const { homeIntro, homeTagline, homeHighlights, recentInsights } = homeContent.en;
