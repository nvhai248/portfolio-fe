import type {
	EducationContent,
	ExperienceItem,
	SectionIntroContent,
	TechSkillsContent
} from '$lib/types/content';
import { defineTechSkillsContent } from '$lib/content/validate';

export const cvIntro: SectionIntroContent = {
	eyebrow: 'Curriculum Vitae',
	title: 'Nguyen Van Hai',
	description:
		'Backend Engineer focused on scalable architecture, platform reliability, and pragmatic AI integration for production systems.'
};

export const experienceItems: ExperienceItem[] = [
	{
		role: 'Software Engineer',
		company: 'NashTech',
		employmentType: 'Full-time',
		location: 'Ho Chi Minh City, Vietnam',
		focus: 'LMS platforms, API reliability, and AI plugin integration',
		duration: '2021 — Present',
		impactSummary:
			'Own and deliver backend architecture across Moodle/LMS modules for enterprise education clients, balancing reliability, maintainability, and delivery speed in high-concurrency environments.',
		stack: ['Golang', 'PHP', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Azure'],
		highlights: [
			'Designed and implemented service boundaries for enrollment, grading, notification, and progress-tracking APIs.',
			'Built AI-assisted tutor and recommendation workflows with privacy-aware prompt and retrieval patterns.',
			'Led cross-team API contract reviews to reduce regressions between backend and frontend releases.',
			'Established operational runbooks and incident review loops that improved on-call response quality.'
		],
		achievements: [
			'Improved key API response time by ~40% via query optimization, cache strategy redesign, and endpoint refactoring.',
			'Reduced release rollback frequency by introducing explicit rollout gates and pre-production observability checks.',
			'Increased platform stability during peak learning events through capacity tuning and background-job hardening.',
			'Mentored junior engineers on API design and production debugging, improving team delivery predictability.'
		]
	},
	{
		role: 'Backend Developer',
		company: 'Microleap',
		employmentType: 'Full-time',
		location: 'Ho Chi Minh City, Vietnam',
		focus: 'AI food detection platform and event-driven processing services',
		duration: '2019 — 2021',
		impactSummary:
			'Built and maintained backend services for AI-powered food recognition products, focusing on reliable asynchronous pipelines and scalable inference orchestration.',
		stack: ['Golang', 'Python', 'PostgreSQL', 'Redis', 'Qdrant', 'Docker', 'Kubernetes', 'AWS'],
		highlights: [
			'Implemented event-driven ingestion and post-processing flows for image analysis lifecycle.',
			'Designed service decomposition for inference, metadata enrichment, and recommendation modules.',
			'Collaborated with ML engineers to stabilize model-serving handoffs and request contracts.',
			'Standardized containerized deployment templates for dev/staging/production consistency.'
		],
		achievements: [
			'Improved production stability by formalizing service contracts and idempotent worker design.',
			'Reduced operational friction with reusable CI/CD templates and environment configuration conventions.',
			'Enabled faster feature iteration by introducing clearer event schemas and debugging instrumentation.',
			'Supported vector-search integration for semantically richer recommendation and retrieval workflows.'
		]
	}
];

export const techSkillsContent: TechSkillsContent = defineTechSkillsContent({
	title: 'Tech Skills',
	description:
		'Hands-on capabilities used in production delivery, grouped by engineering responsibility rather than tool lists.',
	categories: [
		{
			heading: 'Languages',
			summary: 'Golang, TypeScript, PHP, C#/.NET',
			context: 'Applied for API services, plugin customization, and backend workflow automation.'
		},
		{
			heading: 'Backend',
			summary:
				'REST API design, service decomposition, event-driven processing, queue-based execution',
			context:
				'Built for high-traffic LMS and AI inference workloads with maintainable service boundaries.'
		},
		{
			heading: 'Data & AI',
			summary: 'PostgreSQL, Redis, Qdrant, Ollama, Vertex AI',
			context: 'Used for caching, retrieval, local LLM orchestration, and practical ML-backed features.'
		},
		{
			heading: 'Cloud & DevOps',
			summary: 'Azure, AWS, Docker, Kubernetes, Terraform, CI/CD pipelines',
			context:
				'Focused on reproducible deployments, release safety, and platform reliability at scale.'
		},
		{
			heading: 'Engineering Practices',
			summary:
				'Performance tuning, observability, architecture trade-off documentation, incident-informed iteration',
			context:
				'Used to keep teams aligned on outcomes, reduce delivery risk, and sustain long-term maintainability.',
			wide: true
		}
	]
});

export const education: EducationContent = {
	school: 'VNUHCM - University of Science',
	degree: 'Bachelor of Computer Science',
	details: 'GPA: 3.2 / 4.0 • Class of 2019',
	specialization: 'Software Engineering & Distributed Systems',
	coursework: [
		'Data Structures and Algorithms',
		'Database Systems',
		'Operating Systems',
		'Computer Networks',
		'Software Architecture and Design Patterns'
	],
	awards: ['Capstone project focused on scalable learning-platform backend architecture']
};
