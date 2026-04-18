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

<article class="ui-panel group relative overflow-hidden rounded-[3rem] p-10 shadow-2xl transition-all duration-500 hover:border-primary/20 dark:hover:border-blue-500/20 md:p-14">
	<div class="flex flex-wrap items-start justify-between gap-10 mb-14">
		<div class="min-w-0 space-y-4">
			<div class="flex items-center gap-4">
				<div class="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(30,64,175,0.4)] dark:bg-blue-500 dark:shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
				<h2 class="text-3xl font-black tracking-tighter [color:var(--ui-text)] sm:text-5xl">
					<a class="transition-colors hover:text-primary dark:hover:text-blue-400" href={`/${locale}/projects/${project.slug}`}>{project.title}</a>
				</h2>
			</div>
			<p class="font-mono text-[0.8rem] font-black uppercase tracking-[0.25em] [color:var(--ui-text-muted)]">
				{roleLabel}: <span class="[color:var(--ui-primary)] dark:text-blue-400">{project.role}</span>
			</p>
		</div>
		<span class="rounded-xl border border-primary/10 bg-primary/5 px-5 py-2.5 font-mono text-[0.7rem] font-black uppercase tracking-widest text-primary dark:border-blue-500/10 dark:bg-blue-500/5 dark:text-blue-400">
			{project.domain}
		</span>
	</div>

	<div class="grid gap-12 lg:grid-cols-3">
		<div class="space-y-6">
			<h3 class="text-[0.7rem] font-black uppercase tracking-[0.3em] [color:var(--ui-primary)] dark:text-blue-400">{overviewHeading}</h3>
			<p class="ui-body break-words">{project.overview}</p>
		</div>
		
		{#each project.detailLists as detail}
			<div class="space-y-6">
				<h3 class="text-[0.7rem] font-black uppercase tracking-[0.3em] [color:var(--ui-primary)] dark:text-blue-400 break-words">{detail.heading}</h3>
				<ul class="space-y-4">
					{#each detail.items as item}
						<li class="flex items-start gap-4 text-sm font-semibold [color:var(--ui-text-muted)]">
							<span class="mt-2 h-1 w-1 rounded-full [background-color:var(--ui-text-subtle)] opacity-50"></span>
							<span class="break-words leading-relaxed">{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="mt-16 flex flex-col gap-10 border-t [border-color:var(--ui-border)] pt-12 sm:flex-row sm:items-end sm:justify-between">
		<div class="space-y-6">
			<h3 class="text-[0.7rem] font-black uppercase tracking-[0.3em] [color:var(--ui-primary)] dark:text-blue-400">{stackHeading}</h3>
			<div class="flex flex-wrap gap-2.5">
				{#each project.techStack as tech}
					<span class="rounded-lg border [border-color:var(--ui-border)] [background-color:var(--ui-surface-soft)] px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-widest [color:var(--ui-text-muted)] transition-all hover:border-primary/30 hover:[color:var(--ui-primary)] dark:hover:border-blue-500/30 dark:hover:text-blue-400">
						{tech}
					</span>
				{/each}
			</div>
		</div>
		
		<div class="pt-6 sm:pt-0">
			<a 
				class="ui-btn ui-btn-primary glow-on-hover h-14 rounded-2xl text-[0.8rem] px-10 transition-all font-black uppercase tracking-widest" 
				href={`/${locale}/projects/${project.slug}`}
			>
				{detailLinkLabel}
			</a>
		</div>
	</div>
</article>
