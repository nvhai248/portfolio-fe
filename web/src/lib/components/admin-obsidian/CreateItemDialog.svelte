<script lang="ts">
	import { onMount } from 'svelte';

	let {
		isOpen,
		isFolder,
		parentId,
		parentName,
		onSubmit,
		onClose
	}: {
		isOpen: boolean;
		isFolder: boolean;
		parentId: string;
		parentName: string;
		onSubmit: (name: string, isFolder: boolean, parentId: string) => Promise<void>;
		onClose: () => void;
	} = $props();

	let name = $state('');
	let isSubmitting = $state(false);
	let errorMsg = $state('');
	let inputEl: HTMLInputElement | undefined = $state();

	$effect(() => {
		if (isOpen) {
			name = '';
			errorMsg = '';
			isSubmitting = false;
			setTimeout(() => inputEl?.focus(), 50);
		}
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const trimmed = name.trim();

		if (!trimmed) {
			errorMsg = `${isFolder ? 'Folder' : 'File'} name is required.`;
			return;
		}

		if (/[/\\\u0000-\u001f]/.test(trimmed)) {
			errorMsg = 'Name contains invalid characters (e.g. slashes).';
			return;
		}

		try {
			isSubmitting = true;
			errorMsg = '';
			await onSubmit(trimmed, isFolder, parentId);
			onClose();
		} catch (caught) {
			if (caught instanceof Error) {
				errorMsg = caught.message;
			} else {
				errorMsg = 'An error occurred while creating the item.';
			}
		} finally {
			isSubmitting = false;
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="dialog-title"
	>
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-200 dark:bg-neutral-950/80"
			onclick={onClose}
		></div>

		<!-- Modal Card -->
		<div
			class="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-900"
		>
			<div class="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
				<h2 id="dialog-title" class="text-lg font-bold text-neutral-950 dark:text-neutral-50">
					Create new {isFolder ? 'folder' : 'note'}
				</h2>
				<button
					type="button"
					class="flex size-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
					onclick={onClose}
					aria-label="Close dialog"
				>
					<span class="material-symbols-outlined text-[20px]">close</span>
				</button>
			</div>

			<form onsubmit={handleSubmit} class="mt-4 flex flex-col gap-4">
				<div>
					<label for="item-name" class="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
						Name
					</label>
					<div class="mt-1.5 relative flex items-center">
						<span class="material-symbols-outlined absolute left-3 text-[18px] text-neutral-400">
							{isFolder ? 'folder' : 'markdown'}
						</span>
						<input
							bind:this={inputEl}
							bind:value={name}
							id="item-name"
							type="text"
							placeholder={isFolder ? 'e.g. Projects' : 'e.g. Meeting notes'}
							disabled={isSubmitting}
							class="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm font-medium text-neutral-900 placeholder-neutral-400 focus-visible:border-primary focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-600 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500/20"
						/>
					</div>
					<p class="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-500">
						Creating inside: <strong class="font-medium text-neutral-700 dark:text-neutral-300">{parentName}</strong>
					</p>
				</div>

				{#if errorMsg}
					<div class="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-100 dark:border-red-900/50">
						{errorMsg}
					</div>
				{/if}

				<div class="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
					<button
						type="button"
						onclick={onClose}
						disabled={isSubmitting}
						class="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 px-4 text-xs font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-strong disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-blue-600 dark:hover:bg-blue-500"
					>
						{#if isSubmitting}
							<span class="material-symbols-outlined mr-2 animate-spin text-[16px]">progress_activity</span>
							Creating...
						{:else}
							Create {isFolder ? 'folder' : 'note'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
