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
		class="glass-panel relative overflow-hidden rounded-[2.5rem] p-10 shadow-2xl md:p-14 lg:p-20 transition-all duration-700 hover:shadow-blue-500/10"
	>
		<!-- Advanced decorative gradients -->
		<div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow"></div>
		<div class="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px]"></div>

		<div class="relative z-10 mx-auto max-w-3xl text-center">
			<Reveal type="slide-up" delay={100}>
				<h2 class="ui-heading-2 mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
					{title}
				</h2>
			</Reveal>
			<Reveal type="slide-up" delay={200}>
				<p class="ui-body-lg mb-12 text-slate-400">
					{description}
				</p>
			</Reveal>
			<Reveal type="slide-up" delay={300}>
				<a
					href={`${base}/${locale}/contact`}
					class="ui-btn ui-btn-primary glow-on-hover h-14 min-w-[240px] rounded-2xl text-[0.8rem] transition-all"
				>
					{buttonLabel}
					<span
						class="material-symbols-outlined ml-3 text-lg transition-transform duration-300 group-hover:translate-x-1"
					>
						rocket_launch
					</span>
				</a>
			</Reveal>
		</div>
	</div>
</Reveal>
