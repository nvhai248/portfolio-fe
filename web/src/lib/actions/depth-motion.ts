/** Event-driven depth; no continuous render loop. */
export function depthMotion(node: HTMLElement) {
	const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
	let frame = 0;
	let pointerX = 0;
	let pointerY = 0;
	const render = () => {
		frame = 0;
		const rect = node.getBoundingClientRect();
		const enabled = !preference.matches && !document.hidden;
		const progress = enabled ? Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight)) : 0;
		node.style.setProperty('--depth-x', `${enabled ? pointerX * 9 : 0}deg`);
		node.style.setProperty('--depth-y', `${enabled ? pointerY * -6 : 0}deg`);
		node.style.setProperty('--depth-scroll', `${progress * 16}deg`);
		node.style.setProperty('--depth-lift', `${progress * -35}px`);
	};
	const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
	const move = (event: PointerEvent) => {
		if (event.pointerType !== 'mouse' || preference.matches) return;
		const rect = node.getBoundingClientRect();
		pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
		pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
		schedule();
	};
	const reset = () => { pointerX = 0; pointerY = 0; schedule(); };
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', reset);
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);
	preference.addEventListener('change', reset);
	document.addEventListener('visibilitychange', reset);
	schedule();
	return { destroy() {
		cancelAnimationFrame(frame);
		node.removeEventListener('pointermove', move);
		node.removeEventListener('pointerleave', reset);
		window.removeEventListener('scroll', schedule);
		window.removeEventListener('resize', schedule);
		preference.removeEventListener('change', reset);
		document.removeEventListener('visibilitychange', reset);
	} };
}
