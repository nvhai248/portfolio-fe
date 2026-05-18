<script lang="ts">
	import { toastStore } from '$lib/stores/toast.svelte';
	import { fly } from 'svelte/transition';

	const iconMap: Record<string, string> = {
		success: 'check_circle',
		error: 'error',
		info: 'info'
	};

	const colorMap: Record<string, string> = {
		success: 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/60 dark:text-emerald-300',
		error: 'border-red-500/30 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-950/60 dark:text-red-300',
		info: 'border-blue-500/30 bg-blue-50 text-blue-800 dark:border-blue-400/20 dark:bg-blue-950/60 dark:text-blue-300'
	};

	const iconColorMap: Record<string, string> = {
		success: 'text-emerald-600 dark:text-emerald-400',
		error: 'text-red-600 dark:text-red-400',
		info: 'text-blue-600 dark:text-blue-400'
	};
</script>

{#if toastStore.items.length > 0}
	<div class="fixed bottom-4 right-4 z-[200] flex flex-col-reverse gap-2 sm:bottom-6 sm:right-6">
		{#each toastStore.items as toast (toast.id)}
			<div
				transition:fly={{ y: 20, duration: 250 }}
				class="flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm {colorMap[toast.type]}"
				role="alert"
			>
				<span class="material-symbols-outlined shrink-0 text-[20px] {iconColorMap[toast.type]}">
					{iconMap[toast.type]}
				</span>
				<p class="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
				<button
					type="button"
					onclick={() => toastStore.dismiss(toast.id)}
					class="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
					aria-label="Dismiss"
				>
					<span class="material-symbols-outlined text-[16px]">close</span>
				</button>
			</div>
		{/each}
	</div>
{/if}
