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

<footer class="relative mt-10 overflow-hidden border-t [border-color:var(--ui-border)] [background-color:var(--ui-bg-muted)] pt-12" data-testid="site-footer">
	<!-- Decorative glow -->
	<div class="absolute -top-24 left-1/2 h-32 w-full -translate-x-1/2 bg-blue-500/5 blur-[100px]"></div>
	<div class="absolute -bottom-24 left-1/2 h-32 w-full -translate-x-1/2 bg-blue-500/5 blur-[100px]"></div>

	<div class="page-shell relative z-10 grid gap-12 pb-12 lg:grid-cols-[1.2fr_1fr]">
		<div class="space-y-4">
			<div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-md dark:border-blue-500/10 dark:bg-blue-500/5 dark:text-blue-400">
				{t.footer.eyebrow}
			</div>
			<h2 class="text-2xl font-black tracking-tighter [color:var(--ui-text)] sm:text-3xl lg:max-w-md">
				{t.footer.title}
			</h2>
			<p class="ui-body max-w-md [color:var(--ui-text-muted)]">{t.footer.description}</p>
			
			<div class="flex flex-wrap gap-4 pt-4">
				<a href="mailto:nvhai2408@gmail.com" class="group flex items-center gap-3 rounded-2xl border [border-color:var(--ui-border)] [background-color:var(--ui-surface)] p-3 pr-6 transition-all hover:border-primary/20 hover:bg-primary/5">
					<div class="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400 transition-colors">
						<span class="material-symbols-outlined text-base">mail</span>
					</div>
					<div class="flex flex-col">
						<span class="text-[0.55rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">Connect via Email</span>
						<span class="font-mono text-xs font-bold [color:var(--ui-text)] transition-colors group-hover:text-primary dark:group-hover:text-blue-400">nvhai2408@gmail.com</span>
					</div>
				</a>
			</div>
		</div>

		<div class="grid gap-8 sm:grid-cols-2">
			<div class="ui-panel rounded-3xl p-8">
				<h3 class="mb-6 text-[0.65rem] font-black uppercase tracking-[0.3em] [color:var(--ui-primary)] dark:text-blue-400/80">{t.footer.navigation}</h3>
				<ul class="space-y-3">
					{#each footerNavItems as item}
						<li>
							<a class="text-xs font-black uppercase tracking-[0.16em] [color:var(--ui-text-muted)] transition-colors hover:text-primary dark:hover:text-blue-400" href={`${base}${item.href}`}>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="ui-panel rounded-3xl p-8">
				<h3 class="mb-6 text-[0.65rem] font-black uppercase tracking-[0.3em] [color:var(--ui-primary)] dark:text-blue-400/80">{t.footer.profiles}</h3>
				<ul class="space-y-3">
					{#each footerProfileLinks as link}
						<li>
							<a
								class="text-xs font-black uppercase tracking-[0.16em] [color:var(--ui-text-muted)] transition-colors hover:text-primary dark:hover:text-blue-400"
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
	
	<div class="border-t [border-color:var(--ui-border)] [background-color:var(--ui-bg)] py-10">
		<div class="page-shell flex flex-col items-center justify-between gap-6 text-[0.65rem] font-black uppercase tracking-[0.2em] [color:var(--ui-text-subtle)] sm:flex-row">
			<p>© {new Date().getFullYear()} Nguyen Van Hai. {t.footer.copyrightSuffix}</p>
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-2">
					<span class="relative flex h-2 w-2">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
					</span>
					<span>{t.footer.builtWith}</span>
				</div>
			</div>
		</div>
	</div>
</footer>
