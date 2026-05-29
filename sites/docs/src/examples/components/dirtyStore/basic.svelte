<script lang="ts">
	import { writable } from 'svelte/store';
	import { Button, TextField } from 'svelte-ux';
	import { dirtyStore } from '@layerstack/svelte-stores';

	const value = writable('');
	const isDirty = dirtyStore(value);
</script>

<TextField bind:value={$value} />
<div>isDirty: {$isDirty}</div>
<Button on:click={() => isDirty.reset()}>Reset</Button>
