import type { Locale } from '$lib/i18n/config';
import type { ProjectsContent, ProjectContent } from '$lib/types/content';
import { defineProjectsContent } from '$lib/content/validate';

const projectsByLocale: Record<Locale, ProjectsContent> = {
	vi: defineProjectsContent({
		seo: {
			title: 'Dự án | Nguyen Van Hai',
			description:
				'Hồ sơ các dự án kỹ thuật backend và phân phối của Nguyen Van Hai: Smart Retail POS 200+ cửa hàng, Enterprise LMS Moodle, Asset Management và nền tảng AI Microleap.'
		},
		intro: {
			eyebrow: 'Hồ sơ Kiến trúc & Dự án',
			title:
				'Các hệ thống phân tán và nền tảng backend với tác động kinh doanh đo lường được.',
			description:
				'Mỗi dự án phản ánh quyền làm chủ thiết kế ranh giới dịch vụ, độ tin cậy của luồng dữ liệu, hạ tầng GitOps và kết quả vận hành thực tế trên môi trường sản xuất.'
		},
		labels: {
			overview: 'Bối cảnh bài toán',
			techStack: 'Công nghệ triển khai'
		},
		items: [
			{
				title: 'Smart Retail POS Platform (Omnichannel POS & ERP)',
				slug: 'smart-retail-pos-platform',
				role: 'Kỹ sư Backend & DevOps • Solum',
				domain: 'Công nghệ Bán lẻ & ERP Phân tán',
				overview:
					'Nền tảng bán lẻ đa kênh đa khách hàng phục vụ hơn 200+ chuỗi cửa hàng, xử lý thanh toán, đồng bộ kho đồng thời và tự động phát hành hóa đơn điện tử.',
				problemStatement:
					'Hệ thống bán lẻ đa kênh với hơn 200 cửa hàng hoạt động liên tục đòi hỏi xử lý đơn hàng tức thời, quản lý kho đồng thời tránh xung đột race condition, và tự động tích hợp API hóa đơn điện tử Viettel/MISA theo luật thuế Việt Nam. Thách thức lớn là bảo đảm 100% không mất mát sự kiện giữa cơ sở dữ liệu và message broker, đồng thời triển khai zero-downtime qua GitOps.',
				detailLists: [
					{
						heading: 'Đóng góp kỹ thuật chính',
						items: [
							'Phát triển microservices cốt lõi bằng Golang cho luồng thanh toán, kho hàng, đơn B2B và tích hợp Hóa đơn điện tử Viettel/MISA.',
							'Thiết kế kiến trúc hướng sự kiện bằng Azure Event Hubs (Kafka protocol) ứng dụng Transactional Outbox pattern.',
							'Xây dựng GitOps CI/CD với ArgoCD App-of-Apps, tích hợp automated pre-upgrade hooks chạy Goose migrations trước khi rollout.',
							'Tích hợp OCR hóa đơn bằng Mistral OCR và giải pháp báo cáo Multi-Agent tự động với Azure GPT-4o.'
						]
					},
					{
						heading: 'Tác động đo lường',
						items: [
							'Vận hành ổn định, đồng bộ dữ liệu thời gian thực trên 200+ chuỗi cửa hàng bán lẻ.',
							'Loại bỏ 100% hiện tượng mất đồng bộ sự kiện giữa DB và Broker nhờ Transactional Outbox.',
							'Kiểm thử stress test với k6 đạt p99 latency < 85ms trong các đợt cao điểm bán lẻ.',
							'Giảm 85% thời gian triển khai thủ công và loại bỏ sự cố lỗi migration nhờ ArgoCD hooks.'
						]
					}
				],
				responsibilities: [
					'Làm chủ kiến trúc microservices phân tán và thiết kế API cho nghiệp vụ thanh toán, tồn kho và hóa đơn điện tử.',
					'Quản trị hạ tầng đám mây dạng mã (IaC Terraform) trên Azure và điều phối Kubernetes (AKS, k0s) qua Helm.',
					'Thiết lập mạng biên Cloudflare (WAF, DNS), Ingress NGINX và cấp phát SSL wildcard tự động với cert-manager.',
					'Thiết lập hệ thống quan sát telemetry (Grafana, Datadog) và bot Slack đối soát đơn hàng hằng ngày.'
				],
				architectureHighlights: [
					'Transactional Outbox pattern đảm bảo tính nhất quán dữ liệu ACID giữa PostgreSQL và Azure Event Hubs.',
					'Redis Distributed Locking ngăn chặn triệt để race condition khi trừ tồn kho đồng thời ở nhiều quầy thu ngân.',
					'Mô hình ArgoCD App-of-Apps với pre-upgrade hook đảm bảo database migration hoàn tất an toàn trước khi Pod mới nhận traffic.'
				],
				deliveryOutcomes: [
					'Đạt chứng nhận triển khai zero-downtime cho toàn bộ mạng lưới 200+ cửa hàng.',
					'Quy trình xuất hóa đơn điện tử thuế tự động hóa 100% không cần can thiệp thủ công.',
					'Đội ngũ vận hành nắm bắt sự cố trong vài giây nhờ hệ thống telemetry và Slack alerts.'
				],
				lessonsLearned: [
					'Trong hệ thống POS bán lẻ, độ tin cậy của sự kiện và kiểm soát đồng thời quan trọng hơn việc tối ưu hóa vi mô đơn lẻ.',
					'GitOps với pre-upgrade hook là giải pháp bắt buộc để loại bỏ rủi ro schema drift khi mở rộng quy mô.',
					'Tự động hóa đối soát (reconciliation) sớm giúp phát hiện sai lệch trước khi trở thành sự cố tài chính.'
				],
				timeline: '02/2026 — Hiện tại',
				teamContext: 'Hợp tác chặt chẽ giữa Backend, DevOps/SRE, Frontend và các đối tác tài chính, thuế điện tử.',
				sortOrder: 1,
				techStack: [
					'Golang',
					'PostgreSQL',
					'Redis',
					'Azure Event Hubs (Kafka)',
					'Docker',
					'Kubernetes (AKS)',
					'Helm',
					'Terraform',
					'ArgoCD',
					'Cloudflare',
					'NGINX Ingress',
					'k6',
					'Grafana',
					'Datadog',
					'Mistral OCR',
					'Azure GPT-4o'
				]
			},
			{
				title: 'Open University Moodle (Enterprise LMS Platform)',
				slug: 'open-university-moodle-optimization',
				role: 'Kỹ sư Backend • NashTech',
				domain: 'Công nghệ Giáo dục & Hệ thống LMS',
				overview:
					'Hệ thống LMS phục vụ hàng chục nghìn sinh viên và giảng viên đại học, tùy biến module khảo thí và tích hợp trợ lý AI với Ollama và Redis cache.',
				problemStatement:
					'Open University cần tùy biến sâu Moodle mã nguồn mở để đáp ứng yêu cầu thi cử và chấm điểm đặc thù, đồng thời tích hợp tính năng AI tóm tắt đề thi/bài kiểm tra nhưng không được rò rỉ dữ liệu sinh viên ra bên thứ ba. Hệ thống thường xuyên nghẽn tải cơ sở dữ liệu trong các kỳ thi học kỳ tập trung.',
				detailLists: [
					{
						heading: 'Đóng góp kỹ thuật chính',
						items: [
							'Phát triển và duy trì các Moodle plugins cốt lõi bằng PHP và JavaScript (OUStudio, Sketch, Assignment).',
							'Viết bộ kiểm thử tự động toàn diện với PHPUnit (Unit test) và Behat (Acceptance test).',
							'Tích hợp gateway suy luận AI cục bộ sử dụng Ollama AI để tóm tắt đề thi và bài làm cho giảng viên/học viên.',
							'Triển khai kiến trúc bộ đệm nhiều tầng với Redis Cache cho các luồng AI và dữ liệu lặp lại.'
						]
					},
					{
						heading: 'Tác động đo lường',
						items: [
							'Giảm ~40% tải truy vấn cơ sở dữ liệu trên các luồng nghiệp vụ nặng trong kỳ thi.',
							'Tiết kiệm đáng kể tài nguyên tính toán và chi phí token AI nhờ cơ chế lưu đệm kết quả thông minh.',
							'Bảo mật thông tin 100% nhờ chạy suy luận mô hình trên hạ tầng máy chủ nội bộ.'
						]
					}
				],
				responsibilities: [
					'Chịu trách nhiệm kiến trúc tích hợp backend giữa các plugin Moodle và dịch vụ AI nội bộ.',
					'Thiết lập chiến lược lưu đệm (cache-aside) và vô hiệu hóa cache cho các yêu cầu tần suất cao.',
					'Xây dựng các kịch bản kiểm thử Behat và PHPUnit đảm bảo độ tin cậy của mã nguồn.'
				],
				architectureHighlights: [
					'Local AI Gateway Pattern kết nối Moodle với Ollama chạy trên hạ tầng nội bộ, bảo vệ quyền riêng tư học viên.',
					'Chiến lược Redis Cache-Aside với TTL tối ưu theo chu kỳ bài kiểm tra.',
					'Kiểm thử tự động hóa hành vi (Behavior-Driven Testing) với Behat trên môi trường CI.'
				],
				deliveryOutcomes: [
					'Nền tảng duy trì ổn định không gặp gián đoạn trong suốt các đợt thi học kỳ cao điểm.',
					'Tính năng tóm tắt bài thi bằng AI được đưa vào sử dụng chính thức cho giảng viên.',
					'Giảm thiểu tối đa lỗi phát sinh sau mỗi lần cập nhật phiên bản plugin.'
				],
				lessonsLearned: [
					'Tích hợp AI trong giáo dục trước hết là bài toán về độ tin cậy và quyền riêng tư dữ liệu, sau đó mới đến chất lượng mô hình.',
					'Hiệu quả bộ đệm đạt tối đa khi bám sát hành vi làm bài thi thực tế của học viên.'
				],
				timeline: '03/2024 — 02/2026',
				teamContext: 'Hợp tác giữa các kỹ sư Backend, chuyên gia Moodle, QA và ban quản lý đào tạo trực tuyến.',
				sortOrder: 2,
				techStack: [
					'PHP 8.2',
					'Moodle Architecture',
					'JavaScript',
					'Redis',
					'Ollama AI',
					'PHPUnit',
					'Behat',
					'Azure DevOps',
					'LAMP Stack'
				]
			},
			{
				title: 'Enterprise Asset Management System (Internal Tools)',
				slug: 'enterprise-asset-management-system',
				role: 'Kỹ sư Fullstack / Backend & DevOps • NashTech',
				domain: 'Hệ thống Quản trị Doanh nghiệp',
				overview:
					'Hệ thống quản lý vòng đời tài sản (thiết bị, cấp phát, thu hồi) cho toàn bộ nhân sự công ty, tự động hóa hạ tầng đám mây bằng Terraform và CI/CD Azure.',
				problemStatement:
					'Quy trình quản lý trang thiết bị công nghệ thông tin và tài sản nhân viên trước đây bị rời rạc, dẫn đến khó khăn trong kiểm kê và thu hồi khi có biến động nhân sự. Dự án cần xây dựng một giải pháp quản lý tập trung, bảo mật cao và tự động hóa triển khai trên đám mây Azure.',
				detailLists: [
					{
						heading: 'Đóng góp kỹ thuật chính',
						items: [
							'Phát triển API backend hiệu năng cao với NestJS và Prisma ORM kết nối Azure Database for PostgreSQL.',
							'Mã hóa hạ tầng đám mây bằng Terraform (IaC) để tạo lập Azure App Service và Azure Container Registry.',
							'Xây dựng pipeline CI/CD tự động trên Azure Pipelines từ khâu kiểm thử lint đến đóng gói container và deploy.',
							'Tham gia phát triển giao diện quản trị với ReactJS hỗ trợ phân quyền người dùng (RBAC).'
						]
					},
					{
						heading: 'Tác động đo lường',
						items: [
							'Số hóa 100% vòng đời quản lý tài sản nhân viên của công ty.',
							'Rút ngắn chu kỳ release tính năng xuống dưới 15 phút với CI/CD tự động.',
							'Được đánh giá xuất sắc trong chương trình Rookie to Engineer Batch 7 và đưa vào vận hành thực tế.'
						]
					}
				],
				responsibilities: [
					'Thiết kế database schema và các API quản lý vòng đời tài sản với NestJS.',
					'Quản trị và tự động hóa hạ tầng Azure bằng Terraform.',
					'Thiết lập pipeline kiểm thử và tự động triển khai mã nguồn trên Azure DevOps.'
				],
				architectureHighlights: [
					'Kiến trúc module NestJS kết hợp Prisma ORM giúp truy vấn cơ sở dữ liệu an toàn kiểu (type-safe).',
					'Quản lý hạ tầng dưới dạng mã (Terraform IaC) bảo đảm tính đồng nhất giữa môi trường dev và production.',
					'Đóng gói ứng dụng dạng Docker container và triển khai tự động lên Azure App Service.'
				],
				deliveryOutcomes: [
					'Hệ thống bàn giao đúng hạn và trở thành công cụ vận hành chính thức của bộ phận IT nội bộ.',
					'Độ ổn định cao và không phát sinh lỗi bảo mật trong quá trình vận hành.'
				],
				lessonsLearned: [
					'Sử dụng IaC từ ngày đầu giúp loại bỏ hoàn toàn tình trạng sai lệch cấu hình môi trường.',
					'Thiết kế schema cơ sở dữ liệu có tính mở rộng cao giúp dễ dàng bổ sung các chủng loại tài sản mới.'
				],
				timeline: '03/2024 — 08/2024',
				teamContext: 'Dự án trọng điểm thuộc chương trình Rookie to Engineer Batch 7, hợp tác đa chức năng.',
				sortOrder: 3,
				techStack: [
					'NestJS',
					'TypeScript',
					'Prisma ORM',
					'PostgreSQL',
					'ReactJS',
					'Terraform',
					'Azure App Service',
					'Azure Container Registry',
					'Azure Pipelines'
				]
			},
			{
				title: 'Microleap – AI Food Detection & Nutrition Analysis',
				slug: 'microleap-ai-food-detector-platform',
				role: 'Kỹ sư Backend (Freelance) • Microleap',
				domain: 'Nền tảng AI & Serverless Cloud',
				overview:
					'Nền tảng phân tích dinh dưỡng bữa ăn từ ảnh chụp ứng dụng Gemini 2.5 Pro trên Google Vertex AI, tìm kiếm ngữ nghĩa với Qdrant và backend serverless.',
				problemStatement:
					'Người dùng cần công cụ nhận diện bữa ăn từ hình ảnh tức thời để tự động tính toán calo và dinh dưỡng theo chỉ số cá nhân. Thách thức là xử lý suy luận AI tốc độ cao, nhận diện đúng các món ăn địa phương qua tìm kiếm tương đồng vector và co giãn hạ tầng serverless hiệu quả.',
				detailLists: [
					{
						heading: 'Đóng góp kỹ thuật chính',
						items: [
							'Xây dựng các backend API serverless bằng Azure Functions trên nền TypeScript.',
							'Tích hợp mô hình Gemini 2.5 Pro trên Google Vertex AI để phát hiện món ăn và tính toán dinh dưỡng.',
							'Tích hợp Qdrant Vector DB để lưu trữ embedding và tìm kiếm tương đồng ngữ nghĩa món ăn.',
							'Bảo mật định tuyến API với Azure API Management (APIM) và xác thực tập trung Azure Entra ID (SSO).'
						]
					},
					{
						heading: 'Tác động đo lường',
						items: [
							'Thời gian phản hồi phân tích dinh dưỡng hoàn tất dưới 2 giây.',
							'Tự động co giãn xử lý hàng nghìn yêu cầu đồng thời mà không tốn chi phí máy chủ nhàn rỗi.',
							'Tự động hóa phát hành backend dựa trên đặc tả OpenAPI và GitHub Actions CI/CD.'
						]
					}
				],
				responsibilities: [
					'Thiết kế API contract chuẩn OpenAPI và xây dựng luồng xử lý serverless.',
					'Tích hợp pipeline suy luận AI với Google Vertex AI và cơ sở dữ liệu vector Qdrant.',
					'Quản lý hạ tầng đám mây bằng Terraform và thiết lập GitHub Actions CI/CD.'
				],
				architectureHighlights: [
					'Kiến trúc Serverless hoàn toàn với Azure Functions giúp tối ưu 100% chi phí khi nhàn rỗi.',
					'Vector Similarity Lookup với Qdrant giải quyết triệt để các biến thể tên gọi món ăn.',
					'Định tuyến bảo mật và rate limiting phân tầng qua Azure API Management (APIM).'
				],
				deliveryOutcomes: [
					'Hệ thống API backend phục vụ mượt mà cho ứng dụng mobile trong giai đoạn phát hành thử nghiệm.',
					'Toàn bộ hạ tầng có thể tái tạo chỉ bằng một lệnh terraform apply.'
				],
				lessonsLearned: [
					'Tốc độ sản phẩm AI phụ thuộc rất lớn vào kiến trúc xử lý phi đồng bộ xung quanh mô hình thay vì chỉ phụ thuộc vào bản thân model.',
					'Chuẩn hóa API contract với OpenAPI từ đầu giúp việc phối hợp giữa backend và mobile mượt mà.'
				],
				timeline: '06/2025 — 12/2025',
				teamContext: 'Hợp tác chặt chẽ cùng các kỹ sư Machine Learning, DevOps và Mobile Developer.',
				sortOrder: 4,
				techStack: [
					'Azure Functions',
					'TypeScript',
					'Google Vertex AI (Gemini 2.5 Pro)',
					'Qdrant Vector DB',
					'Azure APIM',
					'Azure Entra ID',
					'Terraform',
					'GitHub Actions',
					'OpenAPI'
				]
			}
		]
	}),
	en: defineProjectsContent({
		seo: {
			title: 'Projects | Nguyen Van Hai',
			description:
				'Selected backend and cloud infrastructure projects by Nguyen Van Hai: Smart Retail POS across 200+ stores, Enterprise Moodle LMS, Asset Management, and Microleap AI Platform.'
		},
		intro: {
			eyebrow: 'Architecture & Projects',
			title:
				'Distributed systems and backend platforms built for measurable production impact.',
			description:
				'Each project demonstrates end-to-end service boundary ownership, data pipeline reliability, GitOps automation, and production performance verified under load.'
		},
		labels: {
			overview: 'Context & Problem',
			techStack: 'Tech Stack'
		},
		items: [
			{
				title: 'Smart Retail POS Platform (Omnichannel POS & ERP)',
				slug: 'smart-retail-pos-platform',
				role: 'Backend & DevOps Engineer • Solum',
				domain: 'Retail Tech & Distributed ERP',
				overview:
					'Multi-tenant omnichannel POS & ERP platform operating across 200+ retail stores with real-time checkout, distributed inventory management, and automated tax e-invoicing.',
				problemStatement:
					'Operating across 200+ retail stores continuously required sub-second order processing, atomic inventory decrement without race conditions, and real-time compliance with Vietnamese tax authorities via Viettel & MISA e-invoice APIs. The core challenge was guaranteeing zero event loss between the relational database and the streaming broker while maintaining automated zero-downtime GitOps rollouts.',
				detailLists: [
					{
						heading: 'Core Engineering Contributions',
						items: [
							'Engineered core Golang microservices for payment processing, stock locking, B2B workflows, and automated per-order tax filing via Viettel/MISA APIs.',
							'Architected an asynchronous event-driven messaging layer using Azure Event Hubs (Kafka protocol) paired with the Transactional Outbox pattern.',
							'Standardized GitOps CI/CD on Kubernetes (AKS) using ArgoCD App-of-Apps, featuring automated pre-upgrade hooks running Goose DB migrations before pod rollout.',
							'Integrated receipt and document intelligence using Mistral OCR on Azure AI Foundry and a Multi-Agent automated reporting system with Azure GPT-4o.'
						]
					},
					{
						heading: 'Measurable Impact',
						items: [
							'Sustained reliable, real-time data synchronization across 200+ active retail stores.',
							'Eliminated event loss and state drift between PostgreSQL and message queues via the Transactional Outbox pattern.',
							'Maintained p99 latency under 85ms during peak shopping periods, verified through rigorous k6 stress testing.',
							'Reduced manual deployment overhead by 85% and eliminated schema drift incidents through automated ArgoCD hooks.'
						]
					}
				],
				responsibilities: [
					'Owned distributed microservices architecture and API contracts for payment, inventory, and legal e-invoicing.',
					'Managed cloud infrastructure as code (Terraform) on Azure and orchestrated Kubernetes workloads (AKS, k0s) with Helm.',
					'Configured Cloudflare edge networking (WAF, DNS), NGINX Ingress, and automated wildcard SSL renewal via cert-manager.',
					'Established telemetry dashboards (Grafana, Datadog) and automated daily reconciliation anomaly alerts via Slack webhook bot.'
				],
				architectureHighlights: [
					'Transactional Outbox pattern guarantees atomic ACID persistence between PostgreSQL and Azure Event Hubs message streams.',
					'Redis Distributed Locking prevents race conditions when multiple cash registers sell the last stock unit concurrently.',
					'ArgoCD App-of-Apps with pre-upgrade lifecycle hooks ensures schema migrations succeed cleanly before new pods receive production traffic.'
				],
				deliveryOutcomes: [
					'Achieved verified zero-downtime release deployments across the entire retail network.',
					'Automated 100% of tax e-invoicing workflows without requiring manual accountant intervention.',
					'Enabled operations engineers to detect and resolve order drift anomalies in seconds through real-time Slack alerts.'
				],
				lessonsLearned: [
					'In mission-critical retail systems, event delivery guarantees and strict concurrency controls take precedence over isolated micro-optimizations.',
					'Pre-upgrade database migration hooks in GitOps pipelines are essential to eliminate breaking schema drift at scale.',
					'Automating daily reconciliations early surfaces data mismatches before they can escalate into financial reporting incidents.'
				],
				timeline: '02/2026 — Present',
				teamContext: 'Close collaboration with backend engineers, DevOps/SRE, frontend teams, and third-party payment & tax providers.',
				sortOrder: 1,
				techStack: [
					'Golang',
					'PostgreSQL',
					'Redis',
					'Azure Event Hubs (Kafka)',
					'Docker',
					'Kubernetes (AKS)',
					'Helm',
					'Terraform',
					'ArgoCD',
					'Cloudflare',
					'NGINX Ingress',
					'k6',
					'Grafana',
					'Datadog',
					'Mistral OCR',
					'Azure GPT-4o'
				]
			},
			{
				title: 'Open University Moodle (Enterprise LMS Platform)',
				slug: 'open-university-moodle-optimization',
				role: 'Backend Developer • NashTech',
				domain: 'EdTech & Learning Management Systems',
				overview:
					'Enterprise LMS platform serving tens of thousands of university students and lecturers, featuring custom assessment workflows and local AI-assisted tutoring.',
				problemStatement:
					'Open University required deep customization of the open-source Moodle LMS to handle specialized examination and grading workflows. Concurrently, an AI tutoring and summary feature was required under strict privacy governance prohibiting student conversation data from leaving internal boundaries. The existing platform faced recurring database bottlenecks during peak exam periods.',
				detailLists: [
					{
						heading: 'Core Engineering Contributions',
						items: [
							'Developed and maintained core Moodle plugins in PHP and JavaScript (OUStudio, Sketch, Assignment).',
							'Authored comprehensive automated test suites using PHPUnit (unit testing) and Behat (behavior-driven acceptance testing).',
							'Integrated a privacy-compliant local LLM gateway using Ollama AI to summarize quizzes and exams for students and faculty.',
							'Implemented a multi-tier caching architecture with Redis Cache for high-frequency AI inferences and repetitive query paths.'
						]
					},
					{
						heading: 'Measurable Impact',
						items: [
							'Reduced database query pressure by ~40% on critical learner endpoints during semester exams.',
							'Significantly lowered compute overhead and token costs through intelligent response caching in Redis.',
							'Maintained 100% data privacy compliance by hosting and executing all AI models on internal enterprise infrastructure.'
						]
					}
				],
				responsibilities: [
					'Owned backend integration architecture between Moodle plugin modules and internal AI inference services.',
					'Designed multi-tier cache-aside and invalidation policies for latency-critical student workflows.',
					'Formulated automated Behat and PHPUnit regression suites to ensure release stability across academic terms.'
				],
				architectureHighlights: [
					'Local AI Gateway pattern isolates Moodle controllers from internal Ollama inference endpoints, preserving student privacy.',
					'Redis Cache-Aside caching strategy tailored to examination lifecycle windows.',
					'End-to-end behavior-driven regression testing with Behat integrated into CI pipelines.'
				],
				deliveryOutcomes: [
					'Platform maintained uninterrupted stability throughout semester-wide examination peaks.',
					'AI exam summary capability graduated successfully into daily production use for faculty.',
					'Substantially reduced post-release regressions following custom plugin updates.'
				],
				lessonsLearned: [
					'AI features in education are fundamentally an engineering reliability and privacy challenge rather than just model prompt engineering.',
					'Cache efficiency compounds significantly when cache TTLs mirror actual student test-taking rhythms.'
				],
				timeline: '03/2024 — 02/2026',
				teamContext: 'Collaboration between backend engineers, Moodle core specialists, QA, and academic operations staff.',
				sortOrder: 2,
				techStack: [
					'PHP 8.2',
					'Moodle Architecture',
					'JavaScript',
					'Redis',
					'Ollama AI',
					'PHPUnit',
					'Behat',
					'Azure DevOps',
					'LAMP Stack'
				]
			},
			{
				title: 'Enterprise Asset Management System (Internal Tools)',
				slug: 'enterprise-asset-management-system',
				role: 'Fullstack / Backend & DevOps Engineer • NashTech',
				domain: 'Enterprise Internal Tools',
				overview:
					'Comprehensive internal IT asset lifecycle management system with cloud infrastructure as code (Terraform) and automated CI/CD deployment on Microsoft Azure.',
				problemStatement:
					'Manual tracking of IT hardware and employee device allocation led to inventory discrepancies and delayed offboarding recovery. The organization needed a centralized, role-based platform with high-performance APIs and reproducible cloud infrastructure.',
				detailLists: [
					{
						heading: 'Core Engineering Contributions',
						items: [
							'Engineered type-safe REST APIs using NestJS and Prisma ORM backed by Azure Database for PostgreSQL.',
							'Codified cloud infrastructure using Terraform (IaC) to provision Azure App Service, Azure Container Registry, and secure networking.',
							'Constructed automated CI/CD pipelines in Azure Pipelines covering linting, unit testing, container build, and deployment.',
							'Collaborated on an administrative dashboard in ReactJS featuring role-based access control (RBAC).'
						]
					},
					{
						heading: 'Measurable Impact',
						items: [
							'Digitized 100% of employee hardware lifecycle events from onboarding provisioning to asset retirement.',
							'Reduced feature deployment lead times from days to under 15 minutes with automated Azure Pipelines.',
							'Recognized as an outstanding capstone project in the Rookie to Engineer program (Batch 7) and adopted into live operational use.'
						]
					}
				],
				responsibilities: [
					'Designed database schemas and developed asset lifecycle backend services using NestJS.',
					'Provisioned and maintained reproducible cloud environments on Azure via Terraform.',
					'Configured automated build, test, and release pipelines on Azure DevOps.'
				],
				architectureHighlights: [
					'Modular NestJS architecture combined with Prisma ORM ensures strictly type-safe database queries.',
					'Terraform IaC guarantees environment parity between staging and production instances.',
					'Containerized deployments on Azure App Service with automated image delivery from Azure Container Registry.'
				],
				deliveryOutcomes: [
					'Delivered on schedule and integrated as the official internal IT asset operational tool.',
					'Maintained zero security vulnerabilities and stable platform uptime in live corporate use.'
				],
				lessonsLearned: [
					'Adopting Infrastructure as Code from day one eliminates environment drift and deployment surprises.',
					'Designing extensible database models upfront accommodates newly introduced hardware asset types effortlessly.'
				],
				timeline: '03/2024 — 08/2024',
				teamContext: 'Flagship capstone project within the Rookie to Engineer program (Batch 7), cross-functional delivery.',
				sortOrder: 3,
				techStack: [
					'NestJS',
					'TypeScript',
					'Prisma ORM',
					'PostgreSQL',
					'ReactJS',
					'Terraform',
					'Azure App Service',
					'Azure Container Registry',
					'Azure Pipelines'
				]
			},
			{
				title: 'Microleap – AI Food Detection & Nutrition Analysis',
				slug: 'microleap-ai-food-detector-platform',
				role: 'Backend Developer (Freelance) • Microleap',
				domain: 'Generative AI & HealthTech',
				overview:
					'Real-time meal recognition and nutritional breakdown platform powered by Gemini 2.5 Pro on Google Vertex AI, semantic vector search with Qdrant, and serverless Azure Functions.',
				problemStatement:
					'Users required instant nutritional analysis (calories, macronutrients) directly from meal photographs tailored to their dietary goals. The backend had to handle unpredictable mobile traffic spikes elastically while resolving colloquial and regional dish naming variations via semantic similarity.',
				detailLists: [
					{
						heading: 'Core Engineering Contributions',
						items: [
							'Architected serverless backend microservices using Azure Functions with TypeScript.',
							'Integrated multimodal vision inference via Gemini 2.5 Pro on Google Vertex AI for granular food ingredient detection.',
							'Implemented semantic similarity search using Qdrant Vector DB to normalize dish names and resolve abbreviations against nutritional databases.',
							'Enforced edge security with Azure API Management (APIM) rate limiting and Azure Entra ID (Single Sign-On).'
						]
					},
					{
						heading: 'Measurable Impact',
						items: [
							'Delivered complete image-to-nutrition analysis payloads in under 2 seconds.',
							'Scaled elastically to thousands of concurrent requests with zero idle server overhead.',
							'Automated client SDK generation and contract verification directly from OpenAPI definitions.'
						]
					}
				],
				responsibilities: [
					'Designed API contracts conforming to OpenAPI standards and authored serverless execution flows.',
					'Integrated AI inference pipelines with Google Vertex AI and Qdrant Vector DB.',
					'Codified cloud infrastructure using Terraform and automated deployments via GitHub Actions.'
				],
				architectureHighlights: [
					'Pure serverless compute with Azure Functions reduces idle operational costs to zero.',
					'Qdrant vector similarity matching resolves regional dish naming variations and synonyms reliably.',
					'Tiered edge routing and throttling enforced through Azure API Management (APIM).'
				],
				deliveryOutcomes: [
					'Backend APIs supported smooth mobile beta launches without scalability bottlenecks.',
					'Entire cloud infrastructure can be provisioned reproducibly with a single terraform apply command.'
				],
				lessonsLearned: [
					'AI product speed depends heavily on asynchronous pipeline architecture surrounding the model rather than model inference latency alone.',
					'Contract-first development with OpenAPI specifications streamlines mobile and backend integration dramatically.'
				],
				timeline: '06/2025 — 12/2025',
				teamContext: 'Collaborated closely with machine learning engineers, DevOps, and mobile application developers.',
				sortOrder: 4,
				techStack: [
					'Azure Functions',
					'TypeScript',
					'Google Vertex AI (Gemini 2.5 Pro)',
					'Qdrant Vector DB',
					'Azure APIM',
					'Azure Entra ID',
					'Terraform',
					'GitHub Actions',
					'OpenAPI'
				]
			}
		]
	})
};

export const getProjectsContent = (locale: Locale = 'vi'): ProjectsContent => {
	return projectsByLocale[locale] || projectsByLocale.vi;
};

export const getProjectBySlug = (slug: string, locale: Locale = 'vi'): ProjectContent | undefined => {
	const content = getProjectsContent(locale);
	return content.items.find((item) => item.slug === slug);
};

// Backwards-compatible default export
export const projectsContent = getProjectsContent('vi');
