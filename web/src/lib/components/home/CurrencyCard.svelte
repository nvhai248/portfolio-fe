<script lang="ts">
	import { depthMotion } from '$lib/actions/depth-motion';
	let { code, name, value, symbol }: { code: string; name: string; value: string; symbol: string } = $props();
</script>

<div class="currency-depth" use:depthMotion>
	<article class="currency-card bg-white dark:bg-slate-900">
		<div class="currency-coin" aria-hidden="true"><span>{symbol}</span></div>
		<div class="currency-copy">
			<h4 class="text-base font-semibold [color:var(--ui-text)]">{code}</h4>
			<p class="mt-1 text-xs leading-relaxed [color:var(--ui-text-muted)]">{name}</p>
			<p class="mt-5 text-2xl font-semibold tabular-nums tracking-tight [color:var(--ui-text)]">{value}</p>
		</div>
	</article>
</div>

<style>
	.currency-depth { perspective: 800px; padding: 10px 5px 14px; }
	.currency-card { position: relative; min-height: 220px; padding: 24px; border: 1px solid var(--ui-border); border-radius: 20px; transform-style: preserve-3d; transform: rotateX(var(--depth-y, 0deg)) rotateY(var(--depth-x, 0deg)); transition: transform 600ms cubic-bezier(.2,.8,.2,1); box-shadow: 0 6px 0 color-mix(in srgb, var(--ui-border) 80%, transparent), 0 18px 30px #20364c12; }
	.currency-copy { position: relative; transform: translateZ(18px); }
	.currency-coin { position: relative; margin-bottom: 22px; width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg,#f2f8fd,#9db9ce 65%,#627e95); border: 3px solid #bdd0df; box-shadow: 3px 3px 0 #658096, 6px 7px 12px #20364c25; transform: translateZ(32px) rotateY(-20deg); display: grid; place-items: center; }
	.currency-coin span { color: #294b64; font-size: 24px; font-weight: 700; text-shadow: 1px 1px #f0f7fc; }
	@media (prefers-reduced-motion: reduce) { .currency-card { transform: none; transition: none; } }
	@media print { .currency-card { transform: none; box-shadow: none; } }
</style>
