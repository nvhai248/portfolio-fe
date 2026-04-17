<script lang="ts">
	import type { PageData } from './$types';
	import { getDictionary } from '$lib/i18n/dictionary';
	import ContactForm from '$lib/components/sections/ContactForm.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	let { data }: { data: PageData } = $props();
	const t = $derived(getDictionary(data.locale).contact);
</script>

<SeoHead
	title={t.seoTitle}
	description={t.seoDescription}
	pathname={data.pathname}
	type="website"
/>

<div class="page-shell py-16 lg:py-24">
	<div class="mx-auto max-w-3xl">
		<Reveal type="slide-up">
			<div class="mb-12 text-center">
				<h1 class="ui-heading-hero mb-4">{t.title}</h1>
				<p class="ui-body-lg mx-auto max-w-xl">{t.description}</p>
			</div>
		</Reveal>

		<Reveal type="fade" delay={200}>
			<ContactForm locale={data.locale} />
		</Reveal>
	</div>
</div>
