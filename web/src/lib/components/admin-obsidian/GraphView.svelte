<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { ObsidianGraph, GraphNode, GraphEdge } from '$lib/obsidian/types';

	let {
		graph,
		currentFileId = null,
		onClickNode
	}: {
		graph: ObsidianGraph;
		currentFileId?: string | null;
		onClickNode: (nodeId: string) => void;
	} = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();
	let width = $state(800);
	let height = $state(600);
	let resizeObserver: ResizeObserver | undefined;
	let animFrame: number | undefined;

	// Simulation state — stored outside of d3 for canvas rendering
	type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number };
	type SimEdge = { source: SimNode; target: SimNode; type: GraphEdge['type'] };

	let simNodes: SimNode[] = [];
	let simEdges: SimEdge[] = [];

	// Pan/zoom state
	let offsetX = $state(0);
	let offsetY = $state(0);
	let scale = $state(1);
	let isDragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let dragStartOffsetX = 0;
	let dragStartOffsetY = 0;
	let hoveredNode: SimNode | null = $state(null);

	// d3 simulation reference
	let simulation: ReturnType<typeof import('d3-force').forceSimulation> | undefined;

	const NODE_RADIUS = 6;
	const ACTIVE_RADIUS = 10;
	const HIT_RADIUS = 16;

	const initSimulation = async () => {
		const d3 = await import('d3');

		// Build simulation data
		const nodeMap = new Map<string, SimNode>();
		simNodes = graph.nodes.map((n) => {
			const sn: SimNode = { ...n, x: 0, y: 0, vx: 0, vy: 0 };
			nodeMap.set(n.id, sn);
			return sn;
		});

		simEdges = graph.edges
			.map((e) => {
				const source = nodeMap.get(typeof e.source === 'string' ? e.source : e.source);
				const target = nodeMap.get(typeof e.target === 'string' ? e.target : e.target);
				if (!source || !target) return null;
				return { source, target, type: e.type } as SimEdge;
			})
			.filter((e): e is SimEdge => e !== null);

		// Kill previous simulation
		if (simulation) {
			simulation.stop();
		}

		const linkForce = d3
			.forceLink<SimNode, SimEdge>(simEdges)
			.id((d) => d.id)
			.distance(80);

		simulation = d3
			.forceSimulation<SimNode>(simNodes)
			.force('link', linkForce)
			.force('charge', d3.forceManyBody().strength(-200))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(NODE_RADIUS + 4))
			.alphaDecay(0.02)
			.on('tick', () => draw());

		// Center view
		offsetX = 0;
		offsetY = 0;
		scale = 1;

		draw();
	};

	const draw = () => {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		canvasEl.width = width * dpr;
		canvasEl.height = height * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, width, height);

		ctx.save();
		ctx.translate(offsetX + width / 2, offsetY + height / 2);
		ctx.scale(scale, scale);
		ctx.translate(-width / 2, -height / 2);

		const isDark = document.documentElement.classList.contains('dark');

		// Draw edges
		ctx.lineWidth = 1;
		for (const edge of simEdges) {
			const isHighlighted =
				currentFileId && (edge.source.id === currentFileId || edge.target.id === currentFileId);

			ctx.strokeStyle = isHighlighted
				? isDark ? 'rgba(96, 165, 250, 0.6)' : 'rgba(37, 99, 235, 0.5)'
				: isDark ? 'rgba(100, 116, 139, 0.25)' : 'rgba(148, 163, 184, 0.35)';
			ctx.lineWidth = isHighlighted ? 2 : 1;

			ctx.beginPath();
			ctx.moveTo(edge.source.x, edge.source.y);
			ctx.lineTo(edge.target.x, edge.target.y);
			ctx.stroke();
		}

		// Draw nodes
		for (const node of simNodes) {
			const isActive = node.id === currentFileId;
			const isHovered = hoveredNode?.id === node.id;
			const radius = isActive ? ACTIVE_RADIUS : isHovered ? NODE_RADIUS + 2 : NODE_RADIUS;

			// Determine connection count for sizing
			const connectionCount = simEdges.filter(
				(e) => e.source.id === node.id || e.target.id === node.id
			).length;
			const adjustedRadius = radius + Math.min(connectionCount * 0.5, 4);

			// Node fill
			if (isActive) {
				ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
			} else if (isHovered) {
				ctx.fillStyle = isDark ? '#60a5fa' : '#3b82f6';
			} else if (connectionCount > 0) {
				ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.6)';
			} else {
				ctx.fillStyle = isDark ? 'rgba(100, 116, 139, 0.4)' : 'rgba(148, 163, 184, 0.5)';
			}

			ctx.beginPath();
			ctx.arc(node.x, node.y, adjustedRadius, 0, Math.PI * 2);
			ctx.fill();

			// Node border for active
			if (isActive) {
				ctx.strokeStyle = isDark ? '#93c5fd' : '#1d4ed8';
				ctx.lineWidth = 2;
				ctx.stroke();
			}

			// Label
			if (isActive || isHovered || scale > 0.8) {
				ctx.font = `${isActive || isHovered ? 'bold ' : ''}${Math.max(11, 12 / scale)}px Inter, system-ui, sans-serif`;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'top';
				ctx.fillStyle = isActive
					? isDark ? '#93c5fd' : '#1e40af'
					: isDark ? '#cbd5e1' : '#334155';
				ctx.fillText(node.label, node.x, node.y + adjustedRadius + 4);
			}
		}

		ctx.restore();
	};

	// Hit test: find node under cursor
	const hitTest = (clientX: number, clientY: number): SimNode | null => {
		if (!canvasEl) return null;
		const rect = canvasEl.getBoundingClientRect();
		// Transform screen coordinates to simulation coordinates
		const sx = ((clientX - rect.left - offsetX - width / 2) / scale + width / 2);
		const sy = ((clientY - rect.top - offsetY - height / 2) / scale + height / 2);

		for (let i = simNodes.length - 1; i >= 0; i--) {
			const node = simNodes[i];
			const dx = node.x - sx;
			const dy = node.y - sy;
			if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) {
				return node;
			}
		}
		return null;
	};

	const handleMouseDown = (event: MouseEvent) => {
		isDragging = true;
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		dragStartOffsetX = offsetX;
		dragStartOffsetY = offsetY;
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isDragging) {
			offsetX = dragStartOffsetX + (event.clientX - dragStartX);
			offsetY = dragStartOffsetY + (event.clientY - dragStartY);
			draw();
		} else {
			const hit = hitTest(event.clientX, event.clientY);
			if (hoveredNode !== hit) {
				hoveredNode = hit;
				if (canvasEl) {
					canvasEl.style.cursor = hit ? 'pointer' : 'grab';
				}
				draw();
			}
		}
	};

	const handleMouseUp = (event: MouseEvent) => {
		const wasDrag = Math.abs(event.clientX - dragStartX) > 3 || Math.abs(event.clientY - dragStartY) > 3;
		isDragging = false;

		if (!wasDrag) {
			const hit = hitTest(event.clientX, event.clientY);
			if (hit) {
				onClickNode(hit.id);
			}
		}
	};

	const handleWheel = (event: WheelEvent) => {
		event.preventDefault();
		const factor = event.deltaY > 0 ? 0.92 : 1.08;
		const newScale = Math.min(Math.max(scale * factor, 0.15), 5);
		scale = newScale;
		draw();
	};

	// Center the view
	const handleCenter = () => {
		offsetX = 0;
		offsetY = 0;
		scale = 1;
		if (simulation) {
			simulation.alpha(0.3).restart();
		}
		draw();
	};

	onMount(() => {
		if (containerEl) {
			resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					width = entry.contentRect.width;
					height = entry.contentRect.height;
				}
				draw();
			});
			resizeObserver.observe(containerEl);
		}

		initSimulation();
	});

	// Re-init when graph data changes
	$effect(() => {
		const _trackGraph = graph;
		initSimulation();
	});

	onDestroy(() => {
		if (simulation) simulation.stop();
		if (resizeObserver) resizeObserver.disconnect();
		if (animFrame) cancelAnimationFrame(animFrame);
	});
