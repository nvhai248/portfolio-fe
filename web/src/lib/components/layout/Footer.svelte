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

<footer class="relative mt-10 overflow-hidden border-t border-white/5 bg-slate-950/30 pt-12" data-testid="site-footer">
	<!-- Decorative glow -->
	<div class="absolute -top-24 left-1/2 h-32 w-full -translate-x-1/2 bg-blue-500/10 blur-[100px]"></div>
	<div class="absolute -bottom-24 left-1/2 h-32 w-full -translate-x-1/2 bg-blue-500/10 blur-[100px]"></div>

	<div class="page-shell relative z-10 grid gap-12 pb-12 lg:grid-cols-[1.2fr_1fr]">
		<div class="space-y-2">
			<div class="inline-flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-500/5 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-blue-500/80 backdrop-blur-md">
				{t.footer.eyebrow}
			</div>
			<h2 class="text-2xl font-black tracking-tight text-white sm:text-3xl lg:max-w-md">
				{t.footer.title}
			</h2>
			<p class="ui-body max-w-md text-slate-500">{t.footer.description}</p>
			
			<div class="flex flex-wrap gap-4 pt-2">
				<a href="mailto:nvhai2408@gmail.com" class="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 pr-5 transition-all hover:border-blue-500/20 hover:bg-white/10">
					<div class="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
						<span class="material-symbols-outlined text-base">mail</span>
					</div>
					<div class="flex flex-col">
						<span class="text-[0.5rem] font-black uppercase tracking-widest text-slate-600">Direct Command</span>
						<span class="font-mono text-xs text-slate-300 transition-colors group-hover:text-blue-400">nvhai2408@gmail.com</span>
					</div>
				</a>
			</div>
		</div>

		<div class="grid gap-6 sm:grid-cols-2">
			<div class="glass-card rounded-2xl p-6">
				<h3 class="mb-4 text-[0.6rem] font-black uppercase tracking-[0.25em] text-blue-500/70">{t.footer.navigation}</h3>
				<ul class="space-y-3">
					{#each footerNavItems as item}
						<li>
							<a class="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-blue-400" href={`${base}${item.href}`}>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="glass-card rounded-2xl p-6">
				<h3 class="mb-4 text-[0.6rem] font-black uppercase tracking-[0.25em] text-blue-500/70">{t.footer.profiles}</h3>
				<ul class="space-y-3">
					{#each footerProfileLinks as link}
						<li>
							<a
								class="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-blue-400"
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
	
	<div class="border-t border-white/5 bg-slate-950/80 py-8 backdrop-blur-md">
		<div class="page-shell flex flex-col items-center justify-between gap-4 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-600 sm:flex-row">
			<p>© {new Date().getFullYear()} Nguyen Van Hai. {t.footer.copyrightSuffix}</p>
			<p class="flex items-center gap-2">
				<span class="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
				{t.footer.builtWith}
			</p>
		</div>
	</div>
</footer>
