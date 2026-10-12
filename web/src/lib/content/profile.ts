import type { Locale } from '$lib/i18n/config';
import type { AboutContent, CvPageContent, ContentCardItem, LabeledContentItem } from '$lib/types/content';

export interface ProfilePrinciples {
	directionTitle: string;
	directions: ContentCardItem[];
	valuesTitle: string;
	values: ContentCardItem[];
}

export interface ProfileDetails {
	principles?: ProfilePrinciples;
	contactTitle: string;
	pdfLabel: string;
	pdfUrl: string;
	contactLinks: { label: string; url: string }[];
	experienceTitle: string;
	projectExperience: ContentCardItem[];
	languagesTitle: string;
	languages: LabeledContentItem[];
	certificationsTitle: string;
	certifications: { label: string; url: string }[];
}

interface ProfileContent {
	aboutContent: AboutContent;
	cvContent: CvPageContent;
	profileDetails: ProfileDetails;
}

const pdfUrl = 'https://drive.google.com/file/d/1b5OwlXKqk7HO6L8cVJMTeCU6g1xQqVOh/view?usp=sharing';
const certifications = [
	{ label: 'Gemini Certified Educator — Google', url: 'https://edu.google.accredible.com/35ab761a-d2c1-41b1-85f3-0694f607b260' },
	{ label: 'GitHub Certificate — LinkedIn Learning', url: 'https://www.linkedin.com/learning/certificates/1c90e565768064a3e64d3cfc4b945805d2cbc4ca4b1f6742bfd0dbc764aadda2' },
	{ label: 'ASP.NET Core Developer — LinkedIn Learning', url: 'https://www.linkedin.com/learning/certificates/f5bff789e21ba9937685985bd791b423105b897295d4a0ed49368a2b315a2f1e' },
	{ label: 'Azure AI Essentials — LinkedIn Learning', url: 'https://www.linkedin.com/learning/certificates/078131804bde778064fa340af9dc83a4e592ead43d67359d17c885388dc94958' }
];

