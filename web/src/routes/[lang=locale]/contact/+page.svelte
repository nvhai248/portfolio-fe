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

<div class="relative overflow-hidden pt-12">
	<!-- Background Decorative Elements -->
	<div class="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10"></div>
	<div class="pointer-events-none absolute top-1/2 left-0 -z-10 size-[400px] -translate-y-1/2 rounded-full bg-blue-400/5 blur-[100px] dark:bg-blue-400/10"></div>

	<div class="page-shell pb-24 pt-16 lg:pb-32 lg:pt-24">
		<div class="mx-auto max-w-3xl">
			<Reveal type="slide-up">
				<div class="mb-16 text-center">
					<p class="ui-eyebrow mb-4">Get in Touch</p>
					<h1 class="ui-heading-hero mb-6">{t.title}</h1>
					<p class="ui-body-lg mx-auto max-w-xl text-balance opacity-80">{t.description}</p>
				</div>
			</Reveal>

			<div class="relative">
				<ContactForm locale={data.locale} />
			</div>
		</div>
	</div>
</div>
