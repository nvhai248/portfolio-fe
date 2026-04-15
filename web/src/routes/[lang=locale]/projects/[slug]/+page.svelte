<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getProjectDetailSchema } from '$lib/seo/schema';
	import { getDictionary } from '$lib/i18n/dictionary';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const t = $derived(getDictionary(data.locale));

	const pageTitle = $derived(`${project.title} | ${data.locale === 'vi' ? 'Dự án' : 'Projects'} | Nguyen Van Hai`);
	const detailSchema = $derived(
		getProjectDetailSchema({
			origin: page.url.origin,
			pathname: page.url.pathname,
			project,
			locale: data.locale
		})
	);
</script>

<SeoHead
	title={pageTitle}
	description={project.overview}
	pathname={page.url.pathname}
	structuredData={detailSchema}
	locale={data.locale}
/>

<section class="page-shell pb-8 pt-14 lg:pt-20">
	<a class="ui-link text-sm" href={`/${data.locale}/projects`}>{t.projectDetail.back}</a>
	<div class="mt-4 flex flex-wrap items-start justify-between gap-4">
		<div class="min-w-0">
			<h1 class="ui-heading-1 break-words">{project.title}</h1>
			<p class="ui-muted mt-2 break-words">{project.role}</p>
		</div>
		<span class="ui-chip max-w-full whitespace-normal break-words px-3 uppercase tracking-wide">{project.domain}</span>
	</div>
	{#if project.timeline || project.teamContext}
		<div class="mt-5 grid gap-3 rounded-xl border ui-divider p-4 text-sm [color:var(--ui-text-muted)] md:grid-cols-2">
			{#if project.timeline}
				<p><span class="font-semibold [color:var(--ui-text)]">{t.projectDetail.timeline}:</span> {project.timeline}</p>
			{/if}
			{#if project.teamContext}
				<p><span class="font-semibold [color:var(--ui-text)]">{t.projectDetail.teamContext}:</span> {project.teamContext}</p>
			{/if}
		</div>
	{/if}
</section>

<section class="page-shell grid gap-5 pb-20">
	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.problemStatement}</h2>
		<p class="mt-3 text-sm leading-relaxed [color:var(--ui-text-muted)]">{project.problemStatement}</p>
	</article>

	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.responsibilities}</h2>
		<ul class="mt-3 list-disc space-y-2 pl-5 text-sm [color:var(--ui-text-muted)]">
			{#each project.responsibilities as item}
				<li>{item}</li>
			{/each}
		</ul>
	</article>

	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.architectureHighlights}</h2>
		<ul class="mt-3 list-disc space-y-2 pl-5 text-sm [color:var(--ui-text-muted)]">
			{#each project.architectureHighlights as item}
				<li>{item}</li>
			{/each}
		</ul>
	</article>

	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.deliveryOutcomes}</h2>
		<ul class="mt-3 list-disc space-y-2 pl-5 text-sm [color:var(--ui-text-muted)]">
			{#each project.deliveryOutcomes as item}
				<li>{item}</li>
			{/each}
		</ul>
	</article>

	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.lessonsLearned}</h2>
		<ul class="mt-3 list-disc space-y-2 pl-5 text-sm [color:var(--ui-text-muted)]">
			{#each project.lessonsLearned as item}
				<li>{item}</li>
			{/each}
		</ul>
	</article>

	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.contributions}</h2>
		<div class="mt-4 grid gap-4 md:grid-cols-2">
			{#each project.detailLists as detail}
				<div>
					<h3 class="text-sm font-semibold [color:var(--ui-text)]">{detail.heading}</h3>
					<ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm [color:var(--ui-text-muted)]">
						{#each detail.items as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</article>

	<article class="ui-panel rounded-2xl p-5 sm:p-6">
		<h2 class="ui-heading-3">{t.projectDetail.techStack}</h2>
		<p class="mt-3 text-sm [color:var(--ui-text-muted)]">{project.techStack.join(', ')}</p>

		{#if project.links?.length}
			<div class="mt-4 flex flex-wrap gap-3">
				{#each project.links as link}
					<a class="ui-link text-sm" href={link.url}>{link.label}</a>
				{/each}
			</div>
		{/if}
	</article>
</section>
