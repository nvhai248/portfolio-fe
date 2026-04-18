<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getDictionary } from '$lib/i18n/dictionary';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const t = $derived(getDictionary(locale).tools);

	const toolsList = $derived([
		{
			id: 'salary',
			path: `/${locale}/tools/salary`,
			icon: 'calculate',
			title: t.salary.title,
			description: t.salary.description
		},
		{
			id: 'image',
			path: `/${locale}/tools/image`,
			icon: 'imagesmode',
			title: t.image.title,
			description: t.image.description
		},
		{
			id: 'music',
			path: `/${locale}/tools/music`,
			icon: 'headphones',
			title: t.music.title,
			description: t.music.description
		}
	]);
</script>

<SeoHead title={t.seoTitle} description={t.seoDescription} pathname={page.url.pathname} locale={locale} />

<div class="relative overflow-hidden pt-12">
	<!-- Background Decorative Elements -->
	<div class="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10"></div>

	<div class="page-shell pb-24 pt-16 lg:pb-32 lg:pt-24">
		<Reveal type="slide-up">
			<div class="mb-16 text-center">
				<p class="ui-eyebrow mb-4">Utilities</p>
				<h1 class="ui-heading-hero mb-6">{t.title}</h1>
				<p class="ui-body-lg mx-auto max-w-xl text-balance opacity-80">{t.description}</p>
			</div>
		</Reveal>

		<div class="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each toolsList as tool, index}
				<Reveal type="slide-up" delay={150 * (index + 1)}>
					<a href={tool.path} class="ui-card-link group block p-6">
						<div class="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-all group-hover:bg-primary/10 group-hover:scale-110 group-hover:shadow-lg dark:bg-blue-500/5 dark:text-blue-400 dark:ring-blue-500/10">
							<span class="material-symbols-outlined text-3xl">{tool.icon}</span>
						</div>
						<h3 class="ui-card-title mb-2">{tool.title}</h3>
						<p class="ui-body-sm">{tool.description}</p>
						<div class="mt-6 flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
							{locale === 'vi' ? 'Mở công cụ' : 'Open tool'}
							<span class="material-symbols-outlined ml-1.5 text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
						</div>
					</a>
				</Reveal>
			{/each}
		</div>
	</div>
</div>
