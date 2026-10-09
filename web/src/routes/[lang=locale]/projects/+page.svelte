<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import ProjectCard from '$lib/components/sections/ProjectCard.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getProjectsSchema } from '$lib/seo/schema';

	let { data }: { data: PageData } = $props();
	const projectsContent = $derived(data.projectsContent);

	const projectsSchema = $derived(
		getProjectsSchema({
			origin: page.url.origin,
			pathname: page.url.pathname,
			projects: projectsContent.items,
			locale: data.locale
		})
	);

	const registryLabel = $derived(
		data.locale === 'vi'
			? `DANH MỤC SẢN XUẤT: ${projectsContent.items.length} HỒ SƠ KIẾN TRÚC`
			: `PRODUCTION REGISTRY: ${projectsContent.items.length} ACTIVE SPECIFICATIONS`
	);
</script>

<SeoHead
	title={projectsContent.seo.title}
	description={projectsContent.seo.description}
	pathname={page.url.pathname}
	structuredData={projectsSchema}
	locale={data.locale}
/>

<section class="page-shell pb-8 pt-12 lg:pt-16">
	<SectionIntro content={projectsContent.intro} />

	<!-- Technical Index Bar -->
	<div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-y [border-color:var(--ui-border)] py-3 font-mono text-xs text-[var(--ui-text-subtle)]">
		<div class="flex items-center gap-2">
			<span class="inline-block w-2 h-2 rounded-full [background:var(--ui-status-ok,#00DC82)]"></span>
			<span class="font-bold [color:var(--ui-text)]">{registryLabel}</span>
		</div>
		<div class="flex items-center gap-4 text-[11px]">
			<span>DOMAINS: RETAIL POS // LMS // CLOUD DEVOPS // AGENTIC AI</span>
		</div>
	</div>
</section>

<section class="page-shell grid gap-8 pb-24">
	{#each projectsContent.items as project (project.slug)}
		<ProjectCard
			{project}
			overviewHeading={projectsContent.labels.overview}
			stackHeading={projectsContent.labels.techStack}
		/>
	{/each}
</section>