</script>

<div class="relative flex h-full w-full flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950">
	<!-- Graph Toolbar -->
	<div class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80">
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-[18px] text-primary dark:text-blue-400">hub</span>
			<span class="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
				Graph View
			</span>
			<span class="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
				{graph.nodes.length} notes · {graph.edges.length} links
			</span>
		</div>

		<div class="flex items-center gap-1.5">
			<button
				type="button"
				onclick={handleCenter}
				class="inline-flex h-7 items-center justify-center gap-1 rounded-md border border-neutral-200 px-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
				title="Reset zoom and center"
			>
				<span class="material-symbols-outlined text-[14px]">center_focus_strong</span>
				Center
			</button>
		</div>
	</div>

	<!-- Canvas Container -->
	<div
		bind:this={containerEl}
		class="relative flex-1 overflow-hidden"
	>
		<canvas
			bind:this={canvasEl}
			class="absolute inset-0 h-full w-full"
			style="cursor: grab;"
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			onmouseleave={() => { isDragging = false; hoveredNode = null; draw(); }}
			onwheel={handleWheel}
		></canvas>

		<!-- Legend -->
		<div class="absolute bottom-4 left-4 flex flex-col gap-1 rounded-lg border border-neutral-200 bg-white/90 p-3 text-[11px] text-neutral-600 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400">
			<div class="flex items-center gap-2">
				<span class="inline-block size-3 rounded-full bg-blue-500"></span>
				<span>Current note</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block size-2.5 rounded-full bg-slate-400"></span>
				<span>Linked note</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block size-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
				<span>Orphan note</span>
			</div>
			<div class="mt-1 border-t border-neutral-100 pt-1 dark:border-neutral-800">
				<span class="font-medium">Scroll</span> to zoom · <span class="font-medium">Drag</span> to pan · <span class="font-medium">Click</span> to open
			</div>
		</div>
	</div>
</div>
