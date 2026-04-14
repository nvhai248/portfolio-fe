<script lang="ts">
	import type { SocialProfile } from '$lib/types/content';
	import { getSocialIcon } from '$lib/utils/content';

	interface Props {
		items: SocialProfile[];
	}

	let { items }: Props = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each items as social}
		<a
			href={social.url}
			target="_blank"
			rel="noreferrer"
			class="ui-btn-ghost border ui-divider text-xs"
			aria-label={`${social.platform} profile (opens in a new tab)`}
		>
			<span class="material-symbols-outlined text-base">{getSocialIcon(social.platform)}</span>
			{social.platform}
		</a>
	{/each}
</div>
