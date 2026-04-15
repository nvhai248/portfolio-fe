<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { getPrimaryNavItems } from '$lib/content/navigation';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { localeLabels, locales } from '$lib/i18n/config';
	import { localeFromPathname, localizePath } from '$lib/i18n/locale';
	import { theme } from '$lib/stores/theme.svelte';

	let isMenuOpen = $state(false);

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale));
	const navItems = $derived(getPrimaryNavItems(locale));

	const isActive = (href: string) => page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	const closeMenu = () => {
		isMenuOpen = false;
	};
</script>

<header class="sticky top-0 z-50 border-b ui-divider bg-[var(--ui-bg)] backdrop-blur-md">
	<div class="page-shell flex h-16 items-center justify-between">
		<a
			class="group inline-flex min-w-0 items-center gap-3"
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
				<a href={`${base}${item.href}`} class={`ui-nav-link ${isActive(item.href) ? 'ui-nav-link-active' : ''}`}>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<div class="hidden items-center rounded-md border ui-divider px-1 py-1 sm:flex">
				{#each locales as code}
					<a
						href={localizePath(page.url.pathname, code)}
						class={`rounded px-2 py-1 text-xs ${code === locale ? 'bg-primary text-white' : '[color:var(--ui-text-muted)]'}`}
					>
						{localeLabels[code]}
					</a>
				{/each}
			</div>
			<a href="mailto:nvhai2408@gmail.com" class="ui-btn ui-btn-primary hidden h-10 px-4 sm:inline-flex">{t.header.letTalk}</a>
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
		<nav id="mobile-navigation" class="border-t ui-divider md:hidden" aria-label="Mobile navigation">
			<div class="page-shell flex flex-col gap-1 py-3">
				<div class="mb-2 flex items-center gap-2">
					{#each locales as code}
						<a
							href={localizePath(page.url.pathname, code)}
							onclick={closeMenu}
							class={`rounded px-2 py-1 text-xs ${code === locale ? 'bg-primary text-white' : '[color:var(--ui-text-muted)]'}`}
						>
							{localeLabels[code]}
						</a>
					{/each}
				</div>
				{#each navItems as item}
					<a href={`${base}${item.href}`} onclick={closeMenu} class={`ui-nav-link ${isActive(item.href) ? 'ui-nav-link-active' : ''}`}>
						{item.label}
					</a>
				{/each}
				<a href="mailto:nvhai2408@gmail.com" onclick={closeMenu} class="ui-btn ui-btn-primary mt-2 h-10">{t.header.letTalk}</a>
			</div>
		</nav>
	{/if}
</header>
