<script lang="ts">
	import { SelectionState } from '@layerstack/svelte-state';
	import { Radio } from 'svelte-ux';

	const data = Array.from({ length: 5 }).map((_, i) => {
		return {
			id: i + 1,
		};
	});

	const selection = new SelectionState({ single: true });
</script>

{#each data as d}
	<div>
		<Radio group={selection.current} value={d.id} on:change={() => selection.toggle(d.id)}>
			{d.id}
		</Radio>
	</div>
{/each}
selected: {JSON.stringify(selection.current)}
