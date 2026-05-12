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

	let uploader: HTMLInputElement | undefined = $state();
	let sourceAsset: SourceAsset | null = $state(null);
	let compressedAsset: CompressedAsset | null = $state(null);
	let isProcessing = $state(false);
	let isDragging = $state(false);
	let errorMessage = $state('');

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale).tools.imageCompress.ui);

	const savedBytes = $derived.by(() => {
		if (!sourceAsset || !compressedAsset) return 0;
		return Math.max(sourceAsset.size - compressedAsset.size, 0);
	});
	const savedPercent = $derived.by(() => {
		if (!sourceAsset || !compressedAsset || sourceAsset.size <= 0) return 0;
		return Math.max(0, Math.round((savedBytes / sourceAsset.size) * 100));
	});

	onMount(() => {
		return () => {
			revokeSourceAsset();
			revokeCompressedAsset();
		};
	});

	function revokeSourceAsset() {
		if (sourceAsset) {
			URL.revokeObjectURL(sourceAsset.url);
		}
	}

	function revokeCompressedAsset() {
		if (compressedAsset) {
			URL.revokeObjectURL(compressedAsset.url);
		}
	}

	function replaceSourceAsset(nextAsset: SourceAsset | null) {
		revokeSourceAsset();
		sourceAsset = nextAsset;
	}

	function replaceCompressedAsset(nextAsset: CompressedAsset | null) {
		revokeCompressedAsset();
		compressedAsset = nextAsset;
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

	async function loadImageElement(url: string): Promise<HTMLImageElement> {
		return await new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = () => reject(new Error('Could not decode image.'));
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
	}

	async function compressImage(asset: SourceAsset) {
		isProcessing = true;
		errorMessage = '';
		replaceCompressedAsset(null);

		try {
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
					const blob =
						preferredBlob ?? (await canvasToBlob(canvas, 'image/jpeg', quality));

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
						replaceCompressedAsset(candidate);
						isProcessing = false;
						return;
					}
				}

				scale = Math.max(scale * (scaleStep < 5 ? 0.88 : 0.8), MIN_SCALE);
				qualityFloor = Math.max(qualityFloor - 0.02, 0.18);
			}

			if (bestCandidate && bestCandidate.size <= TARGET_BYTES) {
				replaceCompressedAsset(bestCandidate);
				isProcessing = false;
				return;
			}

			if (bestCandidate) {
				URL.revokeObjectURL(bestCandidate.url);
			}

			throw new Error(t.compressFailed);
		} catch (error: unknown) {
			errorMessage =
				error instanceof Error
					? error.message
					: t.browserFailed;
		} finally {
			isProcessing = false;
		}
	}

	async function handleFile(file: File | null | undefined) {
		if (!file) return;

		errorMessage = '';

		if (!file.type.startsWith('image/')) {
			errorMessage = t.invalidFile;
			return;
		}

		const nextSource = await createSourceAsset(file);
		replaceSourceAsset(nextSource);
		await compressImage(nextSource);
	}

	async function handleChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		await handleFile(target.files?.[0]);
		target.value = '';
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		await handleFile(event.dataTransfer?.files?.[0]);
	}

	async function recompress() {
		if (!sourceAsset) return;
		await compressImage(sourceAsset);
	}

	function downloadCompressedImage() {
		if (!compressedAsset) return;

		const link = document.createElement('a');
		link.href = compressedAsset.url;
		link.download = compressedAsset.name;
		link.click();
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
						bind:this={uploader}
						onchange={handleChange}
					/>
					<button
						type="button"
						class="ui-btn ui-btn-primary gap-2 !h-10 !px-4 !text-[0.72rem]"
						onclick={() => uploader?.click()}
					>
						<span class="material-symbols-outlined text-lg">upload</span>
						{sourceAsset ? t.replaceImage : t.uploadImage}
					</button>
					<button
						type="button"
						class="ui-btn gap-2 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-10 !px-4 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						onclick={recompress}
						disabled={!sourceAsset || isProcessing}
					>
						<span class="material-symbols-outlined text-lg">sync</span>
						{t.recompress}
					</button>
					<button
						type="button"
						class="ui-btn gap-2 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-10 !px-4 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						onclick={downloadCompressedImage}
						disabled={!compressedAsset || isProcessing}
					>
						<span class="material-symbols-outlined text-lg">download</span>
						{t.download}
					</button>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.18em]">
				<span class="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{t.targetChip}</span>
				<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
					JPEG / PNG / WebP
				</span>
				{#if isProcessing}
					<span class="rounded-full bg-amber-50 px-2.5 py-1 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
						{t.processingChip}
					</span>
				{:else if compressedAsset}
					<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
						{t.doneChip}
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

		{#if errorMessage}
			<div class="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
				{errorMessage}
			</div>
		{/if}

		<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
			<div class="grid gap-5 md:grid-cols-2">
				<div class="rounded-[1.5rem] border border-[var(--ui-border-subtle)] bg-white/80 p-4 shadow-sm dark:bg-slate-950/40">
					<div class="mb-3 flex items-center justify-between gap-2">
						<h3 class="text-[0.72rem] font-black uppercase tracking-[0.2em] text-primary">{t.originalTitle}</h3>
						{#if sourceAsset}
							<span class="rounded-full bg-slate-100 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
								{formatBytes(sourceAsset.size)}
							</span>
						{/if}
					</div>

					<div class="flex min-h-[260px] items-center justify-center overflow-hidden rounded-[1.25rem] bg-slate-100/90 p-3 dark:bg-slate-900/70">
						{#if sourceAsset}
							<img
								src={sourceAsset.url}
								alt="Original upload"
								class="max-h-[240px] max-w-full rounded-xl object-contain shadow-sm"
							/>
						{:else}
							<p class="ui-body-sm text-center">{t.originalEmpty}</p>
						{/if}
					</div>
				</div>

				<div class="rounded-[1.5rem] border border-[var(--ui-border-subtle)] bg-white/80 p-4 shadow-sm dark:bg-slate-950/40">
					<div class="mb-3 flex items-center justify-between gap-2">
						<h3 class="text-[0.72rem] font-black uppercase tracking-[0.2em] text-primary">{t.compressedTitle}</h3>
						{#if compressedAsset}
							<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
								{formatBytes(compressedAsset.size)}
							</span>
						{/if}
					</div>

					<div class="flex min-h-[260px] items-center justify-center overflow-hidden rounded-[1.25rem] bg-slate-100/90 p-3 dark:bg-slate-900/70">
						{#if isProcessing}
							<div class="flex flex-col items-center gap-3 text-primary">
								<span class="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
								<p class="ui-body-sm text-center">{t.processingBody}</p>
							</div>
						{:else if compressedAsset}
							<img
								src={compressedAsset.url}
								alt="Compressed output"
								class="max-h-[240px] max-w-full rounded-xl object-contain shadow-sm"
							/>
						{:else}
							<p class="ui-body-sm text-center">{t.compressedEmpty}</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="rounded-[1.5rem] border border-[var(--ui-border-subtle)] bg-white/80 p-4 shadow-sm dark:bg-slate-950/40">
				<h3 class="mb-4 text-[0.72rem] font-black uppercase tracking-[0.2em] text-primary">{t.detailsTitle}</h3>

				<div class="grid gap-3">
					<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
						<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.originalSizeLabel}</p>
						<p class="mt-1 text-base font-black text-slate-900 dark:text-white">
							{sourceAsset ? formatBytes(sourceAsset.size) : '--'}
						</p>
					</div>
					<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
						<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.compressedSizeLabel}</p>
						<p class="mt-1 text-base font-black text-slate-900 dark:text-white">
							{compressedAsset ? formatBytes(compressedAsset.size) : '--'}
						</p>
					</div>
					<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
						<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.savedLabel}</p>
						<p class="mt-1 text-base font-black text-slate-900 dark:text-white">
							{compressedAsset && sourceAsset ? `${formatBytes(savedBytes)} (${savedPercent}%)` : '--'}
						</p>
					</div>
					<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
						<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.dimensionsLabel}</p>
						<p class="mt-1 text-sm font-bold text-slate-900 dark:text-white">
							{compressedAsset ? `${compressedAsset.width} × ${compressedAsset.height}` : '--'}
						</p>
					</div>
					<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
						<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.formatLabel}</p>
						<p class="mt-1 text-sm font-bold text-slate-900 dark:text-white">
							{compressedAsset ? getMimeLabel(compressedAsset.mime) : '--'}
						</p>
					</div>
					<div class="rounded-[1rem] bg-slate-100/80 px-3.5 py-3 dark:bg-slate-900/70">
						<p class="text-[0.64rem] font-bold uppercase tracking-[0.18em] text-slate-400">{t.qualityScaleLabel}</p>
						<p class="mt-1 text-sm font-bold text-slate-900 dark:text-white">
							{compressedAsset
								? `${formatQuality(compressedAsset.quality)} / ${formatScale(compressedAsset.scale)}`
								: '--'}
						</p>
					</div>
				</div>

				<p class="ui-body-sm mt-4">{@html t.note}</p>
			</div>
		</div>
	</div>
</div>
