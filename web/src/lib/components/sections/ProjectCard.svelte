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

<article class="ui-panel rounded-2xl p-5 sm:p-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div class="min-w-0">
			<h2 class="ui-heading-2 break-words">
				<a class="transition-colors hover:text-primary" href={`/${locale}/projects/${project.slug}`}>{project.title}</a>
			</h2>
			<p class="ui-muted mt-1 break-words">{roleLabel}: {project.role}</p>
		</div>
		<span class="ui-chip max-w-full whitespace-normal break-words px-3 uppercase tracking-wide">{project.domain}</span>
	</div>

	<div class="mt-5 grid gap-4 sm:gap-5 lg:grid-cols-3">
		<div class="min-w-0">
			<h3 class="text-sm font-semibold [color:var(--ui-text)]">{overviewHeading}</h3>
			<p class="mt-2 text-sm leading-relaxed [color:var(--ui-text-muted)] break-words">{project.overview}</p>
		</div>
		{#each project.detailLists as detail}
			<div class="min-w-0">
				<h3 class="text-sm font-semibold [color:var(--ui-text)] break-words">{detail.heading}</h3>
				<ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm [color:var(--ui-text-muted)]">
					{#each detail.items as item}
						<li class="break-words">{item}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="mt-5 border-t ui-divider pt-4 sm:pt-5">
		<h3 class="text-sm font-semibold [color:var(--ui-text)]">{stackHeading}</h3>
		<p class="mt-2 text-sm [color:var(--ui-text-muted)] break-words">{project.techStack.join(', ')}</p>
		<div class="mt-4">
			<a class="ui-link text-sm" href={`/${locale}/projects/${project.slug}`}>{detailLinkLabel}</a>
		</div>
	</div>
</article>
