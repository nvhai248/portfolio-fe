import type { Locale } from '$lib/i18n/config';
import type { MetricItem, SectionIntroContent } from '$lib/types/content';

const homeContent = {
	vi: {
		homeIntro: {
			title: 'Tôi xây dựng hệ thống backend mở rộng ổn định và tạo ra kết quả đo lường được.',
			description:
				'Tôi giúp đội ngũ hiện đại hoá kiến trúc, giảm rủi ro triển khai và đưa tính năng AI vào sản phẩm với mục tiêu hiệu năng rõ ràng.'
		},
		homeTagline: 'Backend Engineering • Kiến trúc hệ thống • Tích hợp AI',
		homeHighlights: [
			{ label: 'Số năm phát triển sản phẩm backend', value: '5+' },
			{ label: 'Mức giảm độ trễ API LMS', value: '40%' },
			{ label: 'Trọng tâm', value: 'Kiến trúc, AI, DX' }
		] satisfies MetricItem[],
		recentInsights: {
			title: 'Bài viết gần đây',
			description: 'Chia sẻ kỹ thuật về kiến trúc, vận hành nền tảng và triển khai AI.'
		}
	},
	en: {
		homeIntro: {
			title: 'I build backend systems that scale reliably and deliver measurable outcomes.',
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
			description: 'Technical writing on architecture, platform delivery, and AI implementation.'
		}
	}
} as const;

export const getHomeContent = (locale: Locale): {
	homeIntro: SectionIntroContent;
	homeTagline: string;
	homeHighlights: MetricItem[];
	recentInsights: { title: string; description: string };
} => homeContent[locale];

export const { homeIntro, homeTagline, homeHighlights, recentInsights } = homeContent.en;
