<script lang="ts">
	import { writable } from 'svelte/store';
	import { TextField } from 'svelte-ux';
	import { debounceStore } from '@layerstack/svelte-stores';

	const value = writable('');
	const debouncedValue = debounceStore(value);
</script>

<TextField bind:value={$value} label="Value" />
<div class="mt-2">value: {$value}</div>
<div>debouncedValue: {$debouncedValue}</div>
