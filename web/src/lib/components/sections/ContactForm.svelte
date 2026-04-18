<script lang="ts">
	import { z } from 'zod';
	import { fade, fly, scale } from 'svelte/transition';
	import { getDictionary } from '$lib/i18n/dictionary';
	import type { Locale } from '$lib/i18n/config';
	import { enhance } from '$app/forms';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import { backOut, cubicOut } from 'svelte/easing';

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
						(issue as any).code === 'invalid_string' ? t.validation.emailInvalid : t.validation.emailRequired;
				if (path === 'subject') errors.subject = t.validation.subjectRequired;
				if (path === 'message') errors.message = t.validation.messageRequired;
			});
			return false;
		}
		errors = {};
		return true;
	}
</script>

<div class="glass-panel relative overflow-hidden rounded-[2.5rem] p-1 shadow-2xl">
	<div class="bg-surface/40 relative z-10 h-full w-full rounded-[2.4rem] p-6 backdrop-blur-3xl sm:p-10">
		{#if isSuccess}
			<div 
				class="flex flex-col items-center py-10 text-center" 
				in:fly={{ y: 20, duration: 800, easing: backOut }}
			>
				<div
					class="bg-primary/10 text-primary mb-8 flex size-20 items-center justify-center rounded-3xl ring-4 ring-primary/5 shadow-2xl shadow-primary/20"
					in:scale={{ start: 0.5, delay: 200, duration: 600, easing: backOut }}
				>
					<span class="material-symbols-outlined text-4xl">check_circle</span>
				</div>
				<h3 class="ui-heading-2 mb-4">{t.successTitle}</h3>
				<p class="ui-body-lg mx-auto max-w-sm opacity-80">{t.successMessage}</p>
				
				<button
					type="button"
					class="ui-btn ui-btn-primary mt-12 px-10 shadow-xl shadow-primary/20"
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
				class="grid gap-8"
			>
				<div class="grid gap-8 sm:grid-cols-2">
					<!-- Name -->
					<Reveal type="slide-up" delay={100} duration={800}>
						<div class="space-y-2.5">
							<label for="name" class="ml-1 text-[0.7rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">
								{t.name}
							</label>
							<div class="group relative">
								<input
									type="text"
									id="name"
									name="name"
									bind:value={formData.name}
									placeholder="John Doe"
									class="w-full rounded-2xl border border-primary/10 bg-white/50 px-5 py-3.5 text-sm outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500/50 dark:focus:bg-white/10 dark:focus:ring-blue-500/10"
									required
								/>
								<div class="absolute inset-0 -z-10 rounded-2xl bg-primary/5 opacity-0 transition-opacity group-focus-within:opacity-100"></div>
							</div>
							{#if errors.name}
								<p class="ml-1 text-[10px] font-bold uppercase tracking-wider text-red-500" in:fade>{errors.name}</p>
							{/if}
						</div>
					</Reveal>

					<!-- Email -->
					<Reveal type="slide-up" delay={200} duration={800}>
						<div class="space-y-2.5">
							<label for="email" class="ml-1 text-[0.7rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">
								{t.email}
							</label>
							<div class="group relative">
								<input
									type="email"
									id="email"
									name="email"
									bind:value={formData.email}
									placeholder="john@example.com"
									class="w-full rounded-2xl border border-primary/10 bg-white/50 px-5 py-3.5 text-sm outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500/50 dark:focus:bg-white/10 dark:focus:ring-blue-500/10"
									required
								/>
								<div class="absolute inset-0 -z-10 rounded-2xl bg-primary/5 opacity-0 transition-opacity group-focus-within:opacity-100"></div>
							</div>
							{#if errors.email}
								<p class="ml-1 text-[10px] font-bold uppercase tracking-wider text-red-500" in:fade>{errors.email}</p>
							{/if}
						</div>
					</Reveal>
				</div>

				<!-- Subject -->
				<Reveal type="slide-up" delay={300} duration={800}>
					<div class="space-y-2.5">
						<label for="subject" class="ml-1 text-[0.7rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">
							{t.subject}
						</label>
						<div class="group relative">
							<input
								type="text"
								id="subject"
								name="subject"
								bind:value={formData.subject}
								placeholder="Project Inquiry"
								class="w-full rounded-2xl border border-primary/10 bg-white/50 px-5 py-3.5 text-sm outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500/50 dark:focus:bg-white/10 dark:focus:ring-blue-500/10"
								required
							/>
							<div class="absolute inset-0 -z-10 rounded-2xl bg-primary/5 opacity-0 transition-opacity group-focus-within:opacity-100"></div>
						</div>
						{#if errors.subject}
							<p class="ml-1 text-[10px] font-bold uppercase tracking-wider text-red-500" in:fade>{errors.subject}</p>
						{/if}
					</div>
				</Reveal>

				<!-- Message -->
				<Reveal type="slide-up" delay={400} duration={800}>
					<div class="space-y-2.5">
						<label for="message" class="ml-1 text-[0.7rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">
							{t.message}
						</label>
						<div class="group relative">
							<textarea
								id="message"
								name="message"
								bind:value={formData.message}
								rows="5"
								placeholder="Tell me about your project..."
								class="w-full resize-none rounded-2xl border border-primary/10 bg-white/50 px-5 py-4 text-sm outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-blue-500/50 dark:focus:bg-white/10 dark:focus:ring-blue-500/10"
								required
							></textarea>
							<div class="absolute inset-0 -z-10 rounded-2xl bg-primary/5 opacity-0 transition-opacity group-focus-within:opacity-100"></div>
						</div>
						{#if errors.message}
							<p class="ml-1 text-[10px] font-bold uppercase tracking-wider text-red-500" in:fade>{errors.message}</p>
						{/if}
					</div>
				</Reveal>

				{#if errorMessage}
					<div in:fly={{ y: 10 }} class="flex items-center gap-3 rounded-xl bg-red-50 p-4 dark:bg-red-900/10">
						<span class="material-symbols-outlined text-xl text-red-500">error</span>
						<p class="text-sm font-bold text-red-500">{errorMessage}</p>
					</div>
				{/if}

				<Reveal type="scale" delay={500} duration={600}>
					<button
						type="submit"
						disabled={isSubmitting}
						class="ui-btn ui-btn-primary group h-14 w-full rounded-2xl text-[0.75rem] shadow-xl shadow-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{#if isSubmitting}
							<span class="material-symbols-outlined mr-3 animate-spin">progress_activity</span>
							{t.sending}
						{:else}
							<span class="font-black uppercase tracking-[0.2em]">{t.send}</span>
							<span class="material-symbols-outlined ml-3 transition-transform group-hover:translate-x-1.5"
								>send</span
							>
						{/if}
					</button>
				</Reveal>
			</form>
		{/if}
	</div>

	<!-- Background accents inside the form -->
	<div class="absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-[100px]"></div>
	<div class="absolute -bottom-20 -left-20 size-80 rounded-full bg-blue-400/5 blur-[100px]"></div>
</div>
