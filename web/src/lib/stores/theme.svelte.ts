import { browser } from '$app/environment';

type ThemeMode = 'light' | 'dark';

function createThemeStore() {
	let current = $state<ThemeMode>('light');

	function resolveInitialMode(): ThemeMode {
		if (!browser) return 'light';

		const saved = localStorage.getItem('theme');
		if (saved === 'light' || saved === 'dark') {
			return saved;
		}

		if (document.documentElement.classList.contains('dark')) {
			return 'dark';
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function applyMode(mode: ThemeMode) {
		const html = document.documentElement;
		html.classList.toggle('dark', mode === 'dark');
		localStorage.setItem('theme', mode);
	}

	function init() {
		if (!browser) return;
		const mode = resolveInitialMode();
		current = mode;
		applyMode(mode);
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
