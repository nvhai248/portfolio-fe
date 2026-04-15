import type { ProjectsContent } from '$lib/types/content';
import { defineProjectsContent } from '$lib/content/validate';

export const projectsContent: ProjectsContent = defineProjectsContent({
	seo: {
		title: 'Projects | Nguyen Van Hai',
		description:
			'Selected projects by Nguyen Van Hai with role, impact, stack, and measurable delivery outcomes.'
	},
	intro: {
		eyebrow: 'Projects',
		title:
			'Selected backend projects where architecture decisions translated into measurable product impact.',
		description:
			'Each project highlights context, ownership, core contributions, and outcomes that mattered for product and operations.'
	},
	labels: {
		overview: 'Context',
		techStack: 'Tech stack'
	},
	items: [
		{
			title: 'Open University Moodle Optimization',
			slug: 'open-university-moodle-optimization',
			role: 'Backend Engineer • Enterprise LMS modernization',
			domain: 'Education Tech',
			overview:
				'The platform needed AI-assisted tutoring while keeping student data private and maintaining stable performance under semester-level traffic spikes.',
			problemStatement:
				'Open University needed to modernize Moodle with AI-assisted learning flows, but strict privacy requirements prohibited sending student conversations to external LLM providers. At the same time, peak semester traffic regularly exposed bottlenecks in API response times and query-heavy tutor interactions.',
			detailLists: [
				{
					heading: 'Key contributions',
					items: [
						'Built Moodle plugin integrations with an API layer for local LLM orchestration.',
						'Implemented Redis-backed cache strategy for repeated tutor and recommendation flows.',
						'Introduced safer rollout patterns and monitoring for feature reliability.'
					]
				},
				{
					heading: 'Impact',
					items: [
						'Reduced database load by ~40% on heavy query paths.',
						'Improved perceived response time for AI tutor interactions.',
						'Enabled privacy-conscious deployment by running models on internal infrastructure.'
					]
				}
			],
			responsibilities: [
				'Owned backend integration architecture between Moodle plugins and AI service endpoints.',
				'Defined caching and invalidation strategy for high-frequency recommendation and tutor requests.',
				'Partnered with QA and ops to design release gates, rollback plans, and observability baselines.'
			],
			architectureHighlights: [
				'Local LLM gateway pattern so Moodle could call internal model-serving endpoints without external data exposure.',
				'Redis cache-aside approach on repeated recommendation queries with targeted TTL and invalidation rules.',
				'Structured logging and endpoint-level latency instrumentation for release-time regression detection.'
			],
			deliveryOutcomes: [
				'API/database pressure was reduced on critical learner paths during traffic spikes.',
				'AI tutor feature became production-usable for real coursework flows with stable latency.',
				'Stakeholders approved broader AI experimentation due to improved privacy posture and operational control.'
			],
			lessonsLearned: [
				'AI features in education must be designed as reliability work, not only model integration work.',
				'Performance gains compound when caching strategy is aligned with real user journey repeat patterns.',
				'Adoption speed increases when architecture decisions are documented in risk/impact language for non-engineering stakeholders.'
			],
			timeline: '2023 — 2024',
			teamContext: 'Cross-functional delivery with backend engineers, Moodle specialists, QA, and platform operations.',
			links: [
				{
					label: 'Read architecture article',
					url: '/blog/optimizing-moodle-with-ollama-ai'
				}
			],
			sortOrder: 1,
			techStack: [
				'PHP 8.2',
				'Moodle plugin architecture',
				'Redis',
				'Ollama',
				'REST APIs',
				'Azure DevOps'
			]
		},
		{
			title: 'Microleap AI Food Detector Platform',
			slug: 'microleap-ai-food-detector-platform',
			role: 'Backend Developer • Real-time inference platform',
			domain: 'AI Product',
			overview:
				'The product required near real-time food recognition with stable processing throughput and consistent releases across multiple environments.',
			problemStatement:
				'Microleap was scaling an AI food detection product where inference quality, processing throughput, and deployment consistency all had to improve in parallel. The platform was constrained by uneven environment setups and weak service contracts between ingestion, inference, and metadata pipelines.',
			detailLists: [
				{
					heading: 'Key contributions',
					items: [
						'Developed event-driven Golang services for image processing and metadata workflows.',
						'Integrated vector search using Qdrant to improve similarity matching quality.',
						'Standardized containerized deployment with Kubernetes-first operational patterns.'
					]
				},
				{
					heading: 'Impact',
					items: [
						'Improved release confidence through repeatable CI/CD and environment parity.',
						'Scaled processing capacity with clearer service isolation and queue-driven execution.',
						'Reduced production incidents by tightening contracts between backend components.'
					]
				}
			],
			responsibilities: [
				'Implemented backend services for asynchronous image processing and metadata enrichment.',
				'Defined service boundaries and message contracts across ingestion, inference, and retrieval layers.',
				'Contributed deployment hardening for multi-environment CI/CD workflows.'
			],
			architectureHighlights: [
				'Queue-first workload orchestration to smooth burst traffic and stabilize inference workers.',
				'Vector search integration with Qdrant to support more accurate similarity lookup in detection flows.',
				'Kubernetes deployment templates and health checks to reduce environment drift and release surprises.'
			],
			deliveryOutcomes: [
				'Inference throughput improved with clearer asynchronous execution boundaries.',
				'Production deploys became more predictable across staging and live clusters.',
				'Team velocity improved due to cleaner component ownership and fewer integration regressions.'
			],
			lessonsLearned: [
				'AI product speed depends as much on delivery architecture as on model quality.',
				'Environment parity eliminates a large class of avoidable release incidents.',
				'Event contracts should be treated as product interfaces with strict ownership and versioning discipline.'
			],
			timeline: '2021 — 2023',
			teamContext:
				'Backend-focused collaboration with ML engineers, DevOps, and product stakeholders shipping rapid iterations.',
			sortOrder: 2,
			techStack: [
				'Golang',
				'Azure Functions',
				'Qdrant',
				'Docker',
				'Kubernetes',
				'PostgreSQL'
			]
		},
		{
			title: 'LMS API Reliability & Performance Program',
			slug: 'lms-api-reliability-performance-program',
			role: 'Software Engineer • Platform hardening initiative',
			domain: 'Platform Engineering',
			overview:
				'Growing LMS adoption created API bottlenecks and operational friction during peak usage periods, requiring a structured reliability push.',
			problemStatement:
				'As LMS usage scaled, platform teams faced recurring latency spikes, fragile deployments, and incident-heavy release cycles. The challenge was to improve service responsiveness and operational confidence without halting feature delivery commitments.',
			detailLists: [
				{
					heading: 'Key contributions',
					items: [
						'Refactored high-traffic endpoints and optimized SQL/query plans for critical paths.',
						'Introduced performance baselines and observability dashboards for release gates.',
						'Codified incident learnings into repeatable runbooks and delivery checklists.'
					]
				},
				{
					heading: 'Impact',
					items: [
						'Improved key API response times by approximately 40%.',
						'Raised deployment stability with clearer quality gates and rollback readiness.',
						'Reduced firefighting by increasing visibility into latency and failure trends.'
					]
				}
			],
			responsibilities: [
				'Led profiling and optimization of latency-critical endpoints serving core LMS workloads.',
				'Defined release-readiness checks around performance regression thresholds.',
				'Collaborated with incident responders to convert recurring outages into preventive engineering tasks.'
			],
			architectureHighlights: [
				'Query-plan optimization and endpoint-level caching on high-volume API paths.',
				'Observability-first release process with latency/error SLO dashboards as deployment gates.',
				'Operational runbooks mapped to common failure modes to speed response and reduce repeat incidents.'
			],
			deliveryOutcomes: [
				'Improved user-facing API performance during high-concurrency learning periods.',
				'Decrease in post-release incidents and improved rollback confidence.',
				'Engineering planning became more predictable through measurable performance baselines.'
			],
			lessonsLearned: [
				'Reliability programs succeed when tied to explicit release governance, not ad-hoc fixes.',
				'Latency work needs shared metrics language across engineering, QA, and product.',
				'Small iterative hardening loops outperform large one-off optimization efforts.'
			],
			timeline: '2022 — 2024',
			teamContext: 'Platform engineering initiative across backend, QA, and site reliability stakeholders.',
			sortOrder: 3,
			techStack: [
				'PHP',
				'PostgreSQL',
				'Redis',
				'API profiling tools',
				'Azure monitoring stack'
			]
		}
	]
});
