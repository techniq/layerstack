<script lang="ts">
	import { scrollShadow } from '@layerstack/svelte-actions';

	const itemCount = 30;
	const items = Array.from({ length: itemCount }).map((_, i) => `Item: ${i}`);
</script>

<div class="h-40 border rounded-sm" use:scrollShadow>
	{#each items as item, i (item)}
		<div>{item}</div>
	{/each}
</div>
