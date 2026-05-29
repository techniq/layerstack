<script lang="ts">
	import { Switch } from 'svelte-ux';
	import { timerStore } from '@layerstack/svelte-stores';

	const tickTimer = timerStore({ initial: 0, onTick: (value) => value + 1 });
	$: ({ isRunning: isTickRunning } = tickTimer);
</script>

<div>{$tickTimer}</div>
<Switch
	checked={$isTickRunning}
	on:change={(e) => (e.target.checked ? tickTimer.start() : tickTimer.stop())}
/>
