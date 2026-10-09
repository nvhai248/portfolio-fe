<script lang="ts">
	import { page } from '$app/state';
	import type { ProfileDetails } from '$lib/content/profile';
	import type { AboutContent, CvPageContent } from '$lib/types/content';
	import type { Locale } from '$lib/i18n/config';
	import { getDictionary } from '$lib/i18n/dictionary';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import InfoCardGrid from '$lib/components/sections/InfoCardGrid.svelte';
	import HighlightListPanel from '$lib/components/sections/HighlightListPanel.svelte';
	import SkillGrid from '$lib/components/sections/SkillGrid.svelte';
	import ProfilePrinciples from '$lib/components/sections/ProfilePrinciples.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';

	let { aboutContent, cvContent, profileDetails, locale }: {
		aboutContent: AboutContent;
		cvContent: CvPageContent;
		profileDetails: ProfileDetails;
		locale: Locale;
	} = $props();
	const t = $derived(getDictionary(locale));

	function revealOnScroll(node: HTMLElement) {
		const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const targets = Array.from(node.querySelectorAll<HTMLElement>('section > *')).flatMap(
			(element) => element.classList.contains('grid')
				? Array.from(element.children) as HTMLElement[]
				: [element]
		);
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					(entry.target as HTMLElement).dataset.profileReveal = 'visible';
					observer.unobserve(entry.target);
				}
			}
		}, { rootMargin: '0px 0px -24px 0px', threshold: 0 });

		if (!motionPreference.matches) {
			for (const [index, element] of targets.entries()) {
				// Keep the first screen visible and preserve every section's layout and SSR content.
				if (element.getBoundingClientRect().top < window.innerHeight - 24) continue;
				element.dataset.profileReveal = 'pending';
				element.dataset.profileDirection = element.matches('h2, h3') ? 'left' : 'up';
				element.style.setProperty('--profile-reveal-delay', `${(index % 3) * 60}ms`);
				observer.observe(element);
			}
		}

		const showAll = () => {
			if (!motionPreference.matches) return;
			observer.disconnect();
			for (const element of targets) element.dataset.profileReveal = 'visible';
		};
		const showFocused = (event: FocusEvent) => {
			if (!(event.target instanceof HTMLElement)) return;
			const element = event.target.closest<HTMLElement>('[data-profile-reveal="pending"]');
			if (!element) return;
			element.dataset.profileReveal = 'visible';
			observer.unobserve(element);
		};
		motionPreference.addEventListener('change', showAll);
		node.addEventListener('focusin', showFocused);

		return {
			destroy() {
				observer.disconnect();
				motionPreference.removeEventListener('change', showAll);
				node.removeEventListener('focusin', showFocused);
			}
		};
	}
</script>

<SeoHead
	title={aboutContent.seo.title}
	description={aboutContent.seo.description}
	pathname={page.url.pathname}
	{locale}
/>

