<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { musicStore } from '$lib/stores/music.svelte';

	const formatTime = (timeInSeconds: number) => {
		if (isNaN(timeInSeconds)) return '0:00';
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const seek = (e: Event) => {
		const target = e.target as HTMLInputElement;
		musicStore.currentTime = Number(target.value);
	};

	const changeVolume = (e: Event) => {
		const target = e.target as HTMLInputElement;
		musicStore.volume = Number(target.value);
	};
</script>

<div class="glass-panel relative w-full overflow-hidden rounded-[2.5rem] shadow-3xl p-0.5 border-primary/5">
	<!-- Dynamic Background Blur -->
	<div class="absolute inset-0 z-0">
		{#key musicStore.currentTrack.cover}
			<div 
				class="absolute inset-0 bg-cover bg-center opacity-30 blur-[100px] transition-all duration-1000 scale-110"
				style="background-image: url({musicStore.currentTrack.cover})"
				in:fade={{ duration: 1000 }}
			></div>
		{/key}
		<div class="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-3xl"></div>
	</div>

	<div class="relative z-10 flex h-full flex-col lg:flex-row">
		
		<!-- Left: Main Player -->
		<div class="flex flex-1 flex-col items-center justify-center p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-primary/5">

			<!-- Cover Art -->
			<div class="relative mb-10 w-full max-w-[320px] lg:max-w-[380px] aspect-square">
				{#key musicStore.currentTrack.cover}
					<div 
						class="h-full w-full rounded-3xl shadow-2xl shadow-primary/30 ring-1 ring-white/20 overflow-hidden"
						in:fly={{ y: 20, duration: 800, easing: quintOut }}
					>
						<img 
							src={musicStore.currentTrack.cover} 
							alt={musicStore.currentTrack.title} 
							class="h-full w-full object-cover transition-transform duration-[3000ms] {musicStore.isPlaying ? 'scale-110' : 'scale-100'}"
						/>
					</div>
				{/key}
			</div>

			<!-- Interaction -->
			<div class="w-full max-w-[420px]">
				<!-- Track Info -->
				<div class="mb-8 text-center lg:text-left">
					<h2 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm sm:text-4xl">{musicStore.currentTrack.title}</h2>
					<p class="mt-2 text-lg font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300 drop-shadow-sm">{musicStore.currentTrack.artist}</p>
				</div>

				<!-- Progress Bar -->
				<div class="mb-8 space-y-4">
					<div class="group relative h-1.5 w-full rounded-full bg-slate-300/50 dark:bg-slate-600/50">
						<input 
							type="range" 
							min="0" 
							max={musicStore.duration || 100} 
							value={musicStore.currentTime} 
							oninput={seek}
							class="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-primary outline-none z-10 opacity-0"
						/>
						<div 
							class="absolute left-0 top-0 bottom-0 pointer-events-none rounded-full bg-primary dark:bg-blue-500 shadow-[0_0_10px_rgba(30,64,175,0.3)] transition-all"
							style="width: {(musicStore.currentTime / (musicStore.duration || 1)) * 100}%"
						></div>
						<!-- Fake thumb for aesthetic -->
						<div 
							class="absolute top-1/2 -mt-2 size-4 bg-primary dark:bg-blue-400 border-2 border-white rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
							style="left: calc({(musicStore.currentTime / (musicStore.duration || 1)) * 100}% - 8px)"
						></div>
					</div>
					<div class="flex justify-between font-mono text-[0.7rem] font-bold text-slate-700 dark:text-slate-200 drop-shadow-sm">
						<span>{formatTime(musicStore.currentTime)}</span>
						<span>-{formatTime(musicStore.duration - musicStore.currentTime)}</span>
					</div>
				</div>

				<!-- Controls -->
				<div class="mb-10 flex items-center justify-center gap-8 lg:justify-start">
					<button class="ui-icon-btn size-12 rounded-full border-none bg-transparent transition-transform hover:scale-110 active:scale-95 text-slate-800 dark:text-white hover:text-primary dark:hover:text-blue-400" onclick={() => musicStore.prevTrack()}>
						<span class="material-symbols-outlined text-3xl drop-shadow-md">skip_previous</span>
					</button>

					<button 
						class="flex size-20 items-center justify-center rounded-full bg-primary dark:bg-blue-600 text-white shadow-2xl shadow-primary/40 dark:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 border border-white/10" 
						onclick={() => musicStore.toggle()}
					>
						<span class="material-symbols-outlined text-5xl drop-shadow-md">
							{musicStore.isPlaying ? 'pause' : 'play_arrow'}
						</span>
					</button>

					<button class="ui-icon-btn size-12 rounded-full border-none bg-transparent transition-transform hover:scale-110 active:scale-95 text-slate-800 dark:text-white hover:text-primary dark:hover:text-blue-400" onclick={() => musicStore.nextTrack()}>
						<span class="material-symbols-outlined text-3xl drop-shadow-md">skip_next</span>
					</button>
				</div>

				<!-- Volume -->
				<div class="flex items-center gap-4 px-2 opacity-80 transition-opacity hover:opacity-100 group text-slate-800 dark:text-white">
					<span class="material-symbols-outlined text-xl drop-shadow-sm">volume_down</span>
					<div class="relative h-1.5 w-full rounded-full bg-slate-300/50 dark:bg-slate-600/50 overflow-hidden">
						<input 
							type="range" 
							min="0" 
							max="1" 
							step="0.01" 
							value={musicStore.volume} 
							oninput={changeVolume}
							class="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-primary opacity-0 z-10"
						/>
						<div 
							class="pointer-events-none h-full bg-primary dark:bg-blue-500 absolute left-0 top-0 bottom-0 group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
							style="width: {musicStore.volume * 100}%"
						></div>
					</div>
					<span class="material-symbols-outlined text-xl drop-shadow-sm">volume_up</span>
				</div>
			</div>
		</div>

		<!-- Right: Queue / Playlist -->
		<div class="flex h-[400px] w-full flex-col lg:h-[700px] lg:w-[400px]">
			<div class="flex items-center justify-between border-b border-primary/5 p-6 lg:p-8">
				<h3 class="text-xs font-black uppercase tracking-[0.2em] text-[var(--ui-text-subtle)]">Đang chờ (Queue)</h3>
				<span class="text-[0.65rem] font-bold text-primary dark:text-blue-400">{musicStore.playlist.length} bài hát</span>
			</div>
			
			<div class="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
				{#each musicStore.playlist as track, i}
					<button 
						class="group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all hover:bg-primary/5 {musicStore.currentTrackIndex === i ? 'bg-primary/10 ring-1 ring-primary/20' : ''}"
						onclick={() => musicStore.jumpToTrack(i)}
					>
						<div class="relative size-14 shrink-0 overflow-hidden rounded-xl">
							<img src={track.cover} alt={track.title} class="h-full w-full object-cover" />
							{#if musicStore.currentTrackIndex === i && musicStore.isPlaying}
								<div class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
									<div class="flex items-end gap-1 h-4">
										<div class="w-1 bg-white animate-waveform-1"></div>
										<div class="w-1 bg-white animate-waveform-2"></div>
										<div class="w-1 bg-white animate-waveform-3"></div>
									</div>
								</div>
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-bold text-[var(--ui-text)]">{track.title}</p>
							<p class="truncate text-[0.7rem] font-semibold text-[var(--ui-text-subtle)]">{track.artist}</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: var(--ui-primary);
		opacity: 0.1;
		border-radius: 9999px;
	}

	@keyframes waveform {
		0%, 100% { height: 4px; }
		50% { height: 16px; }
	}

	.animate-waveform-1 { animation: waveform 0.6s ease-in-out infinite; }
	.animate-waveform-2 { animation: waveform 0.8s ease-in-out infinite 0.1s; }
	.animate-waveform-3 { animation: waveform 0.7s ease-in-out infinite 0.2s; }
</style>
