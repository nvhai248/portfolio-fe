<script lang="ts">
	import CodeBlock from './CodeBlock.svelte';

	let { portableText }: { portableText: any } = $props();
	const codeValue = $derived(portableText?.value);
</script>

{#if codeValue}
	<CodeBlock
		code={codeValue.code || ''}
		language={codeValue.language || 'text'}
		filename={codeValue.filename || ''}
	/>
{/if}
