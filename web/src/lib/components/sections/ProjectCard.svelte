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
	const detailLinkLabel = $derived(locale === 'vi' ? 'Xem chi tiết kiến trúc →' : 'View Architecture Spec →');
	const timelineLabel = $derived(locale === 'vi' ? 'THỜI GIAN:' : 'TIMELINE:');
	const stackLabel = $derived(locale === 'vi' ? 'CÔNG NGHỆ:' : 'STACK:');
	const orderCode = $derived(`SYS.${String(project.sortOrder || 1).padStart(2, '0')}`);
</script>

<article class="sys-project-card group relative border [border-color:var(--ui-border)] [background-color:var(--ui-surface)] transition-all duration-200 hover:border-[var(--ui-primary)]">
	<!-- Top Spec Bar: Station Code, Domain, and Timeline -->
	<div class="flex flex-wrap items-center justify-between gap-4 border-b [border-color:var(--ui-border-subtle)] px-6 py-4 font-mono text-xs sm:px-8">
		<div class="flex items-center gap-3">
			<span class="font-bold [color:var(--ui-primary)]">[{orderCode}]</span>
			<span class="font-semibold uppercase tracking-wider [color:var(--ui-text)]">{project.domain}</span>
		</div>
		{#if project.timeline}
			<div class="text-[var(--ui-text-subtle)]">
				<span>{timelineLabel} </span>
				<span class="font-semibold [color:var(--ui-text-muted)]">{project.timeline}</span>
			</div>
		{/if}
	</div>

	<!-- Main Content Body -->
	<div class="p-6 sm:p-8 space-y-8">
		<!-- Title and Role Definition -->
		<div class="space-y-3">
			<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight [color:var(--ui-text)]">
				<a class="transition-colors hover:[color:var(--ui-primary)]" href={`/${locale}/projects/${project.slug}`}>
					{project.title}
				</a>
			</h2>
			<p class="font-mono text-xs [color:var(--ui-text-subtle)]">
				{roleLabel}: <span class="font-semibold [color:var(--ui-text)]">{project.role}</span>
			</p>
		</div>

		<!-- 3-Column Structured Grid: Problem, Contributions, Impact -->
		<div class="grid gap-8 lg:grid-cols-3 pt-2">
			<!-- Column 1: Context & Problem -->
			<div class="space-y-3">
				<h3 class="font-mono text-xs font-bold uppercase tracking-wider [color:var(--ui-primary)]">
					// {overviewHeading}
				</h3>
				<p class="text-sm leading-relaxed [color:var(--ui-text-muted)]">
					{project.overview}
				</p>
			</div>

			<!-- Column 2 & 3: Detail Lists (Contributions & Impact) -->
			{#each project.detailLists as detail}
				<div class="space-y-3">
					<h3 class="font-mono text-xs font-bold uppercase tracking-wider [color:var(--ui-primary)]">
						// {detail.heading}
					</h3>
					<ul class="space-y-2.5">
						{#each detail.items as item}
							<li class="flex items-start gap-2.5 text-xs sm:text-[0.82rem] leading-relaxed [color:var(--ui-text-muted)]">
								<span class="font-mono [color:var(--ui-primary)] font-bold shrink-0">›</span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Footer: Tech Stack Chips & Action Link -->
		<div class="flex flex-col gap-6 pt-6 border-t [border-color:var(--ui-border-subtle)] sm:flex-row sm:items-center sm:justify-between">
			<div class="flex flex-wrap items-center gap-2">
				<span class="font-mono text-[11px] font-bold [color:var(--ui-text-subtle)] mr-2">{stackLabel}</span>
				{#each project.techStack as tech}
					<span class="border [border-color:var(--ui-border)] [background-color:var(--ui-bg-subtle,var(--ui-surface-soft))] px-2.5 py-1 font-mono text-[11px] [color:var(--ui-text-muted)] transition-colors group-hover:border-[var(--ui-border)]">
						{tech}
					</span>
				{/each}
			</div>

			<div class="shrink-0 pt-2 sm:pt-0">
				<a 
					class="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider [color:var(--ui-primary)] hover:underline underline-offset-4"
					href={`/${locale}/projects/${project.slug}`}
				>
					{detailLinkLabel}
				</a>
			</div>
		</div>
	</div>
</article>

<style>
	.sys-project-card {
		border-radius: 4px;
	}
</style>
