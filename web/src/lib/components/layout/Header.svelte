<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { primaryNavItems } from '$lib/content/navigation';
	import { theme } from '$lib/stores/theme.svelte';

	let isMenuOpen = $state(false);

	const isActive = (href: string) =>
		page.url.pathname === href || (href !== '/' && page.url.pathname.startsWith(href));

	const closeMenu = () => {
		isMenuOpen = false;
	};
</script>

<header class="sticky top-0 z-50 border-b ui-divider bg-[var(--ui-bg)] backdrop-blur-md">
	<div class="page-shell flex h-16 items-center justify-between">
		<a
			class="group inline-flex min-w-0 items-center gap-3"
			href={`${base}/`}
			onclick={closeMenu}
			aria-label="Go to homepage"
		>
			<div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
				<span class="material-symbols-outlined text-lg">deployed_code</span>
			</div>
			<div class="flex min-w-0 flex-col">
				<span class="truncate text-sm font-semibold leading-none [color:var(--ui-text)]">Nguyen Van Hai</span>
				<span class="hidden text-xs leading-none [color:var(--ui-text-subtle)] min-[420px]:block">Backend Engineer</span>
			</div>
		</a>

		<nav class="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
			{#each primaryNavItems as item}
				<a
					href={`${base}${item.href}`}
					class={`ui-nav-link ${isActive(item.href) ? 'ui-nav-link-active' : ''}`}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<a href="mailto:nvhai2408@gmail.com" class="ui-btn ui-btn-primary hidden h-10 px-4 sm:inline-flex">Let's Talk</a>
			<button
				type="button"
				onclick={() => theme.toggle()}
				class="ui-icon-btn"
				aria-label="Toggle color theme"
				aria-pressed={theme.current === 'dark'}
				data-testid="theme-toggle"
			>
				<span class="material-symbols-outlined text-xl">
					{theme.current === 'dark' ? 'light_mode' : 'dark_mode'}
				</span>
			</button>
			<button
				type="button"
				onclick={() => (isMenuOpen = !isMenuOpen)}
				class="ui-icon-btn md:hidden"
				aria-label="Toggle mobile menu"
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
				{#each primaryNavItems as item}
					<a
						href={`${base}${item.href}`}
						onclick={closeMenu}
						class={`ui-nav-link ${isActive(item.href) ? 'ui-nav-link-active' : ''}`}
					>
						{item.label}
					</a>
				{/each}
				<a href="mailto:nvhai2408@gmail.com" onclick={closeMenu} class="ui-btn ui-btn-primary mt-2 h-10">Let's Talk</a>
			</div>
		</nav>
	{/if}
</header>
