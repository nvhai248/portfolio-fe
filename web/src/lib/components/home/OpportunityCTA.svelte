<script lang="ts">
	import { resolve } from '$app/paths';
	import { localeFromPathname } from '$lib/i18n/locale';
	import { page } from '$app/state';
	import Reveal from '$lib/components/ui/ScrollReveal.svelte';

	interface Props {
		title: string;
		description: string;
		buttonLabel: string;
	}

	let { title, description, buttonLabel }: Props = $props();
	const locale = $derived(localeFromPathname(page.url.pathname));
</script>

<div
	class="relative overflow-hidden rounded-[2rem] bg-slate-100 p-7 dark:bg-slate-900 md:p-16 lg:p-20"
>

	<div class="relative z-10 mx-auto max-w-4xl text-center">
		<Reveal type="slide-up" delay={0}>
			<div class="mb-8 text-sm [color:var(--ui-text-muted)]">
				{locale === 'vi' ? 'Cùng trò chuyện nhé' : 'Open for Collaboration'}
			</div>
		</Reveal>
		<Reveal type="slide-up" delay={60}>
			<h2 class="ui-heading-hero mb-8 text-4xl sm:text-5xl lg:text-6xl">
				{title}
			</h2>
		</Reveal>
		<Reveal type="slide-up" delay={120}>
			<p class="ui-body-lg mb-12 mx-auto max-w-2xl">
				{description}
			</p>
		</Reveal>
		<Reveal type="slide-up" delay={180}>
			<a
				href={resolve('/[lang=locale]/contact', { lang: locale })}
				class="ui-btn ui-btn-primary min-h-14 px-8"
			>
				{buttonLabel}
				<span
					class="material-symbols-outlined ml-3 text-xl transition-transform duration-300 group-hover:translate-x-1"
				>
					rocket_launch
				</span>
			</a>
		</Reveal>
	</div>
</div>
