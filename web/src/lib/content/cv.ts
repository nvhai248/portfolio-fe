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
		role: 'Software Engineer — NashTech',
		focus: 'LMS platforms, API reliability, and AI plugin integration',
		duration: '2021 — Present',
		achievements: [
			'Led backend architecture decisions for LMS modules serving high-concurrency learning environments.',
			'Delivered AI-assisted tutor and recommendation workflows with privacy-aware infrastructure choices.',
			'Improved key API response time by ~40% through query optimization, caching, and endpoint redesign.',
			'Strengthened release reliability with clearer rollout gates, observability, and incident feedback loops.'
		]
	},
	{
		role: 'Backend Developer — Microleap',
		focus: 'AI food detection platform and event-driven processing services',
		duration: '2019 — 2021',
		achievements: [
			'Built backend services and event pipelines for real-time image analysis and data processing.',
			'Implemented vector search workflows and service decomposition for scalable inference execution.',
			'Standardized Docker/Kubernetes deployment patterns to improve environment consistency.',
			'Improved production stability through better service contracts and operational visibility.'
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
	details: 'GPA: 3.2 / 4.0 • Class of 2019'
};
