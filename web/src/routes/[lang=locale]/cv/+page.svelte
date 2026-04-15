<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import ExperienceCard from '$lib/components/sections/ExperienceCard.svelte';
	import SkillGrid from '$lib/components/sections/SkillGrid.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getDictionary } from '$lib/i18n/dictionary';

	let { data }: { data: PageData } = $props();
	const cvContent = $derived(data.cvContent);
	const t = $derived(getDictionary(data.locale));
</script>

<SeoHead title={cvContent.seo.title} description={cvContent.seo.description} pathname={page.url.pathname} locale={data.locale} />

<section class="page-shell max-w-5xl pb-12 pt-14 lg:pt-20">
	<div class="flex flex-col gap-6 border-b ui-divider pb-10 md:flex-row md:items-end md:justify-between">
		<div class="min-w-0">
			<p class="ui-eyebrow">{cvContent.intro.eyebrow}</p>
			<h1 class="ui-heading-1 mt-3 break-words">{cvContent.intro.title}</h1>
			<p class="ui-body-lg mt-3 max-w-2xl break-words">{cvContent.intro.description}</p>
		</div>
		<a href={`mailto:${cvContent.contactEmail}`} class="ui-btn ui-btn-primary md:shrink-0">{t.cv.requestPdf}</a>
	</div>
</section>

<section class="page-shell max-w-5xl pb-10">
	<h2 class="ui-heading-2">{t.cv.experience}</h2>
	<div class="mt-6 space-y-5">
		{#each cvContent.experienceItems as item}
			<ExperienceCard {item} />
		{/each}
	</div>
</section>

<section class="page-shell max-w-5xl pb-20">
	<h2 class="ui-heading-2">{cvContent.techSkills.title}</h2>
	<p class="ui-body mt-3 max-w-3xl break-words">{cvContent.techSkills.description}</p>

	<SkillGrid items={cvContent.techSkills.categories} />
</section>

<section class="page-shell max-w-5xl pb-20 pt-2">
	<div class="ui-panel p-5 sm:p-6 lg:max-w-3xl">
		<h2 class="ui-heading-3">{t.cv.education}</h2>
		<div class="mt-4 space-y-2 text-sm [color:var(--ui-text-muted)]">
			<p><strong class="[color:var(--ui-text)]">{cvContent.education.school}</strong></p>
			<p>{cvContent.education.degree}</p>
			<p>{cvContent.education.details}</p>
			{#if cvContent.education.specialization}
				<p>{t.cv.specialization}: {cvContent.education.specialization}</p>
			{/if}
		</div>
		{#if cvContent.education.coursework && cvContent.education.coursework.length > 0}
			<div class="mt-4">
				<p class="ui-body-sm [color:var(--ui-text)]">{t.cv.coursework}</p>
				<ul class="mt-2 list-disc space-y-1 pl-5 text-sm [color:var(--ui-text-muted)]">
					{#each cvContent.education.coursework as course}
						<li>{course}</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if cvContent.education.awards && cvContent.education.awards.length > 0}
			<div class="mt-4">
				<p class="ui-body-sm [color:var(--ui-text)]">{t.cv.achievements}</p>
				<ul class="mt-2 list-disc space-y-1 pl-5 text-sm [color:var(--ui-text-muted)]">
					{#each cvContent.education.awards as award}
						<li>{award}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</section>
