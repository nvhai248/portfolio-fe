<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { localeFromPathname } from '$lib/i18n/locale';

	const TARGET_BYTES = 1024 * 1024;
	const MIN_SCALE = 0.12;
	const MIN_QUALITY = 0.28;

	type SourceAsset = {
		file: File;
		name: string;
		size: number;
		width: number;
		height: number;
		mime: string;
		url: string;
	};

	type CompressedAsset = {
		name: string;
		size: number;
		width: number;
		height: number;
		mime: string;
		url: string;
		quality: number;
		scale: number;
	};

	type CompressionJobStatus = 'queued' | 'processing' | 'done' | 'error';

	type CompressionJob = {
		id: string;
		source: SourceAsset;
		compressed: CompressedAsset | null;
		status: CompressionJobStatus;
		errorMessage: string;
	};

	let uploader: HTMLInputElement | undefined = $state();
	let jobs = $state<CompressionJob[]>([]);
	let isDragging = $state(false);
	let isQueueRunning = $state(false);
	let noticeMessage = $state('');

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale).tools.imageCompress.ui);

	const totalJobs = $derived(jobs.length);
	const completedJobs = $derived.by(() => jobs.filter((job) => job.status === 'done').length);
	const failedJobs = $derived.by(() => jobs.filter((job) => job.status === 'error').length);
	const processingJobs = $derived.by(() => jobs.filter((job) => job.status === 'processing').length);
	const downloadableJobs = $derived.by(() =>
		jobs.filter((job) => job.status === 'done' && job.compressed)
	);
	const downloadableCount = $derived(downloadableJobs.length);
	const totalOriginalBytes = $derived.by(() =>
		jobs.reduce((sum, job) => sum + job.source.size, 0)
	);
	const totalCompressedBytes = $derived.by(() =>
		jobs.reduce((sum, job) => sum + (job.compressed?.size ?? 0), 0)
	);
	const totalSavedBytes = $derived.by(() =>
		Math.max(totalOriginalBytes - totalCompressedBytes, 0)
	);
	const totalSavedPercent = $derived.by(() => {
		if (totalOriginalBytes <= 0 || totalCompressedBytes <= 0) return 0;
		return Math.max(0, Math.round((totalSavedBytes / totalOriginalBytes) * 100));
	});

	onMount(() => {
		return () => {
			cleanupAllJobs();
		};
	});

	function createId(): string {
		if (typeof globalThis.crypto?.randomUUID === 'function') {
			return globalThis.crypto.randomUUID();
		}

		return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
	}

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	}

	function formatScale(scale: number): string {
		return `${Math.round(scale * 100)}%`;
	}

	function formatQuality(quality: number): string {
		return `${Math.round(quality * 100)}%`;
	}

	function getMimeLabel(mime: string): string {
		if (mime === 'image/jpeg') return 'JPEG';
		if (mime === 'image/png') return 'PNG';
		if (mime === 'image/webp') return 'WebP';
		return mime.replace('image/', '').toUpperCase();
	}

	function getOutputMime(inputMime: string): string {
		if (inputMime === 'image/png' || inputMime === 'image/webp') {
			return 'image/webp';
		}

		return 'image/jpeg';
	}

	function getDownloadName(fileName: string, mime: string): string {
		const stem = fileName.replace(/\.[^.]+$/, '');
		const extension = mime === 'image/webp' ? 'webp' : 'jpg';
		return `${stem}-compressed.${extension}`;
	}

	function getStatusLabel(status: CompressionJobStatus): string {
		return t.status[status];
	}

	function getStatusClass(status: CompressionJobStatus): string {
		if (status === 'done') {
			return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
		}

		if (status === 'error') {
			return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300';
		}

		if (status === 'processing') {
			return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
		}

		return 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300';
	}

	function revokeCompressedAsset(asset: CompressedAsset | null) {
		if (asset) {
			URL.revokeObjectURL(asset.url);
		}
	}

	function revokeSourceAsset(asset: SourceAsset | null) {
		if (asset) {
			URL.revokeObjectURL(asset.url);
		}
	}

	function revokeJobAssets(job: CompressionJob) {
		revokeSourceAsset(job.source);
		revokeCompressedAsset(job.compressed);
	}

	function cleanupAllJobs() {
		for (const job of jobs) {
			revokeJobAssets(job);
		}
	}

	function clearJobs() {
		cleanupAllJobs();
		jobs = [];
		noticeMessage = '';
	}

	function updateJob(jobId: string, updater: (job: CompressionJob) => CompressionJob) {
		const index = jobs.findIndex((job) => job.id === jobId);
		if (index < 0) return;

		const nextJobs = [...jobs];
		nextJobs[index] = updater(nextJobs[index]);
		jobs = nextJobs;
	}

	async function loadImageElement(url: string): Promise<HTMLImageElement> {
		return await new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () => reject(new Error(t.decodeFailed));
			image.src = url;
		});
	}

	async function canvasToBlob(
		canvas: HTMLCanvasElement,
		type: string,
		quality: number
	): Promise<Blob | null> {
		return await new Promise((resolve) => {
			canvas.toBlob((blob) => resolve(blob), type, quality);
		});
	}

	async function createSourceAsset(file: File): Promise<SourceAsset> {
		const objectUrl = URL.createObjectURL(file);

		try {
			const image = await loadImageElement(objectUrl);

			return {
				file,
				name: file.name,
				size: file.size,
				width: image.naturalWidth,
				height: image.naturalHeight,
				mime: file.type || 'image/jpeg',
				url: objectUrl
			};
		} catch (error) {
			URL.revokeObjectURL(objectUrl);
			throw error;
		}
	}

	async function compressSourceAsset(asset: SourceAsset): Promise<CompressedAsset> {
		const image = await loadImageElement(asset.url);
		const outputMime = getOutputMime(asset.mime);
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		if (!context) {
			throw new Error(t.canvasUnavailable);
		}

		let bestCandidate: CompressedAsset | null = null;
		let scale = Math.min(1, 2400 / Math.max(asset.width, asset.height));
		let qualityFloor = MIN_QUALITY;

		for (let scaleStep = 0; scaleStep < 18; scaleStep += 1) {
			const width = Math.max(96, Math.round(asset.width * scale));
			const height = Math.max(96, Math.round(asset.height * scale));
			canvas.width = width;
			canvas.height = height;
			context.clearRect(0, 0, width, height);
			context.drawImage(image, 0, 0, width, height);

			for (let quality = 0.92; quality >= qualityFloor; quality -= 0.08) {
				const preferredBlob = await canvasToBlob(canvas, outputMime, quality);
				const blob = preferredBlob ?? (await canvasToBlob(canvas, 'image/jpeg', quality));

				if (!blob) continue;

				const candidate: CompressedAsset = {
					name: getDownloadName(asset.name, blob.type || outputMime),
					size: blob.size,
					width,
					height,
					mime: blob.type || outputMime,
					url: URL.createObjectURL(blob),
					quality,
					scale
				};

				if (!bestCandidate || candidate.size < bestCandidate.size) {
					if (bestCandidate) {
						URL.revokeObjectURL(bestCandidate.url);
					}
					bestCandidate = candidate;
				} else {
					URL.revokeObjectURL(candidate.url);
				}

				if (candidate.size <= TARGET_BYTES) {
					return candidate;
				}
			}

			scale = Math.max(scale * (scaleStep < 5 ? 0.88 : 0.8), MIN_SCALE);
			qualityFloor = Math.max(qualityFloor - 0.02, 0.18);
		}

		if (bestCandidate && bestCandidate.size <= TARGET_BYTES) {
			return bestCandidate;
		}

		if (bestCandidate) {
			URL.revokeObjectURL(bestCandidate.url);
		}

		throw new Error(t.compressFailed);
	}

	async function processQueue() {
		if (isQueueRunning) return;

		isQueueRunning = true;

		try {
			for (let index = 0; index < jobs.length; index += 1) {
				const currentJob = jobs[index];
				if (!currentJob || currentJob.status !== 'queued') continue;

				updateJob(currentJob.id, (job) => ({
					...job,
					status: 'processing',
					errorMessage: ''
				}));

				try {
					const compressed = await compressSourceAsset(currentJob.source);

					updateJob(currentJob.id, (job) => {
						if (job.compressed) {
							revokeCompressedAsset(job.compressed);
						}

						return {
							...job,
							compressed,
							status: 'done',
							errorMessage: ''
						};
					});
				} catch (error: unknown) {
					updateJob(currentJob.id, (job) => ({
						...job,
						status: 'error',
						errorMessage: error instanceof Error ? error.message : t.browserFailed
					}));
				}
			}
		} finally {
			isQueueRunning = false;
		}
	}

	async function enqueueFiles(fileList: File[]) {
		if (!fileList.length) return;

		const validFiles: File[] = [];
		const invalidFiles: string[] = [];
		const decodeFailedFiles: string[] = [];
		const nextJobs: CompressionJob[] = [];

		for (const file of fileList) {
			if (!file.type.startsWith('image/')) {
				invalidFiles.push(file.name);
				continue;
			}

			validFiles.push(file);
		}

		for (const file of validFiles) {
			try {
				const source = await createSourceAsset(file);
				nextJobs.push({
					id: createId(),
					source,
					compressed: null,
					status: 'queued',
					errorMessage: ''
				});
			} catch {
				decodeFailedFiles.push(file.name);
			}
		}

		if (nextJobs.length) {
			jobs = [...jobs, ...nextJobs];
			void processQueue();
		}

		const notices: string[] = [];
		if (invalidFiles.length) {
			notices.push(
				t.unsupportedFilesNotice.replace('{count}', String(invalidFiles.length))
			);
		}
		if (decodeFailedFiles.length) {
			notices.push(
				t.decodeFailedNotice.replace('{count}', String(decodeFailedFiles.length))
			);
		}
		noticeMessage = notices.join(' ');
	}

	async function handleChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		await enqueueFiles(Array.from(target.files ?? []));
		target.value = '';
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		await enqueueFiles(Array.from(event.dataTransfer?.files ?? []));
	}

	function downloadAsset(url: string, fileName: string) {
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.click();
	}

	function downloadJob(job: CompressionJob) {
		if (!job.compressed) return;
		downloadAsset(job.compressed.url, job.compressed.name);
	}

	function downloadAllCompressed() {
		for (const job of downloadableJobs) {
			if (job.compressed) {
				downloadAsset(job.compressed.url, job.compressed.name);
			}
		}
	}

	function recompressJob(jobId: string) {
		updateJob(jobId, (job) => {
			if (job.compressed) {
				revokeCompressedAsset(job.compressed);
			}

			return {
				...job,
				compressed: null,
				status: 'queued',
				errorMessage: ''
			};
		});

		void processQueue();
	}

	function recompressAll() {
		jobs = jobs.map((job) => {
			if (job.compressed) {
				revokeCompressedAsset(job.compressed);
			}

			return {
				...job,
				compressed: null,
				status: 'queued' as const,
				errorMessage: ''
			};
		});

		void processQueue();
	}
