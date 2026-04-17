<script lang="ts">
	import { onMount, unmount } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';

	let canvas: HTMLCanvasElement;
	let mouseX = $state(-1000);
	let mouseY = $state(-1000);

	const GRID_SIZE = 40;
	const PARTICLE_COUNT = 40;

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		alpha: number;
		baseAlpha: number;
	}

	let particles: Particle[] = [];

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let width = 0;
		let height = 0;
		let dpr = 1;

		const resize = () => {
			dpr = window.devicePixelRatio || 1;
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			ctx.scale(dpr, dpr);
		};

		window.addEventListener('resize', resize);
		resize();

		// Initialize particles
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 2 + 1,
				baseAlpha: Math.random() * 0.4 + 0.1,
				alpha: 0
			});
		}

		let animationFrame: number;
		const render = () => {
			ctx.clearRect(0, 0, width, height);

			const isDark = theme.current === 'dark';
			// Sync with CSS variables from app.css
			const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)';
			const highlightColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(11, 99, 184, 0.1)';
			const particleColor = isDark ? '255, 255, 255' : '11, 99, 184';

			// Draw Grid
			ctx.beginPath();
			ctx.strokeStyle = gridLineColor;
			ctx.lineWidth = 1;

			// Verticals
			for (let x = 0; x <= width; x += GRID_SIZE) {
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
			}
			// Horizontals
			for (let y = 0; y <= height; y += GRID_SIZE) {
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
			}
			ctx.stroke();

			// Grid Highlight (Radial Gradient)
			if (mouseX > -100) {
				const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 400);
				gradient.addColorStop(0, highlightColor);
				gradient.addColorStop(1, 'rgba(0,0,0,0)');
				
				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, width, height);
			}

			// Antigravity Particles
			particles.forEach((p) => {
				// Movements
				p.x += p.vx;
				p.y += p.vy;

				// Friction/Damping
				p.vx *= 0.98;
				p.vy *= 0.98;

				// Return to drift
				p.vx += (Math.random() - 0.5) * 0.01;
				p.vy += (Math.random() - 0.5) * 0.01;

				// Wrap around edges
				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;

				// Interaction with mouse
				const dx = p.x - mouseX;
				const dy = p.y - mouseY;
				const distSq = dx * dx + dy * dy;
				const radius = 250;
				
				if (distSq < radius * radius) {
					const dist = Math.sqrt(distSq);
					const force = (radius - dist) / radius;
					// "Antigravity" push
					p.vx += (dx / dist) * force * 0.4;
					p.vy += (dy / dist) * force * 0.4;
					p.alpha = Math.min(1, p.baseAlpha + force * 0.5);
				} else {
					p.alpha += (p.baseAlpha - p.alpha) * 0.05;
				}

				// Draw particle
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
				ctx.fill();
			});

			animationFrame = requestAnimationFrame(render);
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);
		render();

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationFrame);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: -1;
		background-color: transparent;
		display: block;
	}
</style>
