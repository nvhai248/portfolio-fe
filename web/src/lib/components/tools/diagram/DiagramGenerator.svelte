<script lang="ts">
	import { onMount, tick } from 'svelte';

	let mermaidCode = $state(`flowchart TD
    A[Bắt đầu] --> B[Người dùng gửi yêu cầu]
    B --> C[Hệ thống tiếp nhận]
    C --> D[Kiểm tra dữ liệu]
    D -->|Hợp lệ| E[Xử lý yêu cầu]
    D -->|Không hợp lệ| F[Trả về lỗi]
    E --> G[Lưu kết quả]
    G --> H[Phản hồi người dùng]
    F --> H
    H --> I[Kết thúc]`);

	let previewContainer: HTMLDivElement | undefined = $state();
	let isMermaidLoaded = $state(false);
	let errorMessage = $state('');
	let renderCounter = 0;
	let selectedTemplate = $state('');

	const templates: Record<string, { label: string; code: string }> = {
		flowchart: {
			label: 'Flowchart',
			code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`
		},
		sequence: {
			label: 'Sequence',
			code: `sequenceDiagram
    participant Client
    participant Server
    participant Database
    Client->>Server: HTTP Request
    Server->>Database: Query
    Database-->>Server: Result
    Server-->>Client: HTTP Response`
		},
		classDiagram: {
			label: 'Class',
			code: `classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Order {
        +int id
        +Date createdAt
        +submit()
    }
    User "1" --> "*" Order : places`
		},
		gantt: {
			label: 'Gantt',
			code: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
        Research       :a1, 2026-01-01, 14d
        Design         :a2, after a1, 10d
    section Development
        Backend API    :b1, after a2, 21d
        Frontend UI    :b2, after a2, 18d
    section Testing
        QA Testing     :c1, after b1, 7d`
		},
		erDiagram: {
			label: 'ER Diagram',
			code: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    USER {
        int id PK
        string name
        string email
    }
    ORDER {
        int id PK
        date created_at
        string status
    }`
		},
		pie: {
			label: 'Pie Chart',
			code: `pie title Technology Usage
    "JavaScript" : 40
    "TypeScript" : 30
    "Python" : 15
    "Go" : 10
    "Other" : 5`
		}
	};

	onMount(() => {
		if (!(window as any).mermaid) {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
			script.onload = async () => {
				(window as any).mermaid.initialize({
					startOnLoad: false,
					theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
					securityLevel: 'loose',
					fontFamily: 'Inter, sans-serif'
				});
				isMermaidLoaded = true;
				await tick();
				renderDiagram();
			};
			document.head.appendChild(script);
		} else {
			isMermaidLoaded = true;
			tick().then(() => renderDiagram());
		}
	});

	async function renderDiagram() {
		if (!previewContainer || !isMermaidLoaded) return;
		errorMessage = '';

		const mermaid = (window as any).mermaid;
		const currentId = `mermaid-preview-${++renderCounter}`;

		try {
			const { svg } = await mermaid.render(currentId, mermaidCode.trim());
			if (previewContainer) {
				previewContainer.innerHTML = svg;

				// Make SVG responsive
				const svgEl = previewContainer.querySelector('svg');
				if (svgEl) {
					svgEl.style.maxWidth = '100%';
					svgEl.style.height = 'auto';
				}
			}
		} catch (err: any) {
			errorMessage = err?.message || 'Invalid Mermaid syntax';
			// Clean up failed render element
			const failedEl = document.getElementById('d' + currentId);
			if (failedEl) failedEl.remove();
		}
	}

	function applyTemplate(key: string) {
		if (templates[key]) {
			mermaidCode = templates[key].code;
			selectedTemplate = key;
			renderDiagram();
		}
	}

	async function exportPng() {
		if (!previewContainer) return;
		const svgEl = previewContainer.querySelector('svg');
		if (!svgEl) return;

		const svgData = new XMLSerializer().serializeToString(svgEl);
		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			const scale = 2;
			const canvas = document.createElement('canvas');
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			const ctx = canvas.getContext('2d')!;
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.scale(scale, scale);
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);

			const pngUrl = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = 'diagram.png';
			link.href = pngUrl;
			link.click();
		};
		img.src = url;
	}

	function exportSvg() {
		if (!previewContainer) return;
		const svgEl = previewContainer.querySelector('svg');
		if (!svgEl) return;

		const svgData = new XMLSerializer().serializeToString(svgEl);
		const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'diagram.svg';
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	}

	// Debounced auto-render
	let debounceTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const _code = mermaidCode;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			if (isMermaidLoaded) renderDiagram();
		}, 400);
	});
</script>

<div class="glass-panel w-full overflow-hidden rounded-[2.5rem] shadow-2xl p-1 relative">
	<div class="bg-surface/80 relative z-10 w-full rounded-[2.4rem] backdrop-blur-3xl p-6 sm:p-8 flex flex-col gap-6">

		{#if !isMermaidLoaded}
			<div class="flex items-center justify-center p-20">
				<span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
			</div>
		{:else}
			<!-- Template chips + Export buttons -->
			<div class="flex flex-wrap items-center justify-between gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-primary/10">
				<div class="flex flex-wrap items-center gap-2">
					<span class="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mr-1">Templates:</span>
					{#each Object.entries(templates) as [key, tmpl]}
						<button
							class="px-3 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-all border
								{selectedTemplate === key
									? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
									: 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary'}"
							onclick={() => applyTemplate(key)}
						>
							{tmpl.label}
						</button>
					{/each}
				</div>

				<div class="flex items-center gap-2">
					<button
						onclick={exportSvg}
						class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-9 !px-3 !text-xs gap-1.5 hover:bg-primary hover:text-white transition-colors"
					>
						<span class="material-symbols-outlined text-sm">download</span>
						SVG
					</button>
					<button
						onclick={exportPng}
						class="ui-btn ui-btn-primary !h-9 !px-3 !text-xs gap-1.5"
					>
						<span class="material-symbols-outlined text-sm">image</span>
						PNG
					</button>
				</div>
			</div>

			<!-- Editor + Preview -->
			<div class="grid lg:grid-cols-2 gap-6 min-h-[500px]">
				<!-- Code Editor -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between px-1">
						<span class="text-[0.65rem] font-bold uppercase tracking-widest text-primary">Mermaid Code</span>
						<span class="text-[0.6rem] font-mono text-slate-400">{mermaidCode.split('\n').length} dòng</span>
					</div>
					<textarea
						bind:value={mermaidCode}
						spellcheck="false"
						class="flex-1 w-full resize-none rounded-2xl bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed p-5
							   border border-slate-700/50 outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all
							   placeholder:text-slate-500 custom-scrollbar"
						placeholder="Paste your Mermaid code here..."
					></textarea>
				</div>

				<!-- Preview -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between px-1">
						<span class="text-[0.65rem] font-bold uppercase tracking-widest text-primary">Preview</span>
						{#if errorMessage}
							<span class="text-[0.6rem] font-bold text-red-500 flex items-center gap-1">
								<span class="material-symbols-outlined text-xs">error</span>
								Syntax Error
							</span>
						{/if}
					</div>
					<div
						class="flex-1 rounded-2xl bg-white dark:bg-slate-900/80 border border-primary/10 dark:border-white/10
							   shadow-inner overflow-auto p-6 flex items-center justify-center custom-scrollbar relative"
					>
						{#if errorMessage}
							<div class="absolute inset-0 flex items-center justify-center bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm rounded-2xl p-6">
								<div class="text-center max-w-sm">
									<span class="material-symbols-outlined text-4xl text-red-400 mb-3">code_off</span>
									<p class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Lỗi cú pháp Mermaid</p>
									<p class="text-xs text-red-500/70 dark:text-red-400/60 font-mono break-all leading-relaxed">{errorMessage}</p>
								</div>
							</div>
						{/if}
						<div bind:this={previewContainer} class="w-full flex items-center justify-center diagram-output"></div>
					</div>
				</div>
			</div>

			<p class="text-[0.65rem] font-bold text-primary tracking-widest uppercase opacity-70 text-center">
				Nhập mã Mermaid bên trái → Xem trước realtime bên phải → Xuất ảnh PNG hoặc SVG.
			</p>
		{/if}
	</div>
	<div class="absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: var(--ui-primary);
		opacity: 0.2;
		border-radius: 9999px;
	}
	/* Ensure mermaid SVG text is visible in dark mode */
	:global(.dark) .diagram-output :global(svg) {
		filter: invert(0);
	}
	:global(.dark) .diagram-output :global(.nodeLabel),
	:global(.dark) .diagram-output :global(.edgeLabel),
	:global(.dark) .diagram-output :global(.label) {
		color: inherit !important;
	}
</style>
