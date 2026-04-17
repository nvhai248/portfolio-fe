<script lang="ts">
	import { z } from 'zod';
	import { fade } from 'svelte/transition';
	import { getDictionary } from '$lib/i18n/dictionary';
	import type { Locale } from '$lib/i18n/config';
	import { enhance } from '$app/forms';

	interface Props {
		locale: Locale;
	}

	let { locale }: Props = $props();
	const t = $derived(getDictionary(locale).contact.form);

	let isSubmitting = $state(false);
	let isSuccess = $state(false);
	let errorMessage = $state('');

	const contactSchema = z.object({
		name: z.string().min(1),
		email: z.string().email(),
		subject: z.string().min(1),
		message: z.string().min(1)
	});

	let formData = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});

	let errors = $state<Record<string, string>>({});

	function validate() {
		const result = contactSchema.safeParse(formData);
		if (!result.success) {
			errors = {};
			result.error.issues.forEach((issue) => {
				const path = issue.path[0] as string;
				if (path === 'name') errors.name = t.validation.nameRequired;
				if (path === 'email')
					errors.email =
						issue.code === 'invalid_string' ? t.validation.emailInvalid : t.validation.emailRequired;
				if (path === 'subject') errors.subject = t.validation.subjectRequired;
				if (path === 'message') errors.message = t.validation.messageRequired;
			});
			return false;
		}
		errors = {};
		return true;
	}
</script>

<div class="ui-panel relative overflow-hidden p-6 shadow-sm sm:p-10">
	{#if isSuccess}
		<div class="flex flex-col items-center py-10 text-center" in:fade>
			<div
				class="bg-primary/10 text-primary mb-6 flex size-16 items-center justify-center rounded-full"
			>
				<span class="material-symbols-outlined text-3xl">check_circle</span>
			</div>
			<h3 class="ui-heading-3 mb-2">{t.successTitle}</h3>
			<p class="ui-body max-w-sm">{t.successMessage}</p>
			<button
				type="button"
				class="ui-btn ui-btn-secondary mt-8"
				onclick={() => {
					isSuccess = false;
					formData = { name: '', email: '', subject: '', message: '' };
				}}
			>
				Send another message
			</button>
		</div>
	{:else}
		<form
			method="POST"
			action="?/send"
			use:enhance={() => {
				if (!validate()) return;
				isSubmitting = true;
				errorMessage = '';

				return async ({ result }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						isSuccess = true;
					} else {
						errorMessage = t.errorMessage;
					}
				};
			}}
			class="grid gap-6"
		>
			<div class="grid gap-6 sm:grid-cols-2">
				<!-- Name -->
				<div class="space-y-2">
					<label for="name" class="text-sm font-semibold [color:var(--ui-text)]">{t.name}</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={formData.name}
						placeholder="John Doe"
						class="border ui-divider focus:ring-primary/20 bg-[var(--ui-bg)] w-full rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2"
						required
					/>
					{#if errors.name}
						<p class="text-xs font-medium text-red-500">{errors.name}</p>
					{/if}
				</div>

				<!-- Email -->
				<div class="space-y-2">
					<label for="email" class="text-sm font-semibold [color:var(--ui-text)]">{t.email}</label>
					<input
						type="email"
						id="email"
						name="email"
						bind:value={formData.email}
						placeholder="john@example.com"
						class="border ui-divider focus:ring-primary/20 bg-[var(--ui-bg)] w-full rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2"
						required
					/>
					{#if errors.email}
						<p class="text-xs font-medium text-red-500">{errors.email}</p>
					{/if}
				</div>
			</div>

			<!-- Subject -->
			<div class="space-y-2">
				<label for="subject" class="text-sm font-semibold [color:var(--ui-text)]">{t.subject}</label>
				<input
					type="text"
					id="subject"
					name="subject"
					bind:value={formData.subject}
					placeholder="Project Inquiry"
					class="border ui-divider focus:ring-primary/20 bg-[var(--ui-bg)] w-full rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2"
					required
				/>
				{#if errors.subject}
					<p class="text-xs font-medium text-red-500">{errors.subject}</p>
				{/if}
			</div>

			<!-- Message -->
			<div class="space-y-2">
				<label for="message" class="text-sm font-semibold [color:var(--ui-text)]">{t.message}</label>
				<textarea
					id="message"
					name="message"
					bind:value={formData.message}
					rows="5"
					placeholder="Tell me about your project..."
					class="border ui-divider focus:ring-primary/20 bg-[var(--ui-bg)] w-full resize-none rounded-lg px-4 py-2.5 outline-none transition-all focus:ring-2"
					required
				></textarea>
				{#if errors.message}
					<p class="text-xs font-medium text-red-500">{errors.message}</p>
				{/if}
			</div>

			{#if errorMessage}
				<p class="bg-red-50 dark:bg-red-900/10 rounded-md p-3 text-sm font-medium text-red-500">
					{errorMessage}
				</p>
			{/if}

			<button
				type="submit"
				disabled={isSubmitting}
				class="ui-btn ui-btn-primary group h-12 w-full disabled:cursor-not-allowed disabled:opacity-70"
			>
				{#if isSubmitting}
					<span class="material-symbols-outlined mr-2 animate-spin">progress_activity</span>
					{t.sending}
				{:else}
					{t.send}
					<span class="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1"
						>send</span
					>
				{/if}
			</button>
		</form>
	{/if}
</div>
