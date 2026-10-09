<script lang="ts">
	import { base } from '$app/paths';
	import type { Locale } from '$lib/i18n/config';
	import Reveal from '$lib/components/ui/ScrollReveal.svelte';
	import { depthMotion } from '$lib/actions/depth-motion';
	let { locale }: { locale: Locale } = $props();
	const copy = $derived(locale === 'vi' ? {
		title: 'Từ ý tưởng đến một hệ thống chạy tốt.',
		items: [
			{ image: 'backend', title: 'Backend rõ ràng, dễ phát triển', body: 'Tôi xây dựng API và luồng dữ liệu để sản phẩm chạy ổn định, và đội ngũ dễ tiếp tục công việc.' },
			{ image: 'cloud', title: 'Hạ tầng dễ vận hành', body: 'Tự động hóa triển khai, theo dõi hệ thống và tìm điểm nghẽn để những lần phát hành bớt vất vả.' },
			{ image: 'ai', title: 'AI có ích trong thực tế', body: 'Tôi thử nghiệm và đưa AI vào những công việc cụ thể, từ đọc tài liệu đến tìm kiếm và hỗ trợ quy trình.' }
		]
	} : {
		title: 'From an idea to a system that works.',
		items: [
			{ image: 'backend', title: 'Backend built for the next step', body: 'Clear APIs and dependable data flows that keep products running and make it easier for teams to build on them.' },
			{ image: 'cloud', title: 'Infrastructure you can work with', body: 'Automated delivery, useful monitoring, and thoughtful performance improvements to make releases less demanding.' },
			{ image: 'ai', title: 'AI with a practical purpose', body: 'Putting AI to work on specific problems, from reading documents to finding information and supporting everyday workflows.' }
		]
	});
</script>

<section class="py-16 md:py-24" aria-labelledby="engineering-heading">
	<Reveal><h2 id="engineering-heading" class="ui-heading-1 max-w-2xl">{copy.title}</h2></Reveal>
	<div class="mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
		{#each copy.items as item (item.image)}
			<article>
				<div class="study bg-slate-100/70 dark:bg-slate-800/40" use:depthMotion>
					<img src={`${base}/images/${item.image}-study.svg`} alt="" width="400" height="300" loading="lazy" class="study-image" />
				</div>
				<h3 class="ui-heading-3 mt-6">{item.title}</h3>
				<p class="ui-body mt-3">{item.body}</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.study { overflow: hidden; border-radius: 1.5rem; perspective: 700px; }
	.study-image { width: 100%; height: auto; transform: rotateY(var(--depth-x, 0deg)) rotateX(var(--depth-y, 0deg)) translateY(var(--depth-lift, 0px)); transition: transform 700ms cubic-bezier(.2,.8,.2,1); }
	@media (prefers-reduced-motion: reduce) { .study-image { transform: none; transition: none; } }
	@media print { .study-image { transform: none; } }
</style>
