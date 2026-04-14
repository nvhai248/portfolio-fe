<script lang="ts">
	import { page } from '$app/state';
	import { projectsContent } from '$lib/content/projects';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import ProjectCard from '$lib/components/sections/ProjectCard.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getProjectsSchema } from '$lib/seo/schema';

	const projectsSchema = $derived(
		getProjectsSchema({
			origin: page.url.origin,
			pathname: page.url.pathname,
			projects: projectsContent.items
		})
	);
</script>

<SeoHead
	title={projectsContent.seo.title}
	description={projectsContent.seo.description}
	pathname={page.url.pathname}
	structuredData={projectsSchema}
/>

<section class="page-shell pb-10 pt-14 lg:pt-20">
	<SectionIntro content={projectsContent.intro} />
</section>

<section class="page-shell grid gap-5 pb-20 sm:gap-6">
	{#each projectsContent.items as project}
		<ProjectCard
			{project}
			overviewHeading={projectsContent.labels.overview}
			stackHeading={projectsContent.labels.techStack}
		/>
	{/each}
</section>
