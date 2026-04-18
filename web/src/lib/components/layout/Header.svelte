<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { getPrimaryNavItems } from '$lib/content/navigation';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { localeLabels, locales } from '$lib/i18n/config';
	import { localeFromPathname, localizePath } from '$lib/i18n/locale';
	import { theme } from '$lib/stores/theme.svelte';

	let isMenuOpen = $state(false);
	let isLangOpen = $state(false);

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale));
	const navItems = $derived(getPrimaryNavItems(locale));

	const isActive = (href: string) => page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	const closeMenu = () => {
		isMenuOpen = false;
	};
</script>

<header class="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2">
	<div class="glass-card flex h-16 items-center justify-between rounded-2xl px-4 py-2 shadow-2xl backdrop-blur-xl border-white/10 sm:px-6">
		<a
			class="group inline-flex min-w-0 items-center gap-2.5"
			href={`${base}/${locale}`}
			onclick={closeMenu}
			aria-label={t.header.homeAriaLabel}
		>
			<div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
				<span class="material-symbols-outlined text-lg">deployed_code</span>
			</div>
			<div class="flex min-w-0 flex-col">
				<span class="truncate text-sm font-semibold leading-none [color:var(--ui-text)]">Nguyen Van Hai</span>
				<span class="hidden text-xs leading-none [color:var(--ui-text-subtle)] min-[420px]:block">{t.header.jobTitle}</span>
			</div>
		</a>

		<nav class="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
			{#each navItems as item}
				<a 
					href={`${base}${item.href}`} 
					class={`px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:text-primary dark:hover:text-blue-400 ${isActive(item.href) ? 'text-primary bg-primary/5 rounded-lg dark:text-blue-400 dark:bg-blue-500/5' : '[color:var(--ui-text-muted)]'}`}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<!-- Language Switcher (Desktop) -->
			<div class="relative hidden sm:block">
				<button
					type="button"
					onclick={() => (isLangOpen = !isLangOpen)}
					class={`ui-icon-btn transition-transform active:scale-95 ${isLangOpen ? 'border-primary/30 bg-primary/5 text-primary' : ''}`}
					aria-label={t.header.toggleLanguage || 'Toggle Language'}
					aria-expanded={isLangOpen}
					data-testid="language-toggle"
				>
					<span class="material-symbols-outlined text-xl">language</span>
				</button>

				{#if isLangOpen}
					<div
						class="ui-dropdown animate-in fade-in slide-in-from-top-1 duration-200"
						role="menu"
						tabindex="-1"
						aria-orientation="vertical"
					>
						{#each locales as code}
							<a
								href={localizePath(page.url.pathname, code)}
								class={`ui-dropdown-item ${code === locale ? 'ui-dropdown-item-active' : ''}`}
								onclick={() => (isLangOpen = false)}
								role="menuitem"
								data-testid={`language-link-${code}`}
							>
								<span class="truncate">{localeLabels[code]}</span>
								{#if code === locale}
									<span class="material-symbols-outlined ml-auto text-[14px]">check</span>
								{/if}
							</a>
						{/each}
					</div>

					<!-- Click outside backdrop -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="fixed inset-0 z-40 h-screen w-screen" onclick={() => (isLangOpen = false)}></div>
				{/if}
			</div>
			<a href={`${base}/${locale}/contact`} class="ui-btn ui-btn-primary hidden h-10 px-4 sm:inline-flex">{t.header.letTalk}</a>
			<button
				type="button"
				onclick={() => theme.toggle()}
				class="ui-icon-btn"
				aria-label={t.header.toggleTheme}
				aria-pressed={theme.current === 'dark'}
				data-testid="theme-toggle"
			>
				<span class="material-symbols-outlined text-xl">{theme.current === 'dark' ? 'light_mode' : 'dark_mode'}</span>
			</button>
			<button
				type="button"
				onclick={() => (isMenuOpen = !isMenuOpen)}
				class="ui-icon-btn md:hidden"
				aria-label={t.header.toggleMenu}
				aria-expanded={isMenuOpen}
				aria-controls="mobile-navigation"
			>
				<span class="material-symbols-outlined text-xl">{isMenuOpen ? 'close' : 'menu'}</span>
			</button>
		</div>
	</div>

	{#if isMenuOpen}
		<nav id="mobile-navigation" class="mt-4 animate-in fade-in slide-in-from-top-4 duration-300 md:hidden" aria-label="Mobile navigation">
			<div class="ui-panel flex flex-col gap-3 rounded-[2rem] p-6 shadow-3xl">
				<div class="mb-4 flex flex-col gap-4 border-b [border-color:var(--ui-border-subtle)] pb-6">
					<div class="flex items-center justify-between px-2">
						<span class="text-[0.65rem] font-black uppercase tracking-[0.3em] [color:var(--ui-text-subtle)]">
							{t.header.language || 'Domain'}
						</span>
						<span class="material-symbols-outlined text-lg [color:var(--ui-text-subtle)] opacity-40">public</span>
					</div>
					<div class="grid grid-cols-2 gap-3">
						{#each locales as code}
							<a
								href={localizePath(page.url.pathname, code)}
								onclick={closeMenu}
								class={`flex h-12 items-center justify-center rounded-xl text-[0.7rem] font-black uppercase tracking-widest transition-all ${
									code === locale 
										? 'bg-primary text-white shadow-lg shadow-primary/20 dark:bg-blue-600' 
										: 'bg-primary/5 text-primary hover:bg-primary/10 dark:bg-blue-500/10 dark:text-blue-400'
								}`}
								data-testid={`mobile-language-link-${code}`}
							>
								{localeLabels[code]}
							</a>
						{/each}
					</div>
				</div>
				{#each navItems as item}
					<a 
						href={`${base}${item.href}`} 
						onclick={closeMenu} 
						class={`rounded-xl px-4 py-3 text-[0.75rem] font-bold uppercase tracking-[0.2em] transition-all ${isActive(item.href) ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-white/5'}`}
					>
						{item.label}
					</a>
				{/each}
				<a href={`${base}/${locale}/contact`} onclick={closeMenu} class="ui-btn ui-btn-primary mt-4 rounded-xl h-12 text-[0.75rem]">{t.header.letTalk}</a>
			</div>
		</nav>
	{/if}
</header>
