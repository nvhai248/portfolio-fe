<script lang="ts">
	import { base } from '$app/paths';
	import { footerProfileLinks, primaryNavItems } from '$lib/content/navigation';

	const footerNavItems = primaryNavItems.filter((item) => item.href !== '/blog');
</script>

<footer class="border-t ui-divider bg-[var(--ui-surface-soft)]" data-testid="site-footer">
	<div class="page-shell grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
		<div class="space-y-4">
			<p class="ui-eyebrow">Open to selected opportunities</p>
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl [color:var(--ui-text)]">
				Building reliable backend systems with measurable business impact.
			</h2>
			<p class="ui-body max-w-xl">
				If you need a backend engineer to modernize architecture, improve performance, or ship AI-enabled
				features safely, let's connect.
			</p>
			<a href="mailto:nvhai2408@gmail.com" class="ui-link inline-flex items-center gap-2 text-sm">
				nvhai2408@gmail.com
				<span class="material-symbols-outlined text-base">north_east</span>
			</a>
		</div>

		<div class="grid gap-8 sm:grid-cols-2">
			<div>
				<h3 class="mb-3 text-sm font-semibold [color:var(--ui-text)]">Navigation</h3>
				<ul class="space-y-2 text-sm [color:var(--ui-text-muted)]">
					{#each footerNavItems as item}
						<li><a class="hover:text-primary" href={`${base}${item.href}`}>{item.label}</a></li>
					{/each}
				</ul>
			</div>
			<div>
				<h3 class="mb-3 text-sm font-semibold [color:var(--ui-text)]">Profiles</h3>
				<ul class="space-y-2 text-sm [color:var(--ui-text-muted)]">
					{#each footerProfileLinks as link}
						<li>
							<a
								class="hover:text-primary"
								href={link.external ? link.href : `${base}${link.href}`}
								target={link.external ? '_blank' : undefined}
								rel={link.external ? 'noreferrer' : undefined}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	<div class="border-t ui-divider py-4">
		<div class="page-shell flex flex-col items-start justify-between gap-2 text-xs [color:var(--ui-text-subtle)] sm:flex-row sm:items-center">
			<p>© {new Date().getFullYear()} Nguyen Van Hai. All rights reserved.</p>
			<p>Built with SvelteKit and a focus on performance, accessibility, and clarity.</p>
		</div>
	</div>
</footer>
