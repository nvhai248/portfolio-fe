<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getProjectDetailSchema } from '$lib/seo/schema';
	import { getDictionary } from '$lib/i18n/dictionary';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const t = $derived(getDictionary(data.locale));

	const orderCode = $derived(`SYS.${String(project.sortOrder || 1).padStart(2, '0')}`);
	const pageTitle = $derived(`${project.title} | ${data.locale === 'vi' ? 'Dự án' : 'Projects'} | Nguyen Van Hai`);
	const detailSchema = $derived(
		getProjectDetailSchema({
			origin: page.url.origin,
			pathname: page.url.pathname,
			project,
			locale: data.locale
		})
	);

	const cards = $derived([
		{
			id: 'problem',
			code: '01',
			title: t.projectDetail.problemStatement,
			icon: 'psychology',
			category: data.locale === 'vi' ? 'BỐI CẢNH BÀI TOÁN' : 'PROBLEM ARCHITECTURE',
			type: 'problem'
		},
		{
			id: 'contributions',
			code: '02',
			title: project.detailLists?.[0]?.heading || t.projectDetail.contributions,
			icon: 'terminal',
			category: data.locale === 'vi' ? 'ĐÓNG GÓP KỸ THUẬT' : 'CORE CONTRIBUTIONS',
			type: 'contributions',
			items: project.detailLists?.[0]?.items || []
		},
		{
			id: 'impact',
			code: '03',
			title: project.detailLists?.[1]?.heading || (data.locale === 'vi' ? 'Tác động đo lường' : 'Measurable Impact'),
			icon: 'trending_up',
			category: data.locale === 'vi' ? 'KẾT QUẢ ĐO LƯỜNG' : 'MEASURABLE IMPACT',
			type: 'impact',
			items: project.detailLists?.[1]?.items || []
		},
		{
			id: 'architecture',
			code: '04',
			title: t.projectDetail.architectureHighlights,
			icon: 'account_tree',
			category: data.locale === 'vi' ? 'THIẾT KẾ KIẾN TRÚC' : 'SYSTEM DESIGN',
			type: 'architecture',
			items: project.architectureHighlights
		},
		{
			id: 'responsibilities',
			code: '05',
			title: t.projectDetail.responsibilities,
			icon: 'checklist',
			category: data.locale === 'vi' ? 'PHẠM VI TRÁCH NHIỆM' : 'TECHNICAL SCOPE',
			type: 'responsibilities',
			items: project.responsibilities
		},
		{
			id: 'outcomes-lessons',
			code: '06',
			title: `${t.projectDetail.deliveryOutcomes} & ${t.projectDetail.lessonsLearned}`,
			icon: 'verified',
			category: data.locale === 'vi' ? 'VẬN HÀNH & BÀI HỌC' : 'OUTCOMES & RETRO',
			type: 'outcomes-lessons',
			outcomes: project.deliveryOutcomes,
			lessons: project.lessonsLearned
		},
		{
			id: 'tech-stack',
			code: '07',
			title: t.projectDetail.techStack,
			icon: 'layers',
			category: data.locale === 'vi' ? 'CÔNG NGHỆ & TÀI LIỆU' : 'TECH SPEC & VERIFICATION',
			type: 'tech-stack',
			stack: project.techStack,
			links: project.links || []
		}
	]);

	let cardElements: HTMLElement[] = $state([]);
	let cardScales = $state<number[]>([1, 1, 1, 1, 1, 1, 1]);
	let cardBrightness = $state<number[]>([1, 1, 1, 1, 1, 1, 1]);

	let isTicking = false;

	const updateCardTransforms = () => {
		if (typeof window === 'undefined' || !cardElements.length) return;

		const isMobile = window.innerWidth < 640;
		const baseOffset = isMobile ? 64 : 84;
		const stepOffset = isMobile ? 8 : 20;

		for (let i = 0; i < cards.length; i++) {
			const el = cardElements[i];
			if (!el) continue;

			const targetStickyTop = baseOffset + i * stepOffset;

			// Check how many cards after i have overlapped card i
			let overlapFactor = 0;
			for (let j = i + 1; j < cards.length; j++) {
				const nextEl = cardElements[j];
				if (!nextEl) continue;
				const nextTargetTop = baseOffset + j * stepOffset;
				const nextRect = nextEl.getBoundingClientRect();
				const dist = nextRect.top - nextTargetTop;

				if (dist <= 0) {
					overlapFactor += 1;
				} else if (dist < 320) {
					overlapFactor += (1 - dist / 320);
				}
			}

			// Shrink scale: 1 -> 0.962 -> 0.924 -> ... down to min 0.82
			const scale = Math.max(0.82, 1 - overlapFactor * 0.038);
			// Dim brightness slightly for cards buried underneath
			const brightness = Math.max(0.78, 1 - overlapFactor * 0.055);

			cardScales[i] = Number(scale.toFixed(4));
			cardBrightness[i] = Number(brightness.toFixed(4));
		}
		isTicking = false;
	};

	const onScroll = () => {
		if (!isTicking) {
			isTicking = true;
			requestAnimationFrame(updateCardTransforms);
		}
	};

	onMount(() => {
		updateCardTransforms();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	const scrollToCard = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};
</script>

<SeoHead
	title={pageTitle}
	description={project.overview}
	pathname={page.url.pathname}
	structuredData={detailSchema}
	locale={data.locale}
/>

<!-- Top Technical Spec Toolbar -->
<div class="border-b [border-color:var(--ui-border)] [background-color:var(--ui-surface)]">
	<div class="page-shell flex flex-wrap items-center justify-between gap-4 py-3.5 font-mono text-xs">
		<div class="flex items-center gap-3">
			<a
				class="inline-flex items-center gap-1.5 transition-colors hover:[color:var(--ui-primary)] [color:var(--ui-text-muted)]"
				href={`/${data.locale}/projects`}
			>
				<span class="material-symbols-outlined text-sm">arrow_back</span>
				<span>{t.projectDetail.back}</span>
			</a>
			<span class="text-[var(--ui-border)]">/</span>
			<span class="font-bold [color:var(--ui-primary)]">[{orderCode}]</span>
			<span class="font-semibold uppercase tracking-wider [color:var(--ui-text)]">{project.domain}</span>
		</div>

		<!-- Language Switcher Pills right on the Spec Bar -->
		<div class="flex items-center gap-2">
			<span class="text-[11px] [color:var(--ui-text-subtle)]">// {t.projectDetail.switchLanguage}:</span>
			<div class="inline-flex items-center rounded-md border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg)] p-0.5">
				<a
					href={`/vi/projects/${project.slug}`}
					class={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase transition-all ${
						data.locale === 'vi'
							? 'bg-[var(--ui-primary)] text-white shadow-sm'
							: '[color:var(--ui-text-subtle)] hover:[color:var(--ui-text)]'
					}`}
					aria-current={data.locale === 'vi' ? 'page' : undefined}
				>
					VI
				</a>
				<a
					href={`/en/projects/${project.slug}`}
					class={`rounded px-2.5 py-0.5 text-[11px] font-bold uppercase transition-all ${
						data.locale === 'en'
							? 'bg-[var(--ui-primary)] text-white shadow-sm'
							: '[color:var(--ui-text-subtle)] hover:[color:var(--ui-text)]'
					}`}
					aria-current={data.locale === 'en' ? 'page' : undefined}
				>
					EN
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Header Hero Dossier -->
<header class="page-shell border-b [border-color:var(--ui-border)] pt-10 pb-8 sm:pt-14 sm:pb-12">
	<div class="space-y-4">
		<div class="flex flex-wrap items-center gap-3 font-mono text-xs">
			<span class="rounded border [border-color:var(--ui-border)] px-2.5 py-1 font-bold [color:var(--ui-primary)] [background-color:var(--ui-surface)]">
				{orderCode}
			</span>
			<span class="font-semibold uppercase tracking-wider [color:var(--ui-text-muted)]">
				{project.domain}
			</span>
			<span class="text-[var(--ui-border)]">•</span>
			<span class="font-mono text-[11px] text-emerald-500 font-bold uppercase tracking-wider">
				● 3D SPEC DOSSIER
			</span>
		</div>
		<h1 class="text-3xl font-black tracking-tight [color:var(--ui-text)] sm:text-4xl lg:text-5xl break-words">
			{project.title}
		</h1>
		<p class="font-mono text-sm [color:var(--ui-text-subtle)]">
			{t.projectDetail.roleLabel}: <span class="font-semibold [color:var(--ui-text)]">{project.role}</span>
		</p>
		<p class="max-w-4xl text-base sm:text-lg leading-relaxed [color:var(--ui-text-muted)] pt-2">
			{project.overview}
		</p>
	</div>

	{#if project.timeline || project.teamContext}
		<div class="mt-8 grid gap-4 rounded-xl border [border-color:var(--ui-border)] [background-color:var(--ui-surface)] p-5 font-mono text-xs sm:grid-cols-2">
			{#if project.timeline}
				<div>
					<span class="font-bold uppercase tracking-wider [color:var(--ui-primary)]">// {t.projectDetail.timeline}:</span>
					<p class="mt-1 font-semibold [color:var(--ui-text)]">{project.timeline}</p>
				</div>
			{/if}
			{#if project.teamContext}
				<div>
					<span class="font-bold uppercase tracking-wider [color:var(--ui-primary)]">// {t.projectDetail.teamContext}:</span>
					<p class="mt-1 leading-relaxed [color:var(--ui-text-muted)]">{project.teamContext}</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Quick Module Jump Anchor Bar -->
	<div class="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs pt-4 border-t [border-color:var(--ui-border-subtle)]">
		<span class="text-[11px] font-bold uppercase tracking-wider [color:var(--ui-text-subtle)] mr-2">
			{data.locale === 'vi' ? 'CÁC MODULE (CUỘN ĐỂ KHÁM PHÁ):' : 'MODULES (SCROLL TO EXPLORE):'}
		</span>
		{#each cards as card}
			<button
				type="button"
				onclick={() => scrollToCard(card.id)}
				class="rounded border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg-muted)] px-2.5 py-1 text-[11px] font-bold [color:var(--ui-text-muted)] transition-colors hover:border-[var(--ui-primary)] hover:[color:var(--ui-primary)]"
			>
				[{card.code}] {card.category}
			</button>
		{/each}
	</div>
</header>

<!-- 3D Sticky Stacking Scroll Main Container -->
<main class="page-shell relative py-12">
	<div class="relative space-y-0">
		{#each cards as card, index (card.id)}
			<article
				id={card.id}
				bind:this={cardElements[index]}
				class={`sticky rounded-2xl sm:rounded-3xl border [border-color:var(--ui-border)] [background-color:var(--ui-surface)] transition-all duration-150 will-change-transform shadow-[0_15px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] ${
					index < cards.length - 1 ? 'mb-36 sm:mb-48 lg:mb-56' : 'mb-8'
				}`}
				style={`top: calc(5rem + ${index * 1.25}rem); z-index: ${index + 1}; transform: scale(${cardScales[index] || 1}); filter: brightness(${cardBrightness[index] || 1}); transform-origin: center top;`}
			>
				<!-- Card Dossier Header Tab -->
				<div class="flex flex-wrap items-center justify-between gap-3 border-b [border-color:var(--ui-border-subtle)] bg-[var(--ui-bg-muted)]/50 px-6 py-4 font-mono text-xs rounded-t-2xl sm:rounded-t-3xl sm:px-8">
					<div class="flex items-center gap-3">
						<span class="rounded bg-[var(--ui-primary)]/10 px-2 py-0.5 font-bold text-[11px] [color:var(--ui-primary)]">
							[CARD {card.code} / 07]
						</span>
						<span class="font-bold uppercase tracking-wider [color:var(--ui-text)]">
							// {card.category}
						</span>
					</div>
					<div class="flex items-center gap-2 [color:var(--ui-text-subtle)]">
						<span class="material-symbols-outlined text-base [color:var(--ui-primary)]">{card.icon}</span>
						<span class="text-[11px] font-semibold uppercase tracking-widest hidden sm:inline">
							SYS.{orderCode}.{card.code}
						</span>
					</div>
				</div>

				<!-- Card Content Area -->
				<div class="p-6 sm:p-8 lg:p-10 space-y-6">
					<!-- Title -->
					<div class="space-y-1">
						<h2 class="text-xl sm:text-2xl font-black tracking-tight [color:var(--ui-text)]">
							{card.title}
						</h2>
					</div>

					<!-- Card Specific Bodies -->
					{#if card.type === 'problem'}
						<div class="space-y-6">
							<p class="text-base sm:text-lg leading-relaxed [color:var(--ui-text)] font-normal">
								{project.problemStatement}
							</p>
							<div class="grid gap-4 rounded-xl border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg)] p-4 font-mono text-xs sm:grid-cols-2">
								<div>
									<span class="font-bold [color:var(--ui-primary)] uppercase tracking-wider">
										// {data.locale === 'vi' ? 'TRỌNG TÂM KỸ THUẬT' : 'ENGINEERING FOCUS'}:
									</span>
									<p class="mt-1 [color:var(--ui-text-muted)]">{project.domain}</p>
								</div>
								<div>
									<span class="font-bold [color:var(--ui-primary)] uppercase tracking-wider">
										// {data.locale === 'vi' ? 'PHẠM VI TRIỂN KHAI' : 'DEPLOYMENT SCOPE'}:
									</span>
									<p class="mt-1 [color:var(--ui-text-muted)]">{project.timeline || 'Enterprise Grade'}</p>
								</div>
							</div>
						</div>

					{:else if card.type === 'contributions'}
						<div class="space-y-3">
							<ul class="space-y-3 text-sm sm:text-base leading-relaxed [color:var(--ui-text-muted)]">
								{#each card.items as item}
									<li class="flex items-start gap-3 rounded-lg border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg)]/40 p-3.5 transition-colors hover:border-[var(--ui-primary)]/40">
										<span class="mt-0.5 text-xs font-mono font-bold [color:var(--ui-primary)] select-none">›_</span>
										<span class="[color:var(--ui-text)]">{item}</span>
									</li>
								{/each}
							</ul>
						</div>

					{:else if card.type === 'impact'}
						<div class="space-y-3">
							<ul class="space-y-3 text-sm sm:text-base leading-relaxed [color:var(--ui-text-muted)]">
								{#each card.items as item}
									<li class="flex items-start gap-3 rounded-lg border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg)]/40 p-3.5 transition-colors hover:border-emerald-500/40">
										<span class="mt-0.5 text-xs font-mono font-bold text-emerald-500 select-none">✓</span>
										<span class="[color:var(--ui-text)]">{item}</span>
									</li>
								{/each}
							</ul>
						</div>

					{:else if card.type === 'architecture'}
						<div class="space-y-3">
							<ul class="space-y-3 text-sm sm:text-base leading-relaxed [color:var(--ui-text-muted)]">
								{#each card.items as item}
									<li class="flex items-start gap-3 rounded-lg border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg)]/40 p-3.5 transition-colors hover:border-[var(--ui-primary)]/40">
										<span class="mt-0.5 text-xs font-mono font-bold [color:var(--ui-primary)] select-none">›</span>
										<span class="[color:var(--ui-text)]">{item}</span>
									</li>
								{/each}
							</ul>
						</div>

					{:else if card.type === 'responsibilities'}
						<div class="space-y-3">
							<ul class="space-y-3 text-sm sm:text-base leading-relaxed [color:var(--ui-text-muted)]">
								{#each card.items as item}
									<li class="flex items-start gap-3 rounded-lg border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg)]/40 p-3.5 transition-colors hover:border-[var(--ui-primary)]/40">
										<span class="mt-0.5 text-xs font-mono font-bold [color:var(--ui-primary)] select-none">›</span>
										<span class="[color:var(--ui-text)]">{item}</span>
									</li>
								{/each}
							</ul>
						</div>

					{:else if card.type === 'outcomes-lessons'}
						<div class="grid gap-6 lg:grid-cols-2">
							<!-- Subcol: Delivery Outcomes -->
							<div class="space-y-3">
								<h3 class="font-mono text-xs font-bold uppercase tracking-wider text-emerald-500 border-b [border-color:var(--ui-border-subtle)] pb-2 flex items-center gap-2">
									<span class="material-symbols-outlined text-sm">verified</span>
									<span>// {t.projectDetail.deliveryOutcomes}</span>
								</h3>
								<ul class="space-y-2.5 text-sm leading-relaxed [color:var(--ui-text-muted)]">
									{#each card.outcomes as outcome}
										<li class="flex items-start gap-2.5">
											<span class="mt-1 text-xs text-emerald-500 font-mono font-bold">✓</span>
											<span>{outcome}</span>
										</li>
									{/each}
								</ul>
							</div>

							<!-- Subcol: Lessons Learned -->
							<div class="space-y-3">
								<h3 class="font-mono text-xs font-bold uppercase tracking-wider [color:var(--ui-primary)] border-b [border-color:var(--ui-border-subtle)] pb-2 flex items-center gap-2">
									<span class="material-symbols-outlined text-sm">lightbulb</span>
									<span>// {t.projectDetail.lessonsLearned}</span>
								</h3>
								<ul class="space-y-2.5 text-sm leading-relaxed [color:var(--ui-text-muted)]">
									{#each card.lessons as lesson}
										<li class="flex items-start gap-2.5">
											<span class="mt-1 text-xs [color:var(--ui-primary)] font-mono font-bold">›</span>
											<span>{lesson}</span>
										</li>
									{/each}
								</ul>
							</div>
						</div>

					{:else if card.type === 'tech-stack'}
						<div class="space-y-6">
							<div class="flex flex-wrap gap-2.5">
								{#each card.stack as tech}
									<span class="rounded border [border-color:var(--ui-border-subtle)] [background-color:var(--ui-bg-muted)] px-3.5 py-1.5 font-mono text-xs font-semibold [color:var(--ui-text)] transition-colors hover:border-[var(--ui-primary)] hover:[color:var(--ui-primary)]">
										{tech}
									</span>
								{/each}
							</div>

							{#if card.links?.length}
								<div class="pt-6 border-t [border-color:var(--ui-border-subtle)] flex flex-wrap gap-3">
									{#each card.links as link}
										<a class="ui-btn ui-btn-secondary text-xs font-mono" href={link.url} target="_blank" rel="noopener noreferrer">
											<span>{link.label}</span>
											<span class="material-symbols-outlined text-xs">open_in_new</span>
										</a>
									{/each}
								</div>
							{/if}

							<div class="pt-6 border-t [border-color:var(--ui-border-subtle)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs [color:var(--ui-text-subtle)]">
								<span>[DOSSIER COMPLETE • {orderCode}]</span>
								<span class="text-emerald-500 font-bold">● 100% PRODUCTION VERIFIED</span>
							</div>
						</div>
					{/if}
				</div>
			</article>
		{/each}
	</div>

	<!-- Bottom Navigation: Return to Projects -->
	<div class="mt-16 pt-8 border-t [border-color:var(--ui-border)] flex flex-wrap items-center justify-between gap-4">
		<a class="ui-link font-mono text-xs inline-flex items-center gap-2" href={`/${data.locale}/projects`}>
			<span class="material-symbols-outlined text-sm">arrow_back</span>
			<span>{t.projectDetail.back}</span>
		</a>
		<span class="font-mono text-xs [color:var(--ui-text-subtle)]">
			[{orderCode}] • {project.title}
		</span>
	</div>
</main>
