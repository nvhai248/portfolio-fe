<svelte:head>
    <title>Nguyen Van Hai - Backend Engineer & System Architect</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</svelte:head>

<div class="flex flex-col w-full max-w-[960px] mx-auto px-4 md:px-10 pb-12">
    <!-- Page Heading / Hero -->
    <div class="flex flex-col py-8 gap-6">
        <div class="flex flex-wrap justify-between items-start gap-4">
            <div class="flex min-w-72 flex-col gap-3">
                <p class="text-slate-900 dark:text-slate-50 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                    Backend Engineering & System Architect
                </p>
                <p class="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal leading-normal max-w-2xl">
                    Designing scalable systems and AI-integrated backend architectures. Focused on performance, reliability, and clean code.
                </p>
            </div>
            <!-- Moved "Download PDF" button from Header to Hero for better context & structure -->
            <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all shadow-sm">
                <span class="material-symbols-outlined mr-2 text-sm">download</span>
                <span class="truncate">Download PDF</span>
            </button>
        </div>
    </div>

    <!-- Experience Section -->
    <section id="experience" class="py-5">
        <h2 class="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Professional Experience</h2>
        <div class="grid grid-cols-[40px_1fr] gap-x-4 mt-4">
            <!-- Timeline Item 1 -->
            <div class="flex flex-col items-center gap-1 pt-1">
                <div class="bg-primary/10 p-1.5 rounded-full text-primary">
                    <span class="material-symbols-outlined" style="font-size: 20px;">terminal</span>
                </div>
                <div class="w-[1.5px] bg-slate-200 dark:bg-slate-700 h-full grow mt-1 min-h-[60px]"></div>
            </div>
            <div class="flex flex-1 flex-col pb-10">
                <div class="flex flex-wrap justify-between items-start gap-2">
                    <p class="text-slate-900 dark:text-slate-50 text-lg font-bold leading-normal">Software Engineer at Nashtech</p>
                    <span class="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">2021 — Present</span>
                </div>
                <p class="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal mb-2">LMS Systems & AI Plugins</p>
                <ul class="text-slate-600 dark:text-slate-400 text-sm list-disc pl-4 space-y-1">
                    <li>Architected and developed scalable Learning Management System features.</li>
                    <li>Integrated AI-driven plugins for automated grading and content recommendations.</li>
                    <li>Optimized backend queries, reducing API latency by 40% for concurrent users.</li>
                </ul>
            </div>

            <!-- Timeline Item 2 -->
            <div class="flex flex-col items-center gap-1">
                <div class="bg-primary/10 p-1.5 rounded-full text-primary">
                    <span class="material-symbols-outlined" style="font-size: 20px;">smart_toy</span>
                </div>
                <div class="w-[1.5px] bg-slate-200 dark:bg-slate-700 h-full grow mt-1 min-h-[60px]"></div>
            </div>
            <div class="flex flex-1 flex-col pb-10">
                <div class="flex flex-wrap justify-between items-start gap-2">
                    <p class="text-slate-900 dark:text-slate-50 text-lg font-bold leading-normal">Backend Developer at Microleap</p>
                    <span class="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">2019 — 2021</span>
                </div>
                <p class="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal mb-2">AI Food Detector Development</p>
                <ul class="text-slate-600 dark:text-slate-400 text-sm list-disc pl-4 space-y-1">
                    <li>Developed core backend services for a real-time AI food recognition engine.</li>
                    <li>Implemented high-throughput data pipelines for image processing.</li>
                    <li>Managed deployment using Docker and Kubernetes for consistent environments.</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Technical Stack Section -->
    <section id="skills" class="py-5">
        <h2 class="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-6 pt-5">Technical Stack</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Languages -->
            <div class="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">code</span>
                    <h3 class="font-bold text-slate-900 dark:text-slate-50">Languages</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Golang</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">C# / .NET</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">TypeScript</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">PHP</span>
                </div>
            </div>
            <!-- Cloud / DevOps -->
            <div class="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">cloud</span>
                    <h3 class="font-bold text-slate-900 dark:text-slate-50">Cloud & DevOps</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Azure</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">AWS</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Docker</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Terraform</span>
                </div>
            </div>
            <!-- AI / Data -->
            <div class="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">database</span>
                    <h3 class="font-bold text-slate-900 dark:text-slate-50">AI & Data</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Vertex AI</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Qdrant</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">PostgreSQL</span>
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300">Redis</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="py-5">
        <h2 class="text-slate-900 dark:text-slate-50 text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Education</h2>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
            <div class="flex items-center gap-4">
                <div class="bg-primary/10 p-3 rounded-lg text-primary">
                    <span class="material-symbols-outlined text-2xl">school</span>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">VNUHCM - University of Science</h3>
                    <p class="text-slate-600 dark:text-slate-400">Bachelor of Computer Science</p>
                </div>
            </div>
            <div class="flex flex-col items-start md:items-end">
                <div class="flex items-center gap-2 text-primary font-bold text-xl">
                    <span class="text-sm text-slate-600 dark:text-slate-500 font-normal">GPA:</span>
                    3.2 / 4.0
                </div>
                <p class="text-xs text-slate-500 min-w-max uppercase tracking-widest font-bold">Class of 2019</p>
            </div>
        </div>
    </section>

    <!-- Content Call to Action -->
    <div class="py-12">
        <div class="flex flex-col items-center justify-center p-10 rounded-2xl bg-primary text-white text-center gap-6 shadow-xl">
            <div class="flex flex-col gap-2">
                <h2 class="text-3xl font-black tracking-tight">Ready to collaborate?</h2>
                <p class="text-primary-100/80 font-medium">Download the full technical resume or get in touch.</p>
            </div>
            <div class="flex flex-wrap justify-center gap-4">
                <button class="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-6 bg-white text-primary font-bold hover:bg-slate-50 transition-colors shadow-lg">
                    <span class="material-symbols-outlined mr-2">download</span>
                    Download CV
                </button>
                <button class="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-6 bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-colors">
                    <span class="material-symbols-outlined mr-2">mail</span>
                    Contact Me
                </button>
            </div>
        </div>
    </div>
</div>
