import { browser } from '$app/environment';

function createThemeStore() {
    let current = $state('light');

    function init() {
        if (browser) {
            const saved = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (saved === 'dark' || (!saved && prefersDark)) {
                setMode('dark');
            } else {
                setMode('light');
            }
        }
    }

    function setMode(mode: 'light' | 'dark') {
        current = mode;
        if (browser) {
            const html = document.documentElement;
            if (mode === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
            localStorage.setItem('theme', mode);
        }
    }

    function toggle() {
        setMode(current === 'dark' ? 'light' : 'dark');
    }

    return {
        get current() { return current; },
        init,
        toggle
    };
}

export const theme = createThemeStore();
