import { browser } from '$app/environment';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

function createThemeStore() {
	let current = $state<ThemeMode>('light');
	let mql: MediaQueryList | null = null;
	let hasSavedPreference = false;

	function readSavedMode(): ThemeMode | null {
		if (!browser) return null;

		try {
			const saved = localStorage.getItem(THEME_STORAGE_KEY);
			if (saved === 'light' || saved === 'dark') {
				hasSavedPreference = true;
				return saved;
			}
		} catch {
			// Ignore storage access issues and fall back to system preference.
		}

		hasSavedPreference = false;
		return null;
	}

	function resolveInitialMode(): ThemeMode {
		if (!browser) return 'light';

		const saved = readSavedMode();
		if (saved) return saved;

		if (document.documentElement.classList.contains('dark')) {
			return 'dark';
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function applyMode(mode: ThemeMode, persist = true) {
		const html = document.documentElement;
		html.classList.toggle('dark', mode === 'dark');

		if (!persist) return;

		try {
			localStorage.setItem(THEME_STORAGE_KEY, mode);
			hasSavedPreference = true;
		} catch {
			// Ignore storage write failures.
		}
	}

	function handleSystemThemeChange(event: MediaQueryListEvent) {
		if (hasSavedPreference) return;
		current = event.matches ? 'dark' : 'light';
		applyMode(current, false);
	}

	function init() {
		if (!browser) return;

		const mode = resolveInitialMode();
		current = mode;
		applyMode(mode, false);

		mql ??= window.matchMedia('(prefers-color-scheme: dark)');
		mql.removeEventListener('change', handleSystemThemeChange);
		mql.addEventListener('change', handleSystemThemeChange);
	}

	function setMode(mode: ThemeMode) {
		current = mode;
		if (browser) {
			applyMode(mode);
		}
	}

	function toggle() {
		setMode(current === 'dark' ? 'light' : 'dark');
	}

	return {
		get current() {
			return current;
		},
		init,
		toggle
	};
}

export const theme = createThemeStore();
