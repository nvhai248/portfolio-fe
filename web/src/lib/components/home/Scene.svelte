<script lang="ts">
	import { Canvas } from '@threlte/core';
	import NetworkGraph from './NetworkGraph.svelte';

	interface Props {
		isDark: boolean;
		isMobile?: boolean;
		isTablet?: boolean;
		pointer?: { x: number; y: number };
		scrollProgress?: number;
	}

	let {
		isDark,
		isMobile = false,
		isTablet = false,
		pointer = { x: 0, y: 0 },
		scrollProgress = 0
	}: Props = $props();
</script>

<div class="h-full w-full">
	<Canvas dpr={isMobile ? 1 : 1.5}>
		<NetworkGraph {isDark} {isMobile} {isTablet} {pointer} {scrollProgress} />
	</Canvas>
</div>