// Editorial source: portfolio-fe/docs/about.md. Both locales are authored explicitly.
const profiles: Record<Locale, ProfileContent> = {
	vi: {
		aboutContent: {
			seo: {
				title: 'Giới thiệu & CV | Nguyen Van Hai',
				description: 'Hồ sơ Nguyễn Văn Hải, kỹ sư Backend & DevOps: Golang, hệ thống phân tán, Azure, Kubernetes, GitOps và tích hợp AI. Kỹ năng, học vấn và chứng chỉ.'
			},
			intro: {
				eyebrow: 'Giới thiệu & CV',
				title: 'Nguyễn Văn Hải — Kỹ sư Backend & DevOps',
				description: 'Tôi xây dựng hệ thống backend và hạ tầng vận hành với trọng tâm là độ tin cậy, khả năng mở rộng và hiệu quả triển khai. Tốt nghiệp ngành Công nghệ Thông tin tại Trường Đại học Khoa học Tự nhiên, ĐHQG TP.HCM, tôi kết hợp tư duy thiết kế hệ thống với kinh nghiệm phát triển dịch vụ, tự động hóa hạ tầng và tích hợp AI vào sản phẩm thực tế.'
			},
			cards: [
				{ heading: 'Backend gắn liền với vận hành', body: 'Tôi kết nối thiết kế kiến trúc, phát triển dịch vụ và triển khai hạ tầng. Các quyết định về API và dữ liệu được xem xét cùng chiến lược đóng gói container, migration, giám sát và phục hồi khi có sự cố.' },
				{ heading: 'Kiến trúc hướng sự kiện', body: 'Tôi sử dụng Azure Event Hubs và Kafka để xây dựng luồng xử lý bất đồng bộ. Transactional Outbox giúp phối hợp việc ghi dữ liệu và phát sự kiện, giảm rủi ro mất đồng bộ giữa cơ sở dữ liệu và các dịch vụ liên quan.' },
				{ heading: 'Ranh giới dịch vụ rõ ràng', body: 'Tôi thiết kế API với trách nhiệm và hợp đồng dữ liệu rõ ràng; sử dụng Redis cho caching và distributed locking khi phù hợp. Việc kiểm soát chuyển trạng thái và giới hạn ảnh hưởng của lỗi giúp hệ thống dễ bảo trì hơn.' },
				{ heading: 'Triển khai có kiểm soát', body: 'Tôi áp dụng Terraform, Helm và ArgoCD theo mô hình GitOps để quản lý hạ tầng và triển khai nhất quán. Migration với Goose, kiểm thử tải bằng k6 và kế hoạch rollout được kết hợp nhằm giảm rủi ro gián đoạn dịch vụ.' },
				{ heading: 'Khả năng quan sát từ đầu', body: 'Tôi đưa logging, metrics và tracing vào quá trình phát triển để hỗ trợ phát hiện điểm nghẽn và điều tra sự cố. Grafana, Datadog và Langfuse giúp theo dõi cả dịch vụ backend lẫn các luồng sử dụng mô hình ngôn ngữ.' },
				{ heading: 'AI hỗ trợ quy trình kỹ thuật', body: 'Tôi ứng dụng Google Antigravity và OpenCode để tổ chức các tác vụ AI theo vai trò trong quy trình phát triển: phân tích kiến trúc, hỗ trợ viết mã, kiểm thử và tài liệu. Quy tắc kỹ thuật và bước kiểm chứng giúp giữ chất lượng đầu ra trong tầm kiểm soát.' }
			],
			contributionPanel: {
				title: 'Cách tôi đóng góp trong đội ngũ',
				items: [
					{ label: 'Thiết kế có chủ đích', text: 'Làm rõ phạm vi nghiệp vụ và ranh giới dịch vụ, sau đó kiểm chứng bằng các tình huống sử dụng và tải thực tế trước khi mở rộng giải pháp.' },
					{ label: 'Trách nhiệm xuyên suốt', text: 'Theo sát công việc từ thiết kế API, migration cơ sở dữ liệu và cấu hình hạ tầng đến triển khai, giám sát và điều chỉnh sau phát hành.' },
					{ label: 'Nhận diện rủi ro sớm', text: 'Chủ động đánh giá phụ thuộc vào API bên ngoài, tranh chấp dữ liệu và các tình huống lỗi; lựa chọn circuit breaker hoặc đối soát nghiệp vụ khi bài toán cần đến.' },
					{ label: 'Tối ưu theo tác động', text: 'Ưu tiên các luồng quan trọng với hoạt động kinh doanh như thanh toán, đồng bộ tồn kho và hóa đơn điện tử; dùng số liệu để định hướng cải tiến.' },
					{ label: 'Chia sẻ kiến thức', text: 'Ghi lại quyết định kiến trúc, duy trì tài liệu kỹ thuật và hướng dẫn đồng đội về thiết kế API, phân tích lỗi và điều tra sự cố vận hành.' }
				]
			}
		},
		cvContent: {
			seo: { title: 'CV | Nguyen Van Hai', description: 'Năng lực Backend & DevOps, kinh nghiệm dự án và học vấn của Nguyễn Văn Hải.' },
			intro: {
				eyebrow: 'Hồ sơ chuyên môn',
				title: 'Từ phát triển dịch vụ đến vận hành hệ thống',
				description: 'Kinh nghiệm của tôi trải rộng từ hệ thống bán lẻ Smart POS & ERP phục vụ hơn 200 cửa hàng, nền tảng giáo dục Moodle đến các ứng dụng AI đa tác tử và thị giác máy tính. Tôi tham gia xuyên suốt vòng đời triển khai, từ mã nguồn Golang/Node.js đến hạ tầng tự động hóa, giám sát và kiểm thử tải.'
			},
			contactEmail: 'nvhai2408@gmail.com',
			experienceItems: [],
			techSkills: {
				title: 'Năng lực công nghệ',
				description: 'Các công nghệ và phương pháp tôi sử dụng để phát triển dịch vụ, quản lý dữ liệu, tự động hóa triển khai và tích hợp AI.',
				categories: [
					{ heading: 'Ngôn ngữ & phát triển ứng dụng', summary: 'Golang, TypeScript, JavaScript, Python, PHP, SQL', context: 'Golang với Gin, GORM, SQLX và gRPC; xử lý đồng thời bằng goroutine/channel. Node.js với NestJS, Express, Prisma, Sequelize và GraphQL; Python với FastAPI và script tự động hóa; PHP với Moodle, PHPUnit và Behat. Kinh nghiệm React và Next.js cho ứng dụng web.' },
					{ heading: 'Cloud & hạ tầng', summary: 'Azure, AKS, Event Hubs, Blob Storage, Azure Redis Cache, Azure AI Foundry, Terraform', context: 'Quản lý hạ tầng dưới dạng mã, kết nối mạng với VNet/NSG và triển khai các dịch vụ đám mây phục vụ ứng dụng backend và AI.' },
					{ heading: 'Container & GitOps', summary: 'Kubernetes, k0s, Docker, Helm, ArgoCD, Goose', context: 'Tổ chức triển khai theo App-of-Apps, quản lý migration trước nâng cấp và các tác vụ định kỳ bằng CronJob. Kết hợp NGINX Ingress, Cloudflare DNS/WAF/SSL và cert-manager cho truy cập và chứng chỉ.' },
					{ heading: 'Dữ liệu & truyền sự kiện', summary: 'PostgreSQL, MongoDB, Redis, Apache Kafka, Azure Event Hubs', context: 'Thiết kế dữ liệu, caching, distributed locking và migration. Xây dựng luồng sự kiện phân vùng, tích hợp Kafka protocol và áp dụng Transactional Outbox để giảm rủi ro mất đồng bộ dữ liệu.' },
					{ heading: 'AI & quy trình đa tác tử', summary: 'Google Antigravity, OpenCode, Mistral OCR, GPT-4o Vision, Ollama, Qdrant, pgvector, CockroachDB', context: 'Tích hợp OCR và thị giác máy tính trên Azure AI Foundry, điều phối LLM và báo cáo đa tác tử. Sử dụng embeddings như text-embedding-3-small cho tìm kiếm ngữ nghĩa và RAG; duy trì quy tắc kỹ thuật cho các tác vụ AI.' },
					{ heading: 'Quan sát & nền tảng hệ thống', summary: 'Grafana, Datadog, Langfuse, k6, thuật toán, cấu trúc dữ liệu', context: 'Theo dõi hành vi dịch vụ và luồng LLM, kiểm thử tải và phân tích điểm nghẽn. Áp dụng kiến thức về thuật toán, cấu trúc dữ liệu và xử lý đồng thời cho các bài toán hệ thống phân tán.' }
				]
			},
			education: {
				school: 'Trường Đại học Khoa học Tự nhiên — ĐHQG TP.HCM',
				degree: 'Cử nhân Công nghệ Thông tin — Khoa Công nghệ Thông tin',
				details: 'Niên khóa 2020–2024 · GPA: 3.2 / 4.0'
			}
		},
		profileDetails: {
			contactTitle: 'Liên hệ & hồ sơ',
			principles: {
				directionTitle: 'Tầm nhìn & sứ mệnh',
				directions: [
					{ heading: 'Tầm nhìn của tôi', body: 'Tôi mong muốn đồng hành cùng các đội ngũ xây dựng hệ thống có thể phát triển theo nhu cầu mà không trở nên khó vận hành. Tự động hóa có chủ đích, AI thực tiễn và tri thức được chia sẻ sẽ tạo thêm thời gian cho những công việc có ý nghĩa.' },
					{ heading: 'Sứ mệnh của tôi', body: 'Tôi xây dựng phần mềm đáng tin cậy cho những người sử dụng nó. Điều đó bắt đầu từ việc hiểu đúng vấn đề, giữ giải pháp rõ ràng và giúp đội ngũ có thể duy trì sản phẩm lâu dài sau khi phát hành.' }
				],
				valuesTitle: 'Giá trị cốt lõi',
				values: [
					{ heading: 'Sự rõ ràng', body: 'Tôi trình bày quyết định và đánh đổi một cách dễ hiểu, để người tiếp theo có thể tiếp tục công việc với sự tự tin.' },
					{ heading: 'Tinh thần sở hữu', body: 'Tôi theo sát công việc đến khi nó vận hành trong thực tế, nhận trách nhiệm khi có sự cố và cùng đội ngũ khắc phục đến nơi đến chốn.' },
					{ heading: 'Tôn trọng con người', body: 'Tôi cân nhắc cả người dùng sản phẩm lẫn đồng đội vận hành hệ thống. Thời gian và trải nghiệm của họ là một phần trong mọi quyết định kỹ thuật.' },
					{ heading: 'Không ngừng học hỏi', body: 'Tôi giữ sự tò mò, đón nhận phản hồi và chia sẻ những điều đã học. Công cụ mới chỉ có ý nghĩa khi giúp giải quyết một vấn đề thực tế.' }
				]
			},
			pdfLabel: 'Xem CV đầy đủ (PDF)',
			pdfUrl,
			contactLinks: [
				{ label: 'Điện thoại: +84 813 042 255', url: 'tel:+84813042255' },
				{ label: 'Email: nvhai2408@gmail.com', url: 'mailto:nvhai2408@gmail.com' },
				{ label: 'GitHub', url: 'https://github.com/nvhai248' },
				{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/nvhai248/' },
				{ label: 'LeetCode', url: 'https://leetcode.com/nvhai248' }
			],
			experienceTitle: 'Kinh nghiệm dự án',
			projectExperience: [
				{ heading: 'Bán lẻ & quản trị doanh nghiệp', body: 'Làm việc với hệ thống Smart POS & ERP đa khách hàng, đa kênh phục vụ hơn 200 cửa hàng. Trọng tâm gồm dịch vụ backend, các luồng thanh toán, đồng bộ tồn kho và hóa đơn điện tử, cùng hạ tầng triển khai cho hoạt động bán lẻ.' },
				{ heading: 'Nền tảng giáo dục', body: 'Phát triển và tích hợp trên nền tảng LMS Moodle, kết hợp lập trình PHP, kiểm thử với PHPUnit/Behat và các dịch vụ backend để hỗ trợ hệ thống giáo dục quy mô lớn.' },
				{ heading: 'Ứng dụng trí tuệ nhân tạo', body: 'Tích hợp OCR, thị giác máy tính và mô hình ngôn ngữ vào ứng dụng; xây dựng luồng báo cáo đa tác tử, tìm kiếm ngữ nghĩa và RAG. Chú trọng khả năng theo dõi và kiểm chứng hành vi của hệ thống AI.' }
			],
			languagesTitle: 'Ngôn ngữ',
			languages: [
				{ label: 'Tiếng Việt', text: 'Bản ngữ.' },
				{ label: 'Tiếng Anh', text: 'Đọc hiểu và viết tài liệu kỹ thuật thành thạo; giao tiếp cơ bản.' }
			],
			certificationsTitle: 'Chứng chỉ & khóa học',
			certifications
		}
	},
	en: {
		aboutContent: {
			seo: {
				title: 'About & CV | Nguyen Van Hai',
				description: 'Nguyen Van Hai, Backend & DevOps Engineer working with Golang, distributed systems, Azure, Kubernetes, GitOps and AI. Skills, education and credentials.'
			},
			intro: {
				eyebrow: 'About & CV',
				title: 'Nguyen Van Hai — Backend & DevOps Engineer',
				description: 'I build backend services and the infrastructure that supports them, with a focus on reliability, scalability and effective delivery. A graduate in Information Technology from VNUHCM–University of Science, I bring together system design, service development, infrastructure automation and practical AI integration.'
			},
			cards: [
				{ heading: 'Backend with operational ownership', body: 'I connect architecture, service development and infrastructure delivery. API and data decisions are considered alongside container packaging, database migrations, monitoring and recovery plans.' },
				{ heading: 'Event-driven architecture', body: 'I use Azure Event Hubs and Kafka for asynchronous processing. The Transactional Outbox pattern coordinates database writes and event publication, reducing the risk of inconsistencies between the database and dependent services.' },
				{ heading: 'Clear service boundaries', body: 'I design APIs with explicit responsibilities and data contracts, using Redis for caching and distributed locking where appropriate. Controlled state transitions and contained failure effects help keep services maintainable.' },
				{ heading: 'Controlled delivery', body: 'I use Terraform, Helm and ArgoCD with GitOps to manage infrastructure and deployments consistently. Goose migrations, k6 load tests and planned rollouts help reduce the risk of service disruption.' },
				{ heading: 'Observability from the start', body: 'I incorporate logs, metrics and traces into development to support bottleneck analysis and incident investigation. Grafana, Datadog and Langfuse provide visibility into backend services and language-model workflows.' },
				{ heading: 'AI-assisted engineering', body: 'I use Google Antigravity and OpenCode to organize AI tasks by role across architecture analysis, implementation, testing and documentation. Engineering rules and verification steps keep the output accountable to project requirements.' }
			],
			contributionPanel: {
				title: 'How I contribute inside teams',
				items: [
					{ label: 'Intentional architecture', text: 'Clarify business scope and service boundaries, then validate decisions against realistic usage and load scenarios before expanding the solution.' },
					{ label: 'End-to-end ownership', text: 'Follow work from API design, database migrations and infrastructure configuration through deployment, monitoring and post-release improvements.' },
					{ label: 'Early risk assessment', text: 'Evaluate external API dependencies, data contention and failure scenarios early; introduce circuit breakers or business reconciliation where the requirements call for them.' },
					{ label: 'Optimization by impact', text: 'Prioritize business-critical workflows such as payments, inventory synchronization and electronic invoicing, using measurements to guide improvements.' },
					{ label: 'Knowledge sharing', text: 'Document architecture decisions, maintain technical guidance and support teammates with API design, debugging and operational incident analysis.' }
				]
			}
		},
		cvContent: {
			seo: { title: 'CV | Nguyen Van Hai', description: 'Backend & DevOps capabilities, project experience and education of Nguyen Van Hai.' },
			intro: {
				eyebrow: 'Professional profile',
				title: 'From service development to system operations',
				description: 'My experience spans multi-tenant, omnichannel Smart POS & ERP systems serving more than 200 stores, Moodle learning platforms, and applications using multi-agent AI and computer vision. I work across the delivery lifecycle, from Golang/Node.js services to automated infrastructure, observability and load testing.'
			},
			contactEmail: 'nvhai2408@gmail.com',
			experienceItems: [],
			techSkills: {
				title: 'Technical capabilities',
				description: 'Technologies and practices I use to develop services, manage data, automate delivery and integrate AI.',
				categories: [
					{ heading: 'Languages & application development', summary: 'Golang, TypeScript, JavaScript, Python, PHP, SQL', context: 'Go with Gin, GORM, SQLX and gRPC, including goroutine/channel concurrency. Node.js with NestJS, Express, Prisma, Sequelize and GraphQL; Python with FastAPI and automation scripts; PHP with Moodle, PHPUnit and Behat. React and Next.js experience for web applications.' },
					{ heading: 'Cloud & infrastructure', summary: 'Azure, AKS, Event Hubs, Blob Storage, Azure Redis Cache, Azure AI Foundry, Terraform', context: 'Infrastructure as code, networking with VNet/NSG, and cloud services supporting backend and AI workloads.' },
					{ heading: 'Containers & GitOps', summary: 'Kubernetes, k0s, Docker, Helm, ArgoCD, Goose', context: 'App-of-Apps deployment organization, migrations before upgrades and scheduled tasks with CronJob. NGINX Ingress, Cloudflare DNS/WAF/SSL and cert-manager for access and certificate management.' },
					{ heading: 'Data & event streaming', summary: 'PostgreSQL, MongoDB, Redis, Apache Kafka, Azure Event Hubs', context: 'Data modeling, caching, distributed locking and migrations. Partitioned event streams, Kafka protocol integration and the Transactional Outbox pattern to reduce data synchronization risks.' },
					{ heading: 'AI & multi-agent workflows', summary: 'Google Antigravity, OpenCode, Mistral OCR, GPT-4o Vision, Ollama, Qdrant, pgvector, CockroachDB', context: 'OCR and computer vision integration on Azure AI Foundry, LLM orchestration and multi-agent reporting. Embeddings such as text-embedding-3-small for semantic search and RAG, with engineering rules for AI-assisted tasks.' },
					{ heading: 'Observability & system fundamentals', summary: 'Grafana, Datadog, Langfuse, k6, algorithms, data structures', context: 'Service and LLM workflow monitoring, load testing and bottleneck analysis. Algorithms, data structures and concurrency applied to distributed-system problems.' }
				]
			},
			education: {
				school: 'VNUHCM — University of Science',
				degree: 'Bachelor of Information Technology — Faculty of Information Technology',
				details: '2020–2024 · GPA: 3.2 / 4.0'
			}
		},
		profileDetails: {
			contactTitle: 'Contact & profiles',
			principles: {
				directionTitle: 'Mission & vision',
				directions: [
					{ heading: 'My mission', body: 'I build software that people can rely on. For me, that means understanding the problem, keeping the solution clear, and helping the team maintain it long after release.' },
					{ heading: 'My vision', body: 'I want to help teams build systems that grow with their needs without becoming harder to work with. I see thoughtful automation, practical uses of AI, and shared knowledge as ways to give people more time for meaningful work.' }
				],
				valuesTitle: 'Core values',
				values: [
					{ heading: 'Clarity', body: 'I make decisions and trade-offs easy to understand, so the next person can work with confidence.' },
					{ heading: 'Ownership', body: 'I follow work through to how it behaves in practice, take responsibility when something goes wrong, and help put it right.' },
					{ heading: 'Care for people', body: 'I consider the people using the product and the teammates supporting it. Their time and experience matter in every technical decision.' },
					{ heading: 'Keep learning', body: 'I stay curious, welcome feedback, and share what I learn. New tools are useful when they help us solve a real problem.' }
				]
			},
			pdfLabel: 'View full CV (PDF)',
			pdfUrl,
			contactLinks: [
				{ label: 'Phone: +84 813 042 255', url: 'tel:+84813042255' },
				{ label: 'Email: nvhai2408@gmail.com', url: 'mailto:nvhai2408@gmail.com' },
				{ label: 'GitHub', url: 'https://github.com/nvhai248' },
				{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/nvhai248/' },
				{ label: 'LeetCode', url: 'https://leetcode.com/nvhai248' }
			],
			experienceTitle: 'Project experience',
			projectExperience: [
				{ heading: 'Retail & enterprise operations', body: 'Work with multi-tenant, omnichannel Smart POS & ERP systems serving more than 200 stores. Focus areas include backend services, payments, inventory synchronization and electronic invoicing, alongside infrastructure for retail operations.' },
				{ heading: 'Learning platforms', body: 'Development and integration on Moodle LMS, combining PHP, PHPUnit/Behat testing and backend services to support large-scale education platforms.' },
				{ heading: 'AI applications', body: 'Integrate OCR, computer vision and language models into applications; build multi-agent reporting, semantic search and RAG workflows, with attention to visibility and verification of AI behavior.' }
			],
			languagesTitle: 'Languages',
			languages: [
				{ label: 'Vietnamese', text: 'Native.' },
				{ label: 'English', text: 'Proficient in reading and writing technical documentation; basic spoken communication.' }
			],
			certificationsTitle: 'Certifications & courses',
			certifications
		}
	}
};

export const getProfileContent = (locale: Locale): ProfileContent => profiles[locale];
