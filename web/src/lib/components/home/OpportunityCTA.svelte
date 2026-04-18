<script lang="ts">
	import { base } from '$app/paths';
	import { localeFromPathname } from '$lib/i18n/locale';
	import { page } from '$app/state';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	interface Props {
		title: string;
		description: string;
		buttonLabel: string;
	}

	let { title, description, buttonLabel }: Props = $props();
	const locale = $derived(localeFromPathname(page.url.pathname));
</script>

<Reveal type="slide-up" duration={1200} threshold={0.2}>
	<div
		class="ui-panel relative overflow-hidden rounded-[3rem] p-12 shadow-3xl md:p-16 lg:p-24 transition-all duration-700 hover:shadow-primary/10"
	>
		<!-- Refined decorative elements -->
		<div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-[120px] dark:bg-blue-500/10 animate-pulse-slow"></div>
		<div class="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/2 blur-[100px] dark:bg-indigo-500/5"></div>

		<div class="relative z-10 mx-auto max-w-4xl text-center">
			<Reveal type="slide-up" delay={100}>
				<div class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] [color:var(--ui-primary)] dark:text-blue-400">
					Open for Collaboration
				</div>
			</Reveal>
			<Reveal type="slide-up" delay={200}>
				<h2 class="ui-heading-hero mb-8 text-4xl sm:text-5xl lg:text-6xl">
					{title}
				</h2>
			</Reveal>
			<Reveal type="slide-up" delay={300}>
				<p class="ui-body-lg mb-12 mx-auto max-w-2xl">
					{description}
				</p>
			</Reveal>
			<Reveal type="slide-up" delay={400}>
				<a
					href={`${base}/${locale}/contact`}
					class="ui-btn ui-btn-primary glow-on-hover h-16 min-w-[280px] rounded-2xl text-[0.85rem] transition-all"
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
</Reveal>
