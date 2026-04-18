<script lang="ts">
	import { musicStore } from '$lib/stores/music.svelte';
	import { fade, scale } from 'svelte/transition';
	import { page } from '$app/state';

	let isExpanded = $state(false);

	// Hidden Audio Element binding
	let audio: HTMLAudioElement;

	// Note: We use an effect to sync the Svelte store with the audio element
	// because direct bindings to a store's proxy sometimes require explicit syncing
	// for play/pause DOM methods.
	$effect(() => {
		if (audio) {
			if (musicStore.isPlaying) {
				audio.play().catch(() => {});
			} else {
				audio.pause();
			}
		}
	});

	// If src changes while playing, auto-play after change
	$effect(() => {
		const src = musicStore.currentTrack.src;
		if (audio && musicStore.isPlaying) {
			setTimeout(() => {
				audio?.play().catch(() => {});
			}, 50);
		}
	});

	// Connect volume
	$effect(() => {
		if (audio) {
			audio.volume = musicStore.volume;
		}
	});

	// Hide the FAB completely if we are physically ON the /tools/music page
	// to avoid confusing duplicate UI.
	let isMusicRoute = $derived(page.url.pathname.includes('/tools/music'));

	// Always show FAB if not on music route, allowing discovery globally
	let showFab = $derived(!isMusicRoute);
	
	const changeVolume = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const vol = Number(target.value);
		if (audio) {
			audio.volume = vol;
			musicStore.volume = vol;
		}
	};
</script>

<audio
	bind:this={audio}
	src={musicStore.currentTrack.src}
	preload="metadata"
	bind:paused={musicStore.paused}
	bind:currentTime={musicStore.currentTime}
	bind:duration={musicStore.duration}
	onended={() => musicStore.nextTrack()}
></audio>

{#if showFab}
	<div 
		class="fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
		role="region"
		onmouseenter={() => isExpanded = true}
		onmouseleave={() => isExpanded = false}
		in:scale={{ duration: 400, start: 0.8 }}
		out:scale={{ duration: 300, start: 0.8 }}
	>
		<!-- Expandable Capsule -->
		<div class="relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 will-change-[width,height,border-radius] {isExpanded ? 'w-80 rounded-[2rem] p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-primary/20 dark:border-white/10' : 'w-[4.5rem] rounded-full p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-primary/10 dark:border-white/5'}">
			
			<div class="flex items-center w-full gap-4">
				
				<!-- Cover Art (Always visible, acts as the compact button too) -->
				<button 
					class="relative shrink-0 overflow-hidden transform transition-all duration-500 {isExpanded ? 'size-14 rounded-2xl hover:scale-105 active:scale-95' : 'size-14 rounded-full hover:scale-105 active:scale-95 ring-2 ring-transparent hover:ring-primary/30'}"
					onclick={() => musicStore.toggle()}
				>
					<img src={musicStore.currentTrack.cover} alt="Cover" class="w-full h-full object-cover {musicStore.isPlaying && !isExpanded ? 'animate-spin-slow' : ''}" style="animation-duration: 8s" />
					<div class="absolute inset-0 bg-black/40 flex items-center justify-center {isExpanded ? 'opacity-0 hover:opacity-100' : (musicStore.isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100')} transition-opacity">
						<span class="material-symbols-outlined text-white text-3xl drop-shadow-md">
							{musicStore.isPlaying ? 'pause' : 'play_arrow'}
						</span>
					</div>
				</button>

				{#if isExpanded}
					<div class="flex-1 min-w-0" in:fade={{ duration: 200, delay: 100 }}>
						<div class="flex justify-between items-start mb-2">
							<div class="truncate w-full pr-2">
								<h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">{musicStore.currentTrack.title}</h4>
								<p class="text-[0.65rem] font-semibold text-slate-500 tracking-wide uppercase truncate">{musicStore.currentTrack.artist}</p>
							</div>
						</div>

						<!-- Mini Controls -->
						<div class="flex items-center justify-between">
							<button class="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors active:scale-90" onclick={() => musicStore.prevTrack()}>
								<span class="material-symbols-outlined text-[1.4rem]">skip_previous</span>
							</button>
							<button class="size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform" onclick={() => musicStore.toggle()}>
								<span class="material-symbols-outlined text-lg">{musicStore.isPlaying ? 'pause' : 'play_arrow'}</span>
							</button>
							<button class="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors active:scale-90" onclick={() => musicStore.nextTrack()}>
								<span class="material-symbols-outlined text-[1.4rem]">skip_next</span>
							</button>
							
							<div class="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity group ml-2">
								<span class="material-symbols-outlined text-base">volume_down</span>
								<div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
									<input 
										type="range" min="0" max="1" step="0.01" value={musicStore.volume} oninput={changeVolume} class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
									<div class="absolute left-0 top-0 bottom-0 bg-primary pointer-events-none group-hover:bg-blue-500" style="width: {musicStore.volume * 100}%"></div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Progress Bar (Only visible heavily when expanded) -->
			{#if isExpanded}
				<div class="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-b-full overflow-hidden" in:fade={{ duration: 200, delay: 150 }}>
					<div class="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300" style="width: {(musicStore.currentTime / (musicStore.duration || 1)) * 100}%"></div>
				</div>
			{/if}

		</div>
	</div>
{/if}

<style>
	.animate-spin-slow {
		animation: spin 8s linear infinite;
	}
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
