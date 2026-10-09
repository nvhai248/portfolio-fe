<script lang="ts">
	import type { PageData } from './$types';
	import AboutProfile from '$lib/components/sections/AboutProfile.svelte';

	let { data }: { data: PageData } = $props();
</script>

<AboutProfile aboutContent={data.aboutContent} cvContent={data.cvContent} profileDetails={data.profileDetails} locale="en" />
