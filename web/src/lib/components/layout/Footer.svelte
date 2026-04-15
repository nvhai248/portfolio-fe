<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { getFooterProfileLinks, getPrimaryNavItems } from '$lib/content/navigation';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { localeFromPathname } from '$lib/i18n/locale';

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale));
	const footerNavItems = $derived(getPrimaryNavItems(locale).filter((item) => !item.href.endsWith('/blog')));
	const footerProfileLinks = $derived(getFooterProfileLinks(locale));
</script>

<footer class="border-t ui-divider bg-[var(--ui-surface-soft)]" data-testid="site-footer">
	<div class="page-shell grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
		<div class="space-y-4">
			<p class="ui-eyebrow">{t.footer.eyebrow}</p>
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl [color:var(--ui-text)]">{t.footer.title}</h2>
			<p class="ui-body max-w-xl">{t.footer.description}</p>
			<a href="mailto:nvhai2408@gmail.com" class="ui-link inline-flex items-center gap-2 text-sm">
				nvhai2408@gmail.com
				<span class="material-symbols-outlined text-base">north_east</span>
			</a>
		</div>

		<div class="grid gap-8 sm:grid-cols-2">
			<div>
				<h3 class="mb-3 text-sm font-semibold [color:var(--ui-text)]">{t.footer.navigation}</h3>
				<ul class="space-y-2 text-sm [color:var(--ui-text-muted)]">
					{#each footerNavItems as item}
						<li><a class="hover:text-primary" href={`${base}${item.href}`}>{item.label}</a></li>
					{/each}
				</ul>
			</div>
			<div>
				<h3 class="mb-3 text-sm font-semibold [color:var(--ui-text)]">{t.footer.profiles}</h3>
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
			<p>© {new Date().getFullYear()} Nguyen Van Hai. {t.footer.copyrightSuffix}</p>
			<p>{t.footer.builtWith}</p>
		</div>
	</div>
</footer>
