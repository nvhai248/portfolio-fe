<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import SalaryCalculator from '$lib/components/tools/salary/SalaryCalculator.svelte';
	import SalaryArticle from '$lib/components/tools/salary/SalaryArticle.svelte';
	import { getDictionary } from '$lib/i18n/dictionary';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const t = $derived(getDictionary(locale).tools.salary);
</script>

<SeoHead title={t.title} description={t.description} pathname={page.url.pathname} locale={locale} />

<div class="page-shell pt-32 pb-24 lg:pt-40">
	<div class="mx-auto max-w-4xl">
		<Reveal type="slide-up">
			<a href={`/${locale}/tools`} class="ui-link text-sm mb-6 inline-block">
				&larr; {locale === 'vi' ? 'Quay lại Công cụ' : 'Back to Tools'}
			</a>
			<div class="mb-12">
				<h1 class="ui-heading-2 mb-4">{t.title}</h1>
				<p class="ui-body-lg opacity-80">{t.description}</p>
			</div>
		</Reveal>

		<Reveal type="slide-up" delay={150}>
			<SalaryCalculator />
		</Reveal>

		<Reveal type="slide-up" delay={200}>
			<SalaryArticle />
		</Reveal>
	</div>
</div>
