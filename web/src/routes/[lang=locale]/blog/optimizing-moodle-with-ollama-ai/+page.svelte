<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getBlogContent } from '$lib/content/blog';
	import { localeFromPathname } from '$lib/i18n/locale';
	import { getArticleSchema } from '$lib/seo/schema';

	let scrollProgress = $state(0);
	const locale = $derived(localeFromPathname(page.url.pathname));
	const featuredPostSeo = $derived(getBlogContent(locale).featuredPostSeo);

	const articleSchema = $derived(
		getArticleSchema({
			origin: page.url.origin,
			pathname: featuredPostSeo.pathname,
			title: featuredPostSeo.title,
			description: featuredPostSeo.description,
			datePublished: featuredPostSeo.publishedAt,
			tags: featuredPostSeo.tags,
			locale
		})
	);

	onMount(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.body.offsetHeight;
			const winHeight = window.innerHeight;
			const scrollPercent = scrollTop / (docHeight - winHeight);
			scrollProgress = Math.min(Math.max(scrollPercent * 100, 0), 100);
		};

		window.addEventListener('scroll', updateProgress);
		updateProgress();
		return () => window.removeEventListener('scroll', updateProgress);
	});
</script>

<SeoHead
	title={featuredPostSeo.title}
	description={featuredPostSeo.description}
	pathname={featuredPostSeo.pathname}
	type="article"
	structuredData={articleSchema}
	locale={locale}
/>

<div class="fixed left-0 top-0 z-[100] h-1 w-full bg-[var(--ui-surface)]/85 backdrop-blur-md">
	<div class="h-full bg-primary transition-all duration-100 ease-out" style="width: {scrollProgress}%;"></div>
</div>

