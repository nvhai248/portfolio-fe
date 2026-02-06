<svelte:head>
    <title>Projects Showcase | Nguyen Van Hai</title>
</svelte:head>

<section class="max-w-[1200px] mx-auto px-6 md:px-20 lg:px-40 py-12 md:py-20">
    <!-- PageHeading -->
    <div class="mb-16 md:mb-24">
        <p class="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">Portfolio</p>
        <h2 class="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter mb-6">
            Projects Showcase
        </h2>
        <p class="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl">
            A curated selection of backend engineering and system architecture works focusing on scalability, serverless patterns, and AI integration.
        </p>
    </div>

    <!-- Projects Gallery -->
    <div class="grid grid-cols-1 gap-20">
        <!-- Card 1: Microleap AI Food Detector -->
        <div class="group flex flex-col lg:flex-row gap-10 items-stretch">
            <div class="w-full lg:w-3/5 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden aspect-[16/9] relative border border-slate-200 dark:border-slate-800">
                <div class="absolute inset-0 flex items-center justify-center bg-[#0d141b] text-white p-12 overflow-hidden">
                    <!-- Abstract Architecture Visual -->
                    <div class="relative w-full h-full opacity-40 group-hover:opacity-60 transition-opacity">
                        <div class="absolute top-1/2 left-0 w-1/4 h-1 bg-primary rounded-full"></div>
                        <div class="absolute top-1/2 left-1/4 size-16 border-2 border-primary rounded-lg flex items-center justify-center -translate-y-1/2">
                            <span class="material-symbols-outlined text-primary">cloud</span>
                        </div>
                        <div class="absolute top-1/2 left-[calc(25%+64px)] w-20 h-1 bg-slate-600 rounded-full"></div>
                        <div class="absolute top-1/2 right-1/4 size-24 border-2 border-slate-400 rounded-full flex items-center justify-center -translate-y-1/2">
                            <span class="material-symbols-outlined text-slate-400 text-4xl">psychology</span>
                        </div>
                        <div class="absolute top-1/2 right-0 w-1/4 h-1 bg-slate-600 rounded-full"></div>
                    </div>
                    <div class="absolute bottom-6 left-6 text-xs font-mono text-slate-500 uppercase tracking-widest">System Diagram: v2.4.0</div>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div class="w-full lg:w-2/5 flex flex-col justify-center">
                <div class="flex gap-2 mb-4 flex-wrap">
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">Azure Functions</span>
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">Vertex AI</span>
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">Qdrant</span>
                </div>
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">Microleap AI Food Detector</h3>
                <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
                    A high-performance serverless backend for real-time image recognition and vector-based food similarity search. Leverages event-driven architecture to scale processing nodes dynamically.
                </p>
                <div class="flex items-center gap-4">
                    <button class="h-10 px-6 bg-primary text-white rounded-lg font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20">
                        View Architecture
                    </button>
                    <button class="size-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-xl">code</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Card 2: Open University Moodle -->
        <div class="group flex flex-col lg:flex-row-reverse gap-10 items-stretch">
            <div class="w-full lg:w-3/5 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden aspect-[16/9] relative border border-slate-200 dark:border-slate-800">
                <!-- Code Snippet Visual -->
                <div class="absolute inset-0 p-8 font-mono text-[10px] md:text-xs leading-relaxed overflow-hidden bg-slate-50 dark:bg-slate-950">
                    <div class="text-blue-500">class</div> <div class="inline text-yellow-600 dark:text-yellow-400">OllamaLMSBridge</div> {'{'}<br>
                    &nbsp;&nbsp;<div class="text-blue-500">private</div> $cache;<br>
                    &nbsp;&nbsp;<div class="text-blue-500">public function</div> __construct(Redis $redis) {'{'}<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;$this-&gt;cache = $redis;<br>
                    &nbsp;&nbsp;{'}'}<br><br>
                    &nbsp;&nbsp;<div class="text-blue-500">public function</div> <div class="inline text-green-600">processPrompt</div>(string $query) {'{'}<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<div class="text-slate-500">// Check Redis for cached embedding</div><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;$hit = $this-&gt;cache-&gt;get(sha1($query));<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<div class="text-pink-500">if</div> ($hit) <div class="text-pink-500">return</div> $hit;<br><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<div class="text-slate-500">// Request from local Ollama instance</div><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;$response = $this-&gt;ollamaClient-&gt;generate($query);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;$this-&gt;cache-&gt;set(sha1($query), $response);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;<div class="text-pink-500">return</div> $response;<br>
                    &nbsp;&nbsp;{'}'}<br>
                    {'}'}
                </div>
                <div class="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/50 dark:to-black/30 pointer-events-none"></div>
            </div>
            <div class="w-full lg:w-2/5 flex flex-col justify-center">
                <div class="flex gap-2 mb-4 flex-wrap">
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">PHP 8.2</span>
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">Redis</span>
                    <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">Ollama</span>
                </div>
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">Open University Moodle</h3>
                <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
                    Modernizing enterprise learning management systems through localized LLM integration. Optimized caching strategies reduced database load by 40% while providing instant AI-assisted tutoring.
                </p>
                <div class="flex items-center gap-4">
                    <button class="h-10 px-6 bg-primary text-white rounded-lg font-bold text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/20">
                        System Review
                    </button>
                    <button class="size-10 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-xl">code</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>
