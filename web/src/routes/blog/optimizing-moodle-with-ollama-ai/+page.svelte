<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let scrollProgress = 0;

    onMount(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            scrollProgress = Math.min(Math.max(scrollPercent * 100, 0), 100);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    });
</script>

<svelte:head>
    <title>Optimizing Moodle with Ollama AI - Nguyen Van Hai</title>
</svelte:head>

<!-- Progress Bar -->
<div class="fixed top-0 left-0 w-full z-[100] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md h-1">
    <div class="h-full bg-primary transition-all duration-100 ease-out" style="width: {scrollProgress}%;"></div>
</div>

<div class="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Sidebar Navigation -->
        <aside class="hidden lg:block lg:col-span-3">
            <div class="sticky top-32 flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Reading Progress</h3>
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold text-primary">{Math.round(scrollProgress)}% Completed</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-primary transition-all duration-100 ease-out" style="width: {scrollProgress}%;"></div>
                    </div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col">
                        <h1 class="text-slate-900 dark:text-white text-base font-bold">Table of Contents</h1>
                        <p class="text-slate-500 text-sm">12 min read • 2.4k words</p>
                    </div>
                    <nav class="flex flex-col gap-1">
                        <a class="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary group" href="#introduction">
                            <span class="material-symbols-outlined text-xl">info</span>
                            <span class="text-sm font-medium">Introduction</span>
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" href="#architecture">
                            <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-xl">account_tree</span>
                            <span class="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Architecture</span>
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" href="#implementation">
                            <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-xl">code</span>
                            <span class="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Implementation</span>
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" href="#benchmarks">
                            <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-xl">speed</span>
                            <span class="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">Benchmarks</span>
                        </a>
                    </nav>
                </div>
                <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                    <button class="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-xl">share</span>
                        <span class="text-sm font-medium">Share Article</span>
                    </button>
                    <button class="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-xl">bookmark</span>
                        <span class="text-sm font-medium">Save for Later</span>
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <article class="lg:col-span-9 xl:col-span-8 xl:col-start-4">
            <header class="mb-12" id="introduction">
                <div class="flex items-center gap-2 mb-6">
                    <span class="bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">Engineering</span>
                    <span class="text-slate-400">•</span>
                    <span class="text-slate-500 text-sm">Jan 24, 2024</span>
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                    Optimizing Moodle with Ollama AI
                </h1>
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                     <!-- Using a placeholder/system icon if avatar URL is not available or to be safe, but sticking to requested design look -->
                    <div class="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <span class="material-symbols-outlined text-2xl">person</span>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">Nguyen Van Hai</p>
                        <p class="text-xs text-slate-500">Backend Engineer & System Architect</p>
                    </div>
                </div>
            </header>

            <div class="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <p class="text-xl font-light leading-relaxed mb-8 italic text-slate-500 dark:text-slate-400">
                    Modern Learning Management Systems (LMS) like Moodle are entering a new era. By integrating local LLM orchestration via Ollama, we can provide private, performant AI features without the cost of external APIs.
                </p>

                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-4">Introduction to LLMs in Education</h2>
                <p class="mb-6">
                    The educational landscape is shifting. Privacy is paramount when dealing with student data, making cloud-based AI solutions often problematic for strict compliance environments. This is where <strong>Ollama</strong> shines—allowing us to run powerful models like Llama 3 or Mistral directly on our own infrastructure.
                </p>

                <div class="my-10 p-1 bg-gradient-to-br from-primary/20 to-transparent rounded-xl" id="architecture">
                    <div class="bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-100 dark:border-slate-800">
                        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary">memory</span>
                            System Architecture Overlook
                        </h3>
                        <div class="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <div class="text-center p-6">
                                <span class="material-symbols-outlined text-4xl text-slate-400 mb-2">schema</span>
                                <p class="text-sm text-slate-500 italic">Diagram: Moodle (PHP) ⟷ REST API ⟷ Ollama (Local LLM)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-4" id="implementation">Implementation: The PHP Connector</h2>
                <p class="mb-6">
                    To connect Moodle (PHP) with Ollama, we leverage the REST API. Below is a simplified implementation of a service class that handles the stream-based communication with the local AI daemon.
                </p>

                <div class="my-8 group relative not-prose">
                    <div class="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <pre class="bg-slate-100 dark:bg-slate-900 p-5 rounded-lg overflow-x-auto font-mono text-sm leading-6"><code><span class="text-primary">class</span> <span class="text-amber-600 dark:text-amber-400">OllamaService</span> {'{'}<br>    <span class="text-slate-500">// Initialize connection to local Ollama instance</span><br>    <span class="text-primary">public function</span> <span class="text-blue-600 dark:text-blue-400">generateResponse</span>(string <span class="text-emerald-600">$prompt</span>) {'{'}<br>        <span class="text-emerald-600">$ch</span> = curl_init(<span class="text-rose-500">'http://localhost:11434/api/generate'</span>);<br>        curl_setopt(<span class="text-emerald-600">$ch</span>, CURLOPT_POSTFIELDS, json_encode([<br>            <span class="text-rose-500">'model'</span> => <span class="text-rose-500">'llama3'</span>,<br>            <span class="text-rose-500">'prompt'</span> => <span class="text-emerald-600">$prompt</span>,<br>            <span class="text-rose-500">'stream'</span> => <span class="text-primary">false</span><br>        ]));<br>        <span class="text-primary">return</span> curl_exec(<span class="text-emerald-600">$ch</span>);<br>    {'}'}<br>{'}'}</code></pre>
                    <div class="mt-2 flex justify-end">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">PHP 8.2 • Ollama v0.1.32</span>
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-4" id="benchmarks">Benchmarks &amp; Performance</h2>
                <p class="mb-6">
                    In our tests running on an NVIDIA RTX 4090, we observed tokens-per-second (TPS) rates that exceed the typical latency of cloud-based providers, with the added benefit of zero egress costs.
                </p>

                <blockquote class="border-l-4 border-primary pl-6 py-2 my-10 italic text-slate-600 dark:text-slate-400 text-xl font-light bg-trasparent">
                    "The goal isn't just to add AI; it's to add intelligence that respects user privacy and system reliability."
                </blockquote>

                <div class="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 not-prose">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Previous Post</span>
                            <a class="text-lg font-bold text-primary hover:underline" href="#">Scaling Kubernetes for 100k Concurrent Users</a>
                        </div>
                        <div class="flex flex-col sm:items-end text-right">
                            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Next Post</span>
                            <a class="text-lg font-bold text-primary hover:underline" href="#">Zero-Trust Security in PHP Apps</a>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</div>
