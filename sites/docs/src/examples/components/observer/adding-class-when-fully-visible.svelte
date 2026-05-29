<script lang="ts">
	import { intersection } from '@layerstack/svelte-actions';
</script>

<div class="h-[200px] overflow-auto">
	{#each { length: 10 } as _}
		<div>Scroll down</div>
	{/each}
	<div
		use:intersection={{ threshold: 1 }}
		on:intersecting={(e) => {
			if (e.detail.isIntersecting) {
				// @ts-expect-error
				e.target.classList.add('bg-danger');
			} else {
				// @ts-expect-error
				e.target.classList.remove('bg-danger');
			}
		}}
		class="transition-colors duration-500"
	>
		Watch me scroll away
	</div>
	{#each { length: 10 } as _}
		<div>Scroll up</div>
	{/each}
</div>
