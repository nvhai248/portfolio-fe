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
			role: 'Backend Engineer • Enterprise LMS modernization',
			domain: 'Education Tech',
			overview:
				'The platform needed AI-assisted tutoring while keeping student data private and maintaining stable performance under semester-level traffic spikes.',
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
			role: 'Backend Developer • Real-time inference platform',
			domain: 'AI Product',
			overview:
				'The product required near real-time food recognition with stable processing throughput and consistent releases across multiple environments.',
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
			role: 'Software Engineer • Platform hardening initiative',
			domain: 'Platform Engineering',
			overview:
				'Growing LMS adoption created API bottlenecks and operational friction during peak usage periods, requiring a structured reliability push.',
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
