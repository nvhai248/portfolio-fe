import type { Locale } from '$lib/i18n/config';

export const dictionary = {
	vi: {
		skipToContent: 'Bỏ qua đến nội dung chính',
		header: {
			homeAriaLabel: 'Về trang chủ',
			letTalk: 'Liên hệ',
			toggleTheme: 'Đổi giao diện',
			toggleMenu: 'Mở menu',
			jobTitle: 'Kỹ sư Backend',
			language: 'Ngôn ngữ',
			toggleLanguage: 'Chọn ngôn ngữ'
		},
		footer: {
			eyebrow: 'Sẵn sàng cho cơ hội phù hợp',
			title: 'Xây dựng hệ thống backend ổn định với tác động kinh doanh rõ ràng.',
			description:
				'Nếu bạn cần kỹ sư backend để hiện đại hoá kiến trúc, cải thiện hiệu năng hoặc triển khai tính năng AI an toàn, hãy kết nối.',
			navigation: 'Điều hướng',
			profiles: 'Hồ sơ',
			copyrightSuffix: 'Đã đăng ký bản quyền.',
			builtWith: 'Xây dựng bằng SvelteKit, ưu tiên hiệu năng, khả năng truy cập và sự rõ ràng.'
		},
		home: {
			seoTitle: 'Nguyen Van Hai | Kỹ sư Backend & Kiến trúc sư Hệ thống',
			seoDescription:
				'Portfolio của Nguyen Van Hai — backend engineering, system architecture và ứng dụng AI thực tế cho sản phẩm mở rộng.',
			ctaProjects: 'Xem dự án',
			ctaCv: 'Xem CV',
			quickProfile: 'Thông tin nhanh',
			seeAllPosts: 'Xem tất cả bài viết',
			emptyTitle: 'Bài viết sắp cập nhật',
			emptyDescription:
				'Hiện chưa có bài viết công khai. Nội dung mới về kiến trúc backend và triển khai AI sẽ sớm được bổ sung.',
			emptyAction: 'Đi tới Blog'
		},
		blog: {
			seoTitle: 'Blog | Nguyen Van Hai',
			seoDescription:
				'Góc nhìn kỹ thuật của Nguyen Van Hai về backend engineering, quyết định kiến trúc và triển khai AI thực tế.',
			emptyTitle: 'Đang chuẩn bị thêm bài viết'
		},
		cv: {
			experience: 'Kinh nghiệm',
			education: 'Học vấn',
			specialization: 'Chuyên ngành',
			coursework: 'Các môn học liên quan',
			achievements: 'Thành tích nổi bật',
			requestPdf: 'Yêu cầu CV đầy đủ (PDF)'
		},
		projectDetail: {
			back: '← Quay lại danh sách dự án',
			timeline: 'Mốc thời gian',
			teamContext: 'Bối cảnh đội ngũ',
			problemStatement: 'Bài toán',
			responsibilities: 'Trách nhiệm',
			architectureHighlights: 'Điểm nhấn kiến trúc',
			deliveryOutcomes: 'Kết quả triển khai',
			lessonsLearned: 'Bài học rút ra',
			contributions: 'Đóng góp và tác động chính',
			techStack: 'Tech stack'
		},
		contact: {
			seoTitle: 'Liên hệ | Nguyen Van Hai',
			seoDescription: 'Kết nối với Nguyen Van Hai cho các cơ hội hợp tác backend engineering và AI.',
			title: 'Liên hệ',
			description: 'Bạn có ý tưởng hay cần tư vấn kỹ thuật? Hãy để lại lời nhắn, tôi sẽ phản hồi sớm nhất có thể.',
			form: {
				name: 'Họ tên',
				email: 'Email',
				subject: 'Chủ đề',
				message: 'Nội dung',
				send: 'Gửi lời nhắn',
				sending: 'Đang gửi...',
				successTitle: 'Gửi thành công!',
				successMessage: 'Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi qua email sớm nhất có thể.',
				errorTitle: 'Có lỗi xảy ra',
				errorMessage: 'Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau hoặc gửi trực tiếp qua email.',
				validation: {
					nameRequired: 'Vui lòng nhập họ tên',
					emailRequired: 'Vui lòng nhập email',
					emailInvalid: 'Email không hợp lệ',
					subjectRequired: 'Vui lòng nhập chủ đề',
					messageRequired: 'Vui lòng nhập nội dung'
				}
			}
		},
		tools: {
			seoTitle: 'Công cụ & Tiện ích | Nguyen Van Hai',
			seoDescription: 'Tổng hợp các công cụ tiện ích: tính lương Gross/Net, chỉnh sửa ảnh, nghe nhạc và hơn thế nữa.',
			title: 'Công cụ & Tiện ích',
			description: 'Tập hợp các công cụ nhỏ giúp tối ưu công việc hàng ngày của bạn.',
			salary: {
				title: 'Tính lương Gross / Net',
				description: 'Công cụ quy đổi lương thực nhận (Net) và lương gộp (Gross) theo chuẩn quy định mới.',
			},
			image: {
				title: 'Chỉnh sửa ảnh',
				description: 'Công cụ chỉnh sửa ảnh cơ bản trực tiếp trên trình duyệt, an toàn và nhanh chóng.',
			},
			music: {
				title: 'Nghe nhạc',
				description: 'Trình phát nhạc với danh sách các bài hát thư giãn.',
			}
		}
	},
	en: {
		skipToContent: 'Skip to main content',
		header: {
			homeAriaLabel: 'Go to homepage',
			letTalk: "Let's Talk",
			toggleTheme: 'Toggle color theme',
			toggleMenu: 'Toggle mobile menu',
			jobTitle: 'Backend Engineer',
			language: 'Language',
			toggleLanguage: 'Toggle language'
		},
		footer: {
			eyebrow: 'Open to selected opportunities',
			title: 'Building reliable backend systems with measurable business impact.',
			description:
				"If you need a backend engineer to modernize architecture, improve performance, or ship AI-enabled features safely, let's connect.",
			navigation: 'Navigation',
			profiles: 'Profiles',
			copyrightSuffix: 'All rights reserved.',
			builtWith: 'Built with SvelteKit and a focus on performance, accessibility, and clarity.'
		},
		home: {
			seoTitle: 'Nguyen Van Hai | Backend Engineer & System Architect',
			seoDescription:
				'Portfolio of Nguyen Van Hai — backend engineering, system architecture, and practical AI integration for scalable products.',
			ctaProjects: 'View Projects',
			ctaCv: 'Read CV',
			quickProfile: 'Quick profile',
			seeAllPosts: 'See all posts',
			emptyTitle: 'Insights coming soon',
			emptyDescription:
				'No published posts yet. New articles about backend architecture and AI product delivery will be added soon.',
			emptyAction: 'Visit Blog'
		},
		blog: {
			seoTitle: 'Blog | Nguyen Van Hai',
			seoDescription:
				'Technical insights by Nguyen Van Hai on backend engineering, architecture decisions, and practical AI implementation.',
			emptyTitle: 'More posts in progress'
		},
		cv: {
			experience: 'Experience',
			education: 'Education',
			specialization: 'Specialization',
			coursework: 'Relevant coursework',
			achievements: 'Notable achievements',
			requestPdf: 'Request full CV (PDF)'
		},
		projectDetail: {
			back: '← Back to all projects',
			timeline: 'Timeline',
			teamContext: 'Team context',
			problemStatement: 'Problem statement',
			responsibilities: 'Responsibilities',
			architectureHighlights: 'Architecture highlights',
			deliveryOutcomes: 'Delivery outcomes',
			lessonsLearned: 'Lessons learned',
			contributions: 'Key contributions and impact',
			techStack: 'Tech stack'
		},
		contact: {
			seoTitle: 'Contact | Nguyen Van Hai',
			seoDescription: 'Connect with Nguyen Van Hai for backend engineering and AI collaboration opportunities.',
			title: 'Get in Touch',
			description: 'Have an idea or need technical advice? Drop a message and I will get back to you as soon as possible.',
			form: {
				name: 'Full Name',
				email: 'Email Address',
				subject: 'Subject',
				message: 'Message',
				send: 'Send Message',
				sending: 'Sending...',
				successTitle: 'Message Sent!',
				successMessage: "Thank you for reaching out. I'll get back to you via email as soon as possible.",
				errorTitle: 'Something went wrong',
				errorMessage: 'Could not send message right now. Please try again later or email me directly.',
				validation: {
					nameRequired: 'Name is required',
					emailRequired: 'Email is required',
					emailInvalid: 'Invalid email address',
					subjectRequired: 'Subject is required',
					messageRequired: 'Message is required'
				}
			}
		},
		tools: {
			seoTitle: 'Tools & Utilities | Nguyen Van Hai',
			seoDescription: 'A collection of useful tools: Gross/Net salary calculator, image editor, music player, and more.',
			title: 'Tools & Utilities',
			description: 'A collection of small utilities built to optimize your daily workflow.',
			salary: {
				title: 'Gross / Net Salary',
				description: 'Convert between Gross and Net salary based on the latest regional regulations.',
			},
			image: {
				title: 'Image Editor',
				description: 'Basic image editing tool running entirely in your browser, fast and secure.',
			},
			music: {
				title: 'Music Player',
				description: 'A relaxing music player with a curated playlist.',
			}
		}
	}
} as const;

export const getDictionary = (locale: Locale) => dictionary[locale];
