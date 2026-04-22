<script lang="ts">
	import { onMount, tick } from 'svelte';
	// We will load fabric via CDN to avoid Node environment/install issues

	let canvasElement: HTMLCanvasElement | undefined = $state();
	let fabricCanvas: any = null;
	let uploader: HTMLInputElement | undefined = $state();

	let isFabricLoaded = $state(false);
	let currentMode = $state('select'); // 'select', 'draw', 'text', 'crop'
	let drawColor = $state('#3b82f6');
	let strokeWidth = $state(5);
	
	type HistoryState = { w: number; h: number; json: string };
	let history = $state<HistoryState[]>([]);
	let historyIndex = $state(-1);
	let isHistoryUpdating = false;
	let cropRect: any = null;
	
	onMount(() => {
		// Load Fabric JS dynamically
		if (!(window as any).fabric) {
			const script = document.createElement('script');
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
			script.onload = async () => {
				isFabricLoaded = true;
				await tick();
				initCanvas();
			};
			document.head.appendChild(script);
		} else {
			isFabricLoaded = true;
			tick().then(() => initCanvas());
		}

		return () => {
			if(fabricCanvas) fabricCanvas.dispose();
		};
	});

	function initCanvas() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		fabricCanvas = new window.fabric.Canvas(canvasElement, {
			width: 800,
			height: 500,
			backgroundColor: 'rgba(0,0,0,0)' // Transparent bg
		});

		fabricCanvas.on('object:modified', saveHistory);
		fabricCanvas.on('object:added', saveHistory);
		fabricCanvas.on('object:removed', saveHistory);

		setMode('select');
		saveHistory();
	}

	function saveHistory() {
		if (isHistoryUpdating || !fabricCanvas) return;
		
		isHistoryUpdating = true;
		let hasCropRect = false;
		if (cropRect && fabricCanvas.contains(cropRect)) {
			fabricCanvas.remove(cropRect);
			hasCropRect = true;
		}

		const state = {
			w: fabricCanvas.getWidth(),
			h: fabricCanvas.getHeight(),
			json: JSON.stringify(fabricCanvas.toJSON())
		};
		
		if (historyIndex < history.length - 1) {
			history.splice(historyIndex + 1);
		}
		history.push(state);
		historyIndex++;

		if (hasCropRect) {
			fabricCanvas.add(cropRect);
			fabricCanvas.setActiveObject(cropRect);
		}
		history = [...history]; // trigger reactivity
		isHistoryUpdating = false;
	}

	function loadHistoryState(idx: number) {
		isHistoryUpdating = true;
		const state = history[idx];
		fabricCanvas.setWidth(state.w);
		fabricCanvas.setHeight(state.h);
		fabricCanvas.loadFromJSON(state.json, () => {
			fabricCanvas.renderAll();
			isHistoryUpdating = false;
		});
	}

	function undo() {
		if (historyIndex > 0) {
			historyIndex--;
			loadHistoryState(historyIndex);
		}
	}

	function redo() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			loadHistoryState(historyIndex);
		}
	}

	function confirmCrop() {
		if (currentMode !== 'crop' || !cropRect) return;
		
		const bound = cropRect.getBoundingRect();
		
		isHistoryUpdating = true;
		fabricCanvas.remove(cropRect);
		
		const dataURL = fabricCanvas.toDataURL({
			left: bound.left,
			top: bound.top,
			width: bound.width,
			height: bound.height,
		});

		fabricCanvas.clear();
		fabricCanvas.setWidth(bound.width);
		fabricCanvas.setHeight(bound.height);
		
		// @ts-ignore
		window.fabric.Image.fromURL(dataURL, (img: any) => {
			fabricCanvas.add(img);
			isHistoryUpdating = false;
			saveHistory();
			setMode('select');
		});
	}

	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const reader = new FileReader();
			reader.onload = (f) => {
				const data = f.target?.result as string;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				window.fabric.Image.fromURL(data, (img: any) => {
					// Scale image down if it's too big
					if (img.width > 800 || img.height > 500) {
						img.scaleToWidth(700);
					}
					fabricCanvas.centerObject(img);
					fabricCanvas.add(img);
					fabricCanvas.setActiveObject(img);
				});
			};
			reader.readAsDataURL(target.files[0]);
		}
	}

	function setMode(mode: string) {
		currentMode = mode;
		if (!fabricCanvas) return;

		fabricCanvas.isDrawingMode = (mode === 'draw');
		fabricCanvas.selection = (mode === 'select' || mode === 'text');
		
		if (mode === 'draw') {
			fabricCanvas.freeDrawingBrush.color = drawColor;
			fabricCanvas.freeDrawingBrush.width = strokeWidth;
		}

		if (mode === 'crop') {
			if (!cropRect) {
				// @ts-ignore
				cropRect = new window.fabric.Rect({
					fill: 'rgba(0,0,0,0.3)',
					stroke: '#3b82f6',
					strokeWidth: 2,
					strokeDashArray: [5, 5],
					width: 300,
					height: 300,
					cornerColor: '#3b82f6',
					cornerStrokeColor: '#fff',
					transparentCorners: false,
					cornerSize: 12,
					lockRotation: true,
					lockSkewingX: true,
					lockSkewingY: true
				});
			}
			isHistoryUpdating = true;
			if (!fabricCanvas.contains(cropRect)) {
				fabricCanvas.add(cropRect);
			}
			fabricCanvas.centerObject(cropRect);
			fabricCanvas.setActiveObject(cropRect);
			isHistoryUpdating = false;
		} else {
			if (cropRect && fabricCanvas.contains(cropRect)) {
				isHistoryUpdating = true;
				fabricCanvas.remove(cropRect);
				isHistoryUpdating = false;
			}
		}
	}

	function addText() {
		setMode('text');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const text = new window.fabric.IText('Nhập văn bản...', {
			left: 100,
			top: 100,
			fontFamily: 'Inter',
			fill: drawColor,
			fontSize: 40
		});
		fabricCanvas.add(text);
		fabricCanvas.setActiveObject(text);
	}

	function removeSelected() {
		if(!fabricCanvas) return;
		const activeObjects = fabricCanvas.getActiveObjects();
		if (activeObjects.length) {
			fabricCanvas.discardActiveObject();
			activeObjects.forEach(function(object: any) {
				fabricCanvas.remove(object);
			});
		}
	}

	function downloadImage() {
		if(!fabricCanvas) return;
		const dataURL = fabricCanvas.toDataURL({
			format: 'png',
			quality: 1
		});
		const link = document.createElement('a');
		link.download = 'edited-image.png';
		link.href = dataURL;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	$effect(() => {
		if (fabricCanvas && currentMode === 'draw') {
			fabricCanvas.freeDrawingBrush.color = drawColor;
			fabricCanvas.freeDrawingBrush.width = parseInt(strokeWidth.toString());
		}
	});

</script>

<div class="glass-panel w-full overflow-hidden rounded-[2.5rem] shadow-2xl p-1 relative">
	<div class="bg-surface/80 relative z-10 w-full rounded-[2.4rem] backdrop-blur-3xl p-6 sm:p-8 flex flex-col items-center">
		
		{#if !isFabricLoaded}
			<div class="flex items-center justify-center p-20">
				<span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
			</div>
		{:else}
			<!-- Toolbar -->
			<div class="w-full max-w-[800px] flex flex-wrap items-center justify-between gap-4 mb-6 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-primary/10">
				
				<div class="flex items-center gap-2">
					<input 
						type="file" 
						accept="image/*" 
						class="hidden" 
						bind:this={uploader}
						onchange={handleImageUpload}
					/>
					<button onclick={() => uploader?.click()} class="ui-btn ui-btn-primary !h-10 !px-4 !text-xs gap-2">
						<span class="material-symbols-outlined text-sm">upload</span> 
						<span class="hidden sm:inline">Tải ảnh lên</span>
					</button>

					<div class="flex items-center gap-1 mx-2">
						<button class="ui-icon-btn {historyIndex > 0 ? 'text-primary hover:bg-primary/10' : 'text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'}" onclick={undo} disabled={historyIndex <= 0} title="Quay lại (Undo)">
							<span class="material-symbols-outlined text-sm">undo</span>
						</button>
						<button class="ui-icon-btn {historyIndex < history.length - 1 ? 'text-primary hover:bg-primary/10' : 'text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed'}" onclick={redo} disabled={historyIndex >= history.length - 1} title="Làm lại (Redo)">
							<span class="material-symbols-outlined text-sm">redo</span>
						</button>
					</div>

					<div class="w-px h-6 bg-border mx-2"></div>

					<button class={`ui-icon-btn ${currentMode === 'select' ? 'ring-2 ring-primary text-primary bg-primary/10' : ''}`} onclick={() => setMode('select')} aria-label="Select Tool" title="Di chuyển">
						<span class="material-symbols-outlined text-sm">pan_tool_alt</span>
					</button>
					<button class={`ui-icon-btn ${currentMode === 'draw' ? 'ring-2 ring-primary text-primary bg-primary/10' : ''}`} onclick={() => setMode('draw')} aria-label="Draw Tool" title="Vẽ">
						<span class="material-symbols-outlined text-sm">brush</span>
					</button>
					<button class={`ui-icon-btn ${currentMode === 'text' ? 'ring-2 ring-primary text-primary bg-primary/10' : ''}`} onclick={addText} aria-label="Text Tool" title="Thêm chữ">
						<span class="material-symbols-outlined text-sm">match_case</span>
					</button>
					<button class={`ui-icon-btn ${currentMode === 'crop' ? 'ring-2 ring-primary text-primary bg-primary/10' : ''}`} onclick={() => setMode('crop')} aria-label="Crop Tool" title="Cắt ảnh">
						<span class="material-symbols-outlined text-sm">crop</span>
					</button>
					
					<button class="ui-icon-btn text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" onclick={removeSelected} aria-label="Remove Selected" title="Xóa phần chọn">
						<span class="material-symbols-outlined text-sm">delete</span>
					</button>
				</div>

				<div class="flex items-center gap-4">
					{#if currentMode === 'draw'}
					<div class="flex items-center gap-2">
						<span class="material-symbols-outlined text-xs">line_weight</span>
						<input type="range" min="1" max="50" bind:value={strokeWidth} class="w-20" />
					</div>
					<div class="flex items-center gap-2">
						<span class="material-symbols-outlined text-xs">palette</span>
						<input type="color" bind:value={drawColor} class="w-8 h-8 rounded shrink-0 cursor-pointer p-0 border-0 outline-none" />
					</div>
					{:else if currentMode === 'crop'}
					<div class="flex items-center gap-2">
						<button class="ui-btn bg-indigo-500 hover:bg-indigo-600 text-white !h-8 !px-3 !text-xs font-bold gap-1 transition-all" onclick={confirmCrop}>
							<span class="material-symbols-outlined text-xs">check</span>
							Áp dụng Cắt
						</button>
						<button class="ui-btn bg-transparent border border-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 !h-8 !px-3 !text-xs gap-1 transition-all" onclick={() => setMode('select')}>
							Hủy
						</button>
					</div>
					{/if}

					<div class="w-px h-6 bg-border mx-2"></div>
					
					<button onclick={downloadImage} class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-10 !px-4 !text-xs gap-2 hover:bg-primary hover:text-white transition-colors">
						<span class="material-symbols-outlined text-sm">download</span>
						<span class="hidden sm:inline">Xuất ảnh</span>
					</button>
				</div>
			</div>

			<!-- Canvas Editor -->
			<div class="rounded-2xl overflow-hidden shadow-2xl border border-primary/10 dark:border-white/10 ring-4 ring-black/5 dark:ring-white/5 relative bg-checkerboard">
				<canvas bind:this={canvasElement}></canvas>
			</div>
			
			<p class="text-[0.65rem] font-bold text-primary mt-6 tracking-widest uppercase opacity-70">
				Mẹo: Bạn có thể click chọn đối tượng (Text/Ảnh) để di chuyển, xoay hoặc xóa bỏ.
			</p>
		{/if}

	</div>
</div>

<style>
	/* Checkerboard background for transparent canvas visual */
	.bg-checkerboard {
		background-image: 
			linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%), 
			linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}
	:global(.dark) .bg-checkerboard {
		background-image: 
			linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), 
			linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
			linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%);
	}
</style>