<div class="profile-motion" use:revealOnScroll>
	<section class="page-shell max-w-5xl pb-14 pt-14 sm:pb-16 lg:pt-20">
		<SectionIntro content={aboutContent.intro} />
	</section>

	<section class="page-shell max-w-5xl pb-14 sm:pb-16">
		<InfoCardGrid items={aboutContent.cards} />
	</section>

	<section class="page-shell max-w-5xl pb-20">
		<HighlightListPanel title={aboutContent.contributionPanel.title} items={aboutContent.contributionPanel.items} />
	</section>

	{#if profileDetails.principles}
		<ProfilePrinciples content={profileDetails.principles} />
	{/if}

	<section id="cv" class="page-shell max-w-5xl scroll-mt-24 pb-12">
		<div class="flex flex-col gap-6 border-b ui-divider pb-10 md:flex-row md:items-end md:justify-between">
			<div class="min-w-0">
				<p class="ui-eyebrow">{cvContent.intro.eyebrow}</p>
				<h2 class="ui-heading-2 mt-3 break-words">{cvContent.intro.title}</h2>
				<p class="ui-body-lg mt-3 max-w-2xl break-words">{cvContent.intro.description}</p>
			</div>
			<div class="flex flex-wrap gap-3 print:hidden md:shrink-0">
				<a href={profileDetails.pdfUrl} target="_blank" rel="noopener noreferrer" class="ui-btn ui-btn-primary">
					{profileDetails.pdfLabel}
				</a>
				<a href={`mailto:${cvContent.contactEmail}`} class="ui-btn ui-btn-secondary">{t.cv.requestPdf}</a>
			</div>
		</div>
	</section>

	<section class="page-shell max-w-5xl pb-10">
		<h2 class="ui-heading-2 mb-6">{profileDetails.experienceTitle}</h2>
		<InfoCardGrid items={profileDetails.projectExperience} />
	</section>

	<section class="page-shell max-w-5xl pb-20">
		<h2 class="ui-heading-2">{cvContent.techSkills.title}</h2>
		<p class="ui-body mt-3 max-w-3xl break-words">{cvContent.techSkills.description}</p>

		<SkillGrid items={cvContent.techSkills.categories} />
	</section>

	<section class="page-shell max-w-5xl pb-20 pt-2">
		<div class="ui-panel p-5 sm:p-6 lg:max-w-3xl">
			<h2 class="ui-heading-3">{t.cv.education}</h2>
			<div class="mt-4 space-y-2 text-sm [color:var(--ui-text-muted)]">
				<p><strong class="[color:var(--ui-text)]">{cvContent.education.school}</strong></p>
				<p>{cvContent.education.degree}</p>
				<p>{cvContent.education.details}</p>
				{#if cvContent.education.specialization}
					<p>{t.cv.specialization}: {cvContent.education.specialization}</p>
				{/if}
			</div>
			{#if cvContent.education.coursework && cvContent.education.coursework.length > 0}
				<div class="mt-4">
					<p class="ui-body-sm [color:var(--ui-text)]">{t.cv.coursework}</p>
					<ul class="mt-2 list-disc space-y-1 pl-5 text-sm [color:var(--ui-text-muted)]">
						{#each cvContent.education.coursework as course, index (index)}
							<li>{course}</li>
						{/each}
					</ul>
				</div>
			{/if}
			{#if cvContent.education.awards && cvContent.education.awards.length > 0}
				<div class="mt-4">
					<p class="ui-body-sm [color:var(--ui-text)]">{t.cv.achievements}</p>
					<ul class="mt-2 list-disc space-y-1 pl-5 text-sm [color:var(--ui-text-muted)]">
						{#each cvContent.education.awards as award, index (index)}
							<li>{award}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</section>

	<section class="page-shell max-w-5xl pb-14 sm:pb-16">
		<HighlightListPanel title={profileDetails.languagesTitle} items={profileDetails.languages} />
	</section>

	<section class="page-shell max-w-5xl pb-14 sm:pb-16">
		<h2 class="ui-heading-2">{profileDetails.certificationsTitle}</h2>
		<ul class="mt-6 space-y-3 ui-body">
			{#each profileDetails.certifications as certificate (certificate.url)}
				<li><a href={certificate.url} target="_blank" rel="noopener noreferrer" class="underline underline-offset-4 transition-colors duration-200">{certificate.label}</a></li>
			{/each}
		</ul>
	</section>



	<section class="page-shell max-w-5xl pb-20">
		<h2 class="ui-heading-2">{profileDetails.contactTitle}</h2>
		<ul class="mt-6 flex flex-wrap gap-x-6 gap-y-3 ui-body">
			{#each profileDetails.contactLinks as link (link.url)}
				<li><a href={link.url} class="break-words underline underline-offset-4 transition-colors duration-200">{link.label}</a></li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.profile-motion :global([data-profile-reveal]) {
		transition: opacity 600ms cubic-bezier(0.16, 1, 0.3, 1),
			translate 600ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--profile-reveal-delay, 0ms);
	}

	.profile-motion :global([data-profile-reveal='pending']) {
		opacity: 0;
		translate: 0 24px;
	}

	.profile-motion :global([data-profile-reveal='pending'][data-profile-direction='left']) {
		translate: -20px 0;
	}

	.profile-motion :global([data-profile-reveal='visible']) {
		opacity: 1;
		translate: 0 0;
	}

	.profile-motion :global([data-profile-reveal]:focus-within) {
		opacity: 1;
		translate: 0 0;
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.profile-motion :global([data-profile-reveal][data-profile-direction]) {
			opacity: 1;
			translate: none;
			transition: none;
		}
	}

	@media print {
		.profile-motion :global([data-profile-reveal][data-profile-direction]) {
			opacity: 1;
			translate: none;
			transition: none;
		}
	}
</style>
