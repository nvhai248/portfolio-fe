<script lang="ts">
	import { projects, projectsIntro } from '$lib/content/projects';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import ProjectCard from '$lib/components/sections/ProjectCard.svelte';
</script>

<svelte:head>
	<title>Projects | Nguyen Van Hai</title>
	<meta
		name="description"
		content="Selected projects by Nguyen Van Hai with role, impact, stack, and measurable delivery outcomes."
	/>
</svelte:head>

<section class="page-shell pb-10 pt-14 lg:pt-20">
	<SectionIntro content={projectsIntro} />
</section>

<section class="page-shell grid gap-5 pb-20 sm:gap-6">
	{#each projects as project}
		<ProjectCard {project} />
	{/each}
</section>
