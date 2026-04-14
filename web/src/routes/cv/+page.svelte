<script lang="ts">
	import { page } from '$app/state';
	import { cvIntro, education, experienceItems, techSkillsContent } from '$lib/content/cv';
	import ExperienceCard from '$lib/components/sections/ExperienceCard.svelte';
	import SkillGrid from '$lib/components/sections/SkillGrid.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead
	title="CV | Nguyen Van Hai"
	description="CV of Nguyen Van Hai — backend engineering experience, technical capabilities, and measurable project outcomes."
	pathname={page.url.pathname}
/>

<section class="page-shell max-w-5xl pb-12 pt-14 lg:pt-20">
	<div class="flex flex-col gap-6 border-b ui-divider pb-10 md:flex-row md:items-end md:justify-between">
		<div class="min-w-0">
			<p class="ui-eyebrow">{cvIntro.eyebrow}</p>
			<h1 class="ui-heading-1 mt-3 break-words">{cvIntro.title}</h1>
			<p class="ui-body-lg mt-3 max-w-2xl break-words">{cvIntro.description}</p>
		</div>
		<a href="mailto:nvhai2408@gmail.com" class="ui-btn ui-btn-primary md:shrink-0">Request full CV (PDF)</a>
	</div>
</section>

<section class="page-shell max-w-5xl pb-10">
	<h2 class="ui-heading-2">Experience</h2>
	<div class="mt-6 space-y-5">
		{#each experienceItems as item}
			<ExperienceCard {item} />
		{/each}
	</div>
</section>

<section class="page-shell max-w-5xl pb-20">
	<h2 class="ui-heading-2">{techSkillsContent.title}</h2>
	<p class="ui-body mt-3 max-w-3xl break-words">{techSkillsContent.description}</p>

	<SkillGrid items={techSkillsContent.categories} />
</section>

<section class="page-shell max-w-5xl pb-20 pt-2">
	<div class="ui-panel p-5 sm:p-6 lg:max-w-2xl">
		<h2 class="ui-heading-3">Education</h2>
		<div class="mt-4 space-y-2 text-sm [color:var(--ui-text-muted)]">
			<p><strong class="[color:var(--ui-text)]">{education.school}</strong></p>
			<p>{education.degree}</p>
			<p>{education.details}</p>
		</div>
	</div>
</section>