</script>

<div class="glass-panel relative w-full overflow-hidden rounded-[2rem] p-px shadow-xl">
	<div class="bg-surface/80 relative z-10 flex w-full flex-col gap-5 rounded-[1.85rem] p-4 backdrop-blur-3xl sm:p-5 lg:p-6">
		<div class="flex flex-col gap-4 rounded-[1.4rem] border border-primary/10 bg-white/70 p-4 shadow-sm dark:bg-black/20">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p class="ui-eyebrow mb-2">{t.eyebrow}</p>
					<h2 class="ui-heading-2 text-pretty">{t.headline}</h2>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<input
						class="hidden"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						multiple
						bind:this={uploader}
						onchange={handleChange}
					/>
					<button
						type="button"
						class="ui-btn ui-btn-primary gap-2 !h-10 !px-4 !text-[0.72rem]"
						onclick={() => uploader?.click()}
					>
						<span class="material-symbols-outlined text-lg">upload</span>
						{jobs.length ? t.addMoreImages : t.uploadImage}
					</button>
					<button
						type="button"
						class="ui-btn gap-2 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-10 !px-4 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						onclick={recompressAll}
						disabled={!jobs.length || isQueueRunning}
					>
						<span class="material-symbols-outlined text-lg">sync</span>
						{t.recompressAll}
					</button>
					<button
						type="button"
						class="ui-btn gap-2 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-10 !px-4 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						onclick={downloadAllCompressed}
						disabled={!downloadableCount || isQueueRunning}
					>
						<span class="material-symbols-outlined text-lg">folder_zip</span>
						{t.downloadAll}
					</button>
					<button
						type="button"
						class="ui-btn gap-2 border border-[var(--ui-border)] bg-transparent !h-10 !px-4 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						onclick={clearJobs}
						disabled={!jobs.length || isQueueRunning}
					>
						<span class="material-symbols-outlined text-lg">delete_sweep</span>
						{t.clearList}
					</button>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.18em]">
				<span class="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{t.targetChip}</span>
				<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
					JPEG / PNG / WebP
				</span>
				{#if isQueueRunning}
					<span class="rounded-full bg-amber-50 px-2.5 py-1 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
						{t.processingQueueChip}
					</span>
				{:else if totalJobs > 0}
					<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
						{completedJobs}/{totalJobs} {t.readyLabel}
					</span>
				{/if}
			</div>
		</div>

		<div
			aria-label={t.dropTitle}
			class="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[1.6rem] border border-dashed px-6 py-10 text-center transition-colors dark:bg-slate-950/30
				{isDragging
					? 'border-primary/50 bg-primary/5'
					: 'border-primary/20 bg-white/60'}"
			role="region"
			ondragenter={(event) => {
				event.preventDefault();
				isDragging = true;
			}}
			ondragover={(event) => {
				event.preventDefault();
				isDragging = true;
			}}
			ondragleave={(event) => {
				event.preventDefault();
				isDragging = false;
			}}
			ondrop={handleDrop}
		>
			<div class="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
				<span class="material-symbols-outlined text-3xl">imagesmode</span>
			</div>
			<div class="max-w-2xl">
				<h3 class="ui-heading-3 mb-3 !text-base !tracking-[0.08em] !normal-case">
					{t.dropTitle}
				</h3>
				<p class="ui-body mx-auto max-w-xl">{@html t.dropDescription}</p>
			</div>
			<button
				type="button"
				class="ui-btn ui-btn-primary gap-2 !h-10 !px-5 !text-[0.72rem]"
				onclick={() => uploader?.click()}
			>
				<span class="material-symbols-outlined text-lg">upload_file</span>
				{t.chooseForCompression}
			</button>
		</div>

		{#if noticeMessage}
			<div class="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
				{noticeMessage}
			</div>
		{/if}

		{#if jobs.length > 0}
			<div class="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
				<div class="rounded-[1.5rem] border border-[var(--ui-border-subtle)] bg-white/80 p-4 shadow-sm dark:bg-slate-950/40">
					<h3 class="mb-4 text-[0.72rem] font-black uppercase tracking-[0.2em] text-primary">{t.batchSummaryTitle}</h3>

					<div class="grid gap-3">
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.totalImagesLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">{totalJobs}</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.readyLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">{completedJobs}</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.failedLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">{failedJobs}</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.downloadableLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">{downloadableCount}</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.originalSizeLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">{formatBytes(totalOriginalBytes)}</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.compressedSizeLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">{formatBytes(totalCompressedBytes)}</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.savedLabel}</p>
							<p class="mt-1 text-base font-black text-slate-900 dark:text-white">
								{formatBytes(totalSavedBytes)}{#if totalSavedPercent > 0} ({totalSavedPercent}%){/if}
							</p>
						</div>
						<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
							<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.queueProgressLabel}</p>
							<p class="mt-1 text-sm font-bold text-slate-900 dark:text-white">
								{completedJobs + failedJobs}/{totalJobs}
							</p>
						</div>
					</div>

					<p class="ui-body-sm mt-4">{@html t.note}</p>
				</div>

				<div class="grid gap-5">
					{#each jobs as job (job.id)}
						<div class="rounded-[1.5rem] border border-[var(--ui-border-subtle)] bg-white/80 p-4 shadow-sm dark:bg-slate-950/40">
							<div class="mb-4 flex flex-wrap items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="truncate text-base font-black text-slate-900 dark:text-white">{job.source.name}</p>
									<p class="ui-body-sm">{formatBytes(job.source.size)} · {job.source.width} × {job.source.height}</p>
								</div>

								<div class="flex flex-wrap items-center gap-2">
									<span class="rounded-full px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] {getStatusClass(job.status)}">
										{getStatusLabel(job.status)}
									</span>
									<button
										type="button"
										class="ui-btn gap-2 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-9 !px-3 !text-[0.68rem] disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => recompressJob(job.id)}
										disabled={job.status === 'processing' || isQueueRunning}
									>
										<span class="material-symbols-outlined text-base">sync</span>
										{t.recompressOne}
									</button>
									<button
										type="button"
										class="ui-btn gap-2 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-9 !px-3 !text-[0.68rem] disabled:cursor-not-allowed disabled:opacity-50"
										onclick={() => downloadJob(job)}
										disabled={!job.compressed || job.status !== 'done'}
									>
										<span class="material-symbols-outlined text-base">download</span>
										{t.download}
									</button>
								</div>
							</div>

							<div class="grid gap-4 lg:grid-cols-2">
								<div>
									<div class="mb-2 flex items-center justify-between gap-2">
										<h4 class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">{t.originalTitle}</h4>
										<span class="rounded-full bg-slate-100 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
											{formatBytes(job.source.size)}
										</span>
									</div>
									<div class="flex min-h-[220px] items-center justify-center overflow-hidden rounded-[1.2rem] bg-slate-100/90 p-3 dark:bg-slate-900/70">
										<img
											src={job.source.url}
											alt={`Original ${job.source.name}`}
											class="max-h-[210px] max-w-full rounded-xl object-contain shadow-sm"
										/>
									</div>
								</div>

								<div>
									<div class="mb-2 flex items-center justify-between gap-2">
										<h4 class="text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary">{t.compressedTitle}</h4>
										{#if job.compressed}
											<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
												{formatBytes(job.compressed.size)}
											</span>
										{/if}
									</div>
									<div class="flex min-h-[220px] items-center justify-center overflow-hidden rounded-[1.2rem] bg-slate-100/90 p-3 dark:bg-slate-900/70">
										{#if job.status === 'processing'}
											<div class="flex flex-col items-center gap-3 text-primary">
												<span class="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
												<p class="ui-body-sm text-center">{t.processingBody}</p>
											</div>
										{:else if job.compressed}
											<img
												src={job.compressed.url}
												alt={`Compressed ${job.source.name}`}
												class="max-h-[210px] max-w-full rounded-xl object-contain shadow-sm"
											/>
										{:else if job.status === 'error'}
											<p class="ui-body-sm max-w-sm text-center text-red-500">{job.errorMessage}</p>
										{:else}
											<p class="ui-body-sm text-center">{t.compressedEmpty}</p>
										{/if}
									</div>
								</div>
							</div>

							<div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
								<div class="rounded-[1rem] bg-slate-100/80 px-3 py-2.5 dark:bg-slate-900/70">
									<p class="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-400">{t.savedLabel}</p>
									<p class="mt-1 text-sm font-black text-slate-900 dark:text-white">
										{#if job.compressed}
											{formatBytes(Math.max(job.source.size - job.compressed.size, 0))} ({Math.max(0, Math.round(((job.source.size - job.compressed.size) / job.source.size) * 100))}%)
										{:else}
											--
										{/if}
									</p>
								</div>
								<div class="rounded-[1rem] bg-slate-100/80 px-3 py-2.5 dark:bg-slate-900/70">
									<p class="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-400">{t.dimensionsLabel}</p>
									<p class="mt-1 text-sm font-black text-slate-900 dark:text-white">
										{#if job.compressed}
											{job.compressed.width} × {job.compressed.height}
										{:else}
											--
										{/if}
									</p>
								</div>
								<div class="rounded-[1rem] bg-slate-100/80 px-3 py-2.5 dark:bg-slate-900/70">
									<p class="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-400">{t.formatLabel}</p>
									<p class="mt-1 text-sm font-black text-slate-900 dark:text-white">
										{#if job.compressed}
											{getMimeLabel(job.compressed.mime)}
										{:else}
											--
										{/if}
									</p>
								</div>
								<div class="rounded-[1rem] bg-slate-100/80 px-3 py-2.5 dark:bg-slate-900/70">
									<p class="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-400">{t.qualityScaleLabel}</p>
									<p class="mt-1 text-sm font-black text-slate-900 dark:text-white">
										{#if job.compressed}
											{formatQuality(job.compressed.quality)} / {formatScale(job.compressed.scale)}
										{:else}
											--
										{/if}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
