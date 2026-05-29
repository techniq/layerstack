<script lang="ts">
	import { Checkbox } from 'svelte-ux';
	import { selectionStore } from '@layerstack/svelte-stores';

	const data = Array.from({ length: 5 }).map((_, i) => ({ id: i + 1 }));

	const selection = selectionStore({ max: 3 });
</script>

{#each data as d}
	<div>
		<Checkbox
			checked={$selection.isSelected(d.id)}
			on:change={() => $selection.toggleSelected(d.id)}
			disabled={$selection.isDisabled(d.id)}
		>
			{d.id}
		</Checkbox>
	</div>
{/each}
selected: {JSON.stringify($selection.selected)}
