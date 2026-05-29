<script lang="ts">
	import { resize } from '@layerstack/svelte-actions';
</script>

<div
	use:resize
	on:resize={(e) => {
		console.log(e.detail);
		// @ts-expect-error
		e.target.innerText = JSON.stringify(e.detail.contentRect, null, 2);
	}}
	class="resize overflow-auto whitespace-pre outline rounded-sm"
></div>
