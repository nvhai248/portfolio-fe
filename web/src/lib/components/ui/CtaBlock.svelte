<script lang="ts">
	interface Props {
		title: string;
		description: string;
		href: string;
		label: string;
		panelClass?: string;
	}

	let { title, description, href, label, panelClass = 'ui-panel rounded-xl border-dashed p-8 text-center' }: Props = $props();
</script>

<div class={panelClass}>
	<h3 class="ui-heading-3">{title}</h3>
	<p class="ui-body mt-2">{description}</p>
	<a href={href} class="ui-link mt-4 inline-flex text-sm">{label}</a>
</div>
