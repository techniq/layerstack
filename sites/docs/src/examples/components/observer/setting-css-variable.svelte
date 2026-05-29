<script lang="ts">
	import { resize } from '@layerstack/svelte-actions';
</script>

<div
	use:resize
	on:resize={(e) => {
		// @ts-expect-error
		e.target.style.setProperty('--color', e.detail.contentRect.width % 255);
	}}
	style:background-color="hsl(var(--color), 100%, 70%)"
	class="resize overflow-auto p-2 rounded-sm"
>
	Resize and watch me change colors
</div>
