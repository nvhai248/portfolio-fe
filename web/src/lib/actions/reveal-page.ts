import { tick } from 'svelte';
import { stripLocalePrefix } from '$lib/i18n/locale';

// Public editorial pages use existing DOM nodes so cards, article anchors and grids keep their layout.
export function revealPageBlocks(node: HTMLElement, pathname: string) {
	let dispose = () => {};
	let revision = 0;

	async function initialize(path: string) {
		const current = ++revision;
		dispose();
		const route = stripLocalePrefix(path);
		if (!/^\/(projects|blog)(\/|$)/.test(route)) return;
		await tick();
		if (current !== revision) return;

		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const targets = Array.from(node.querySelectorAll<HTMLElement>([
			'section > article.ui-panel',
			'section > article.sys-project-card',
			'section .ui-card-link',
			'section > .ui-panel',
			'[data-testid="project-detail-card"]',
			'.prose > h2', '.prose > h3', '.prose > h4',
			'.prose > figure', '.prose > blockquote', '.prose > pre', '.prose > div',
			'article > header > img', 'article > .mt-16'
		].join(', ')));
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				(entry.target as HTMLElement).dataset.pageReveal = 'visible';
				observer.unobserve(entry.target);
			}
		}, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

		for (const [index, element] of targets.entries()) {
			if (preference.matches || element.getBoundingClientRect().top < window.innerHeight - 24) continue;
			element.dataset.pageReveal = 'pending';
			element.dataset.pageDirection = element.matches('h2, h3, h4') ? 'left' : 'up';
			element.style.setProperty('--page-reveal-delay', `${(index % 3) * 60}ms`);
			observer.observe(element);
		}
		const showAll = () => {
			if (!preference.matches) return;
			observer.disconnect();
			for (const element of targets) element.dataset.pageReveal = 'visible';
		};
		const showFocused = (event: FocusEvent) => {
			if (!(event.target instanceof HTMLElement)) return;
			const element = event.target.closest<HTMLElement>('[data-page-reveal="pending"]');
			if (!element) return;
			element.dataset.pageReveal = 'visible';
			observer.unobserve(element);
		};
		preference.addEventListener('change', showAll);
		node.addEventListener('focusin', showFocused);
		dispose = () => {
			observer.disconnect();
			preference.removeEventListener('change', showAll);
			node.removeEventListener('focusin', showFocused);
			for (const element of targets) {
				delete element.dataset.pageReveal;
				delete element.dataset.pageDirection;
				element.style.removeProperty('--page-reveal-delay');
			}
		};
	}
	void initialize(pathname);
	return {
		update(nextPath: string) { void initialize(nextPath); },
		destroy() { revision++; dispose(); }
	};
}
