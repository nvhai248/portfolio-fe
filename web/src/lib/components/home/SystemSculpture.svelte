<script lang="ts">
	import type { Locale } from '$lib/i18n/config';
	import { depthMotion } from '$lib/actions/depth-motion';
	let { locale }: { locale: Locale } = $props();
</script>

<figure class="sculpture" use:depthMotion aria-label={locale === 'vi' ? 'Minh họa 3D các lớp dịch vụ backend kết nối với nhau' : '3D illustration of connected backend service layers'}>
	<div class="sculpture-shadow" aria-hidden="true"></div>
	<div class="sculpture-world" aria-hidden="true">
		<div class="orbit"></div>
		{#each [0, 1, 2] as layer (layer)}
			<div class="server-layer" style={`--layer:${layer}`}>
				<div class="face front"><span class="vents"></span><span class="status-light"></span></div>
				<div class="face back"></div><div class="face right"></div><div class="face left"></div>
				<div class="face top"><span class="chip">{layer === 0 ? '{ }' : layer === 1 ? '≋' : '✦'}</span></div>
				<div class="face bottom"></div>
			</div>
		{/each}
		<div class="satellite satellite-one"></div><div class="satellite satellite-two"></div>
	</div>
	<figcaption class="sculpture-caption"><span>Backend</span><span>{locale === 'vi' ? 'Hạ tầng' : 'Infrastructure'}</span><span>AI</span></figcaption>
</figure>

<style>
	.sculpture { position: relative; width: 100%; aspect-ratio: 1; margin: 0; perspective: 1000px; isolation: isolate; }
	.sculpture-world { position: absolute; inset: 0; transform-style: preserve-3d; transform: translateY(var(--depth-lift, 0px)) rotateX(calc(-20deg + var(--depth-y, 0deg))) rotateY(calc(-32deg + var(--depth-x, 0deg) + var(--depth-scroll, 0deg))); transition: transform 700ms cubic-bezier(.2,.8,.2,1); }
	.server-layer { --size: 210px; --height: 64px; position: absolute; width: var(--size); height: var(--height); left: calc(50% - 105px); top: calc(50% - 55px); transform-style: preserve-3d; transform: translateY(calc((var(--layer) - 1) * 100px)); }
	.face { position: absolute; border: 1px solid #8299b2; backface-visibility: hidden; }
	.front, .back { width: var(--size); height: var(--height); background: linear-gradient(110deg,#a9bccc,#eef3f8 35%,#bbcbd9); }
	.front { transform: translateZ(105px); display: flex; align-items: center; justify-content: space-between; padding: 18px; }
	.back { transform: rotateY(180deg) translateZ(105px); }
	.right, .left { width: var(--size); height: var(--height); background: linear-gradient(100deg,#4d6380,#96aec3); }
	.right { transform: rotateY(90deg) translateZ(105px); }
	.left { transform: rotateY(-90deg) translateZ(105px); }
	.top, .bottom { width: var(--size); height: var(--size); top: -73px; background: linear-gradient(145deg,#f3f7fb,#cbd9e6 55%,#9caec2); }
	.top { transform: rotateX(90deg) translateZ(32px); display: grid; place-items: center; }
	.bottom { transform: rotateX(-90deg) translateZ(32px); background: #536d88; }
	.chip { display: grid; place-items: center; width: 95px; height: 95px; border: 8px solid #7992ac; border-radius: 12px; background: linear-gradient(135deg,#294866,#10283f); color: #b9ddff; font-size: 40px; font-weight: 600; box-shadow: 8px 8px 0 #8ba3b9; }
	.vents { height: 18px; width: 98px; background: repeating-linear-gradient(90deg,#425a70 0 3px,transparent 3px 9px); }
	.status-light { width: 8px; height: 8px; border-radius: 50%; background: #137b85; box-shadow: 0 0 0 4px #b4d8d9; }
	.orbit { position: absolute; left: 50%; top: 50%; width: 380px; height: 380px; margin: -190px; border: 14px solid #698aac; border-radius: 50%; transform: rotateX(72deg) rotateY(15deg); box-shadow: inset 3px 3px 4px #d5e9fc, 3px 4px 0 #304d6b; }
	.satellite { position: absolute; width: 68px; height: 68px; border-radius: 50%; background: radial-gradient(circle at 28% 25%,#edf8ff,#97b8d3 30%,#365977 70%,#183149); box-shadow: 12px 18px 24px #20395225; }
	.satellite-one { top: 15%; right: 8%; transform: translateZ(90px); }
	.satellite-two { bottom: 17%; left: 6%; width: 40px; height: 40px; transform: translateZ(110px); }
	.sculpture-shadow { position: absolute; bottom: 15%; left: 18%; width: 65%; height: 12%; background: #25456624; border-radius: 50%; filter: blur(22px); }
	.sculpture-caption { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; gap: 1.5rem; font-size: .8rem; color: var(--ui-text-muted); }
	@media (max-width: 640px) { .server-layer { --size: 160px; left: calc(50% - 80px); } .front { transform: translateZ(80px); } .back { transform: rotateY(180deg) translateZ(80px); } .right { transform: rotateY(90deg) translateZ(80px); } .left { transform: rotateY(-90deg) translateZ(80px); } .top,.bottom { top: -48px; } .orbit { width: 290px; height: 290px; margin: -145px; border-width: 10px; } .chip { width: 75px; height: 75px; font-size: 30px; } }
	@media (prefers-reduced-motion: reduce) { .sculpture-world { transform: rotateX(-20deg) rotateY(-32deg); transition: none; } }
	@media print { .sculpture { display: none; } }
</style>
