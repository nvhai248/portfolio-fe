<script lang="ts">
	import { page } from '$app/state';
	import { localeFromPathname } from '$lib/i18n/locale';
	import type { ProjectContent } from '$lib/types/content';

	interface Props {
		project: ProjectContent;
		overviewHeading: string;
		stackHeading: string;
	}

	let { project, overviewHeading, stackHeading }: Props = $props();
	const locale = $derived(localeFromPathname(page.url.pathname));
	const roleLabel = $derived(locale === 'vi' ? 'Vai trò' : 'Role');
	const detailLinkLabel = $derived(locale === 'vi' ? 'Xem chi tiết dự án →' : 'View project details →');
</script>

<article class="glass-panel group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 hover:border-blue-500/20 md:p-10">
	<div class="flex flex-wrap items-start justify-between gap-8 mb-10">
		<div class="min-w-0 space-y-3">
			<div class="flex items-center gap-3">
				<div class="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
				<h2 class="text-2xl font-black tracking-tight text-white sm:text-4xl">
					<a class="transition-colors hover:text-blue-400" href={`/${locale}/projects/${project.slug}`}>{project.title}</a>
				</h2>
			</div>
			<p class="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-slate-500">
				{roleLabel}: <span class="text-slate-300">{project.role}</span>
			</p>
		</div>
		<span class="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-2 font-mono text-[0.65rem] font-black uppercase tracking-widest text-blue-400">
			{project.domain}
		</span>
	</div>

	<div class="grid gap-10 lg:grid-cols-3">
		<div class="space-y-4">
			<h3 class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-blue-500">{overviewHeading}</h3>
			<p class="text-sm leading-relaxed text-slate-400 break-words">{project.overview}</p>
		</div>
		
		{#each project.detailLists as detail}
			<div class="space-y-4">
				<h3 class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-blue-500 break-words">{detail.heading}</h3>
				<ul class="space-y-3">
					{#each detail.items as item}
						<li class="flex items-start gap-3 text-xs font-medium text-slate-500">
							<span class="mt-1.5 h-1 w-1 rounded-full bg-slate-700"></span>
							<span class="break-words">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="mt-12 flex flex-col gap-8 border-t border-white/5 pt-10 sm:flex-row sm:items-end sm:justify-between">
		<div class="space-y-4">
			<h3 class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-blue-500">{stackHeading}</h3>
			<div class="flex flex-wrap gap-2">
				{#each project.techStack as tech}
					<span class="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-widest text-slate-500 transition-colors hover:border-blue-500/20 hover:text-slate-300">
						{tech}
					</span>
				{/each}
			</div>
		</div>
		
		<div class="pt-4 sm:pt-0">
			<a 
				class="ui-btn ui-btn-primary glow-on-hover h-12 rounded-xl text-[0.7rem] px-8 transition-all" 
				href={`/${locale}/projects/${project.slug}`}
			>
				{detailLinkLabel}
			</a>
		</div>
	</div>
</article>
