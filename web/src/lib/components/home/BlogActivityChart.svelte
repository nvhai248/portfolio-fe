<script lang="ts">
	import type { Post } from '$lib/types/content';
	import type { Locale } from '$lib/i18n/config';
	import { depthMotion } from '$lib/actions/depth-motion';
	let { posts, locale }: { posts: Post[]; locale: Locale } = $props();
	const now = new Date();
	const data = $derived(Array.from({ length: 12 }, (_, index) => {
		const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
		return {
			key: `${date.getFullYear()}-${date.getMonth()}`,
			label: date.toLocaleString(locale, { month: 'short' }),
			fullLabel: date.toLocaleString(locale, { month: 'long', year: 'numeric' }),
			count: posts.filter(post => {
				if (!post.publishedAt) return false;
				const published = new Date(post.publishedAt);
				return published.getFullYear() === date.getFullYear() && published.getMonth() === date.getMonth();
			}).length
		};
	}));
	const maxCount = $derived(Math.max(...data.map(item => item.count), 1));
	const total = $derived(data.reduce((sum, item) => sum + item.count, 0));
</script>

<figure class="writing-depth bg-slate-100/70 dark:bg-slate-800/40" use:depthMotion aria-label={locale === 'vi' ? 'Số bài viết mỗi tháng trong 12 tháng qua' : 'Monthly post counts over the last 12 months'}>
	<div class="chart-world" aria-hidden="true">
		<div class="writing-book">
			<div class="book-pages"></div>
			<div class="book-cover"><span>&lt; / &gt;</span></div>
		</div>
		<div class="chart-bars">
			{#each data as item (item.key)}
				<div class="month-column">
					<span class="bar-count">{item.count}</span>
					<div class="month-bar" class:empty={item.count === 0} style={`height:${Math.max(3, item.count / maxCount * 100)}px`}></div>
					<span class="month-label">{item.label}</span>
				</div>
			{/each}
		</div>
	</div>
	<ul class="sr-only">
		{#each data as item (item.key)}<li>{item.fullLabel}: {item.count}</li>{/each}
	</ul>
	<figcaption class="relative px-6 pb-6 text-sm [color:var(--ui-text-muted)]">
		{locale === 'vi' ? `${total} bài viết trong 12 tháng qua` : `${total} ${total === 1 ? 'post' : 'posts'} in the last 12 months`}
	</figcaption>
</figure>

<style>
	.writing-depth { margin: 0; border-radius: 24px; perspective: 900px; }
	.chart-world { position: relative; height: 220px; padding: 35px 30px 20px; transform-style: preserve-3d; transform: rotateX(calc(-12deg + var(--depth-y, 0deg))) rotateY(calc(-12deg + var(--depth-x, 0deg))); transition: transform 600ms cubic-bezier(.2,.8,.2,1); }
	.writing-book { position: absolute; width: 100px; height: 65px; top: 20px; left: calc(50% - 50px); transform-style: preserve-3d; transform: rotateX(45deg) rotateZ(-22deg) translateZ(25px); }
	.book-pages { position: absolute; inset: 0; border-radius: 4px 8px 8px 4px; background: repeating-linear-gradient(#e6eff5 0 2px,#aec0cf 2px 3px); box-shadow: 5px 9px 0 #516e87, 12px 18px 15px #27405720; }
	.book-cover { position: absolute; inset: 0; border-radius: 4px 8px 8px 4px; border-left: 10px solid #385970; background: linear-gradient(140deg,#b4cddd,#6c93b1); transform: translateZ(8px) translateY(-6px); display: grid; place-items: center; }
	.book-cover span { color: #173b56; font-size: 20px; font-weight: 700; }
	.chart-bars { height: 100%; display: flex; gap: 10px; align-items: end; border-bottom: 8px solid #9ab2c8; transform-style: preserve-3d; }
	.month-column { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; transform-style: preserve-3d; }
	.month-bar { position: relative; width: 100%; background: linear-gradient(90deg,#7094b4,#a9c5dc); transform: translateZ(10px); }
	.month-bar::before { content: ''; position: absolute; left: 0; top: -6px; width: 100%; height: 6px; background: #d2e3ef; transform: skewX(-40deg); transform-origin: bottom; }
	.month-bar::after { content: ''; position: absolute; right: -5px; top: -3px; width: 5px; height: 100%; background: #456982; transform: skewY(-50deg); }
	.month-bar.empty { background: #b3c3d1; }
	.bar-count { font-size: 10px; color: var(--ui-text-muted); }
	.month-label { font-size: 9px; white-space: nowrap; color: var(--ui-text-muted); }
	@media (max-width: 640px) { .chart-world { padding-inline: 20px; } .chart-bars { gap: 7px; } .month-label { font-size: 8px; } }
	@media (prefers-reduced-motion: reduce) { .chart-world { transform: rotateX(-12deg) rotateY(-12deg); transition: none; } }
	@media print { .chart-world { transform: none; } }
</style>
