<script lang="ts">
	import { page } from '$app/state';
	import { blogBacklogMessage, blogIntro } from '$lib/content/blog';
	import RecentPostCard from '$lib/components/sections/RecentPostCard.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SeoHead
	title="Blog | Nguyen Van Hai"
	description="Technical insights by Nguyen Van Hai on backend engineering, architecture decisions, and practical AI implementation."
	pathname={page.url.pathname}
/>

<section class="page-shell max-w-5xl pb-16 pt-14 lg:pt-20">
	<div class="space-y-12">
		<!-- Tech Editorial Header -->
		<div class="max-w-2xl">
			<span class="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.2em] text-blue-400 backdrop-blur-md">
				Technical Archives
			</span>
			<h1 class="text-4xl font-black tracking-tight text-white sm:text-6xl">
				Insights & <span class="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent underline decoration-blue-500/20 underline-offset-8">Engineering</span> Log.
			</h1>
			<p class="ui-body-lg mt-8 text-slate-400">
				Deep dives into backend architecture, system resilience, and modern AI delivery.
			</p>
		</div>

		<!-- Holographic Filter HUD -->
		<div class="glass-card flex flex-wrap items-center gap-4 rounded-2xl p-4 shadow-2xl backdrop-blur-xl border-white/10 sm:p-6">
			<div class="relative flex-1">
				<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
				<input 
					type="text" 
					placeholder="Search technical archives..." 
					class="w-full rounded-xl bg-white/5 py-3 pl-12 pr-4 text-sm font-medium text-slate-200 placeholder-slate-500 outline-none ring-1 ring-white/10 transition-all focus:bg-white/10 focus:ring-blue-500/50"
				/>
			</div>
			<div class="hidden gap-2 sm:flex">
				<button class="rounded-xl bg-blue-500 px-6 py-3 text-[0.7rem] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">All Posts</button>
				<button class="rounded-xl bg-white/5 px-6 py-3 text-[0.7rem] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/10">Architecture</button>
				<button class="rounded-xl bg-white/5 px-6 py-3 text-[0.7rem] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/10">AI/ML</button>
			</div>
		</div>
	</div>
</section>

<section class="page-shell max-w-5xl pb-24">
	{#if data.posts?.length}
		<div class="grid gap-12 md:grid-cols-2">
			{#each data.posts as post (post._id)}
				<RecentPostCard {post} />
			{/each}
		</div>
	{:else}
		<div class="glass-panel border-dashed rounded-3xl p-12 text-center">
			<div class="flex flex-col items-center gap-4">
				<span class="material-symbols-outlined text-4xl text-blue-500/40">auto_stories</span>
				<h2 class="text-2xl font-black tracking-tight text-white">More posts in progress</h2>
				<p class="ui-body max-w-sm mx-auto text-slate-400">{blogBacklogMessage}</p>
			</div>
		</div>
	{/if}
</section>
