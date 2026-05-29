<script lang="ts">
	import { scrollFade } from '@layerstack/svelte-actions';

	const itemCount = 30;
	const items = Array.from({ length: itemCount }).map((_, i) => `Item: ${i}`);
</script>

<div class="max-h-40 border rounded-sm" use:scrollFade>
	{#each items as item, i (item)}
		<div>{item}</div>
	{/each}
</div>