<div class="page-shell max-w-[1200px] py-10 md:px-8 md:py-12">
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
		<aside class="hidden lg:col-span-3 lg:block">
			<div class="sticky top-28 flex flex-col gap-8">
				<div class="flex flex-col gap-2">
					<h3 class="text-xs font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">Reading Progress</h3>
					<span class="text-sm font-semibold text-primary">{Math.round(scrollProgress)}% Completed</span>
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ui-bg-muted)]">
						<div class="h-full bg-primary transition-all duration-100 ease-out" style="width: {scrollProgress}%;"></div>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col">
						<h2 class="text-base font-bold [color:var(--ui-text)]">Table of Contents</h2>
						<p class="text-sm [color:var(--ui-text-subtle)]">12 min read • 2.4k words</p>
					</div>
					<nav class="flex flex-col gap-1">
						<a class="ui-btn-ghost bg-primary/10 text-primary" href="#introduction">Introduction</a>
						<a class="ui-btn-ghost" href="#architecture">Architecture</a>
						<a class="ui-btn-ghost" href="#implementation">Implementation</a>
						<a class="ui-btn-ghost" href="#benchmarks">Benchmarks</a>
					</nav>
				</div>
				<div class="flex flex-col gap-2 border-t ui-divider pt-6">
					<button type="button" class="ui-btn-ghost justify-start px-0">
						<span class="material-symbols-outlined text-xl">share</span>
						<span>Share Article</span>
					</button>
					<button type="button" class="ui-btn-ghost justify-start px-0">
						<span class="material-symbols-outlined text-xl">bookmark</span>
						<span>Save for Later</span>
					</button>
				</div>
			</div>
		</aside>

		<article class="lg:col-span-9 xl:col-span-8 xl:col-start-4">
			<header class="mb-10" id="introduction">
				<div class="mb-6 flex items-center gap-2">
					<span class="ui-chip text-[10px] uppercase tracking-widest">Engineering</span>
					<span class="[color:var(--ui-text-subtle)]">•</span>
					<span class="text-sm [color:var(--ui-text-subtle)]">Jan 24, 2024</span>
				</div>
				<h1 class="ui-heading-hero mb-8">Optimizing Moodle with Ollama AI</h1>
				<div class="ui-panel-soft flex items-center gap-4 p-4">
					<div class="flex size-12 items-center justify-center rounded-full bg-[var(--ui-bg-muted)] text-[var(--ui-text-subtle)]">
						<span class="material-symbols-outlined text-2xl">person</span>
					</div>
					<div>
						<p class="mb-1 text-sm font-bold leading-none [color:var(--ui-text)]">Nguyen Van Hai</p>
						<p class="text-xs [color:var(--ui-text-subtle)]">Backend Engineer & System Architect</p>
					</div>
				</div>
			</header>

			<div class="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed [color:var(--ui-text-muted)]">
				<p class="mb-8 text-xl font-light italic leading-relaxed [color:var(--ui-text-subtle)]">
					Modern Learning Management Systems (LMS) like Moodle are entering a new era. By integrating local LLM orchestration via Ollama, we can provide private, performant AI features without the cost of external APIs.
				</p>

				<h2 class="mt-12 mb-4 text-2xl font-bold [color:var(--ui-text)]">Introduction to LLMs in Education</h2>
				<p class="mb-6">
					The educational landscape is shifting. Privacy is paramount when dealing with student data, making cloud-based AI solutions often problematic for strict compliance environments. This is where <strong>Ollama</strong> shines—allowing us to run powerful models like Llama 3 or Mistral directly on our own infrastructure.
				</p>

				<div class="my-10 rounded-xl bg-gradient-to-br from-primary/20 to-transparent p-1" id="architecture">
					<div class="ui-panel rounded-lg p-8">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-bold [color:var(--ui-text)]">
							<span class="material-symbols-outlined text-primary">memory</span>
							System Architecture Overlook
						</h3>
						<div class="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed ui-divider bg-[var(--ui-bg-muted)]">
							<div class="p-6 text-center">
								<span class="material-symbols-outlined mb-2 text-4xl [color:var(--ui-text-subtle)]">schema</span>
								<p class="text-sm italic [color:var(--ui-text-subtle)]">Diagram: Moodle (PHP) ⟷ REST API ⟷ Ollama (Local LLM)</p>
							</div>
						</div>
					</div>
				</div>

				<h2 class="mt-12 mb-4 text-2xl font-bold [color:var(--ui-text)]" id="implementation">Implementation: The PHP Connector</h2>
				<p class="mb-6">
					To connect Moodle (PHP) with Ollama, we leverage the REST API. Below is a simplified implementation of a service class that handles the stream-based communication with the local AI daemon.
				</p>

				<div class="group relative my-8 not-prose">
					<div class="absolute -left-4 bottom-0 top-0 w-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100"></div>
					<pre class="overflow-x-auto rounded-lg bg-[var(--ui-bg-muted)] p-5 font-mono text-sm leading-6 [color:var(--ui-text)]"><code><span class="text-primary">class</span> <span class="text-amber-600 dark:text-amber-400">OllamaService</span> {'{'}<br>    <span class="[color:var(--ui-text-subtle)]">// Initialize connection to local Ollama instance</span><br>    <span class="text-primary">public function</span> <span class="text-blue-600 dark:text-blue-400">generateResponse</span>(string <span class="text-emerald-600">$prompt</span>) {'{'}<br>        <span class="text-emerald-600">$ch</span> = curl_init(<span class="text-rose-500">'http://localhost:11434/api/generate'</span>);<br>        curl_setopt(<span class="text-emerald-600">$ch</span>, CURLOPT_POSTFIELDS, json_encode([<br>            <span class="text-rose-500">'model'</span> => <span class="text-rose-500">'llama3'</span>,<br>            <span class="text-rose-500">'prompt'</span> => <span class="text-emerald-600">$prompt</span>,<br>            <span class="text-rose-500">'stream'</span> => <span class="text-primary">false</span><br>        ]));<br>        <span class="text-primary">return</span> curl_exec(<span class="text-emerald-600">$ch</span>);<br>    {'}'}<br>{'}'}</code></pre>
					<div class="mt-2 flex justify-end">
						<span class="text-[10px] font-bold uppercase tracking-wider [color:var(--ui-text-subtle)]">PHP 8.2 • Ollama v0.1.32</span>
					</div>
				</div>

				<h2 class="mt-12 mb-4 text-2xl font-bold [color:var(--ui-text)]" id="benchmarks">Benchmarks &amp; Performance</h2>
				<p class="mb-6">
					In our tests running on an NVIDIA RTX 4090, we observed tokens-per-second (TPS) rates that exceed the typical latency of cloud-based providers, with the added benefit of zero egress costs.
				</p>

				<blockquote class="my-10 border-l-4 border-primary bg-transparent py-2 pl-6 text-xl font-light italic [color:var(--ui-text-muted)]">
					"The goal isn't just to add AI; it's to add intelligence that respects user privacy and system reliability."
				</blockquote>

				<div class="not-prose mt-16 border-t ui-divider pt-12">
					<div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
						<div class="flex flex-col">
							<span class="mb-2 text-xs font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">Previous Post</span>
							<a class="ui-link text-lg" href={`/${locale}/blog`}>Scaling Kubernetes for 100k Concurrent Users</a>
						</div>
						<div class="flex flex-col text-right sm:items-end">
							<span class="mb-2 text-xs font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">Next Post</span>
							<a class="ui-link text-lg" href={`/${locale}/blog`}>Zero-Trust Security in PHP Apps</a>
						</div>
					</div>
				</div>
			</div>
		</article>
	</div>
</div>
