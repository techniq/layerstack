<script lang="ts">
  import { Switch } from 'svelte-ux';
  import { timerStore } from '@layerstack/svelte-stores';

  const dateTimer = timerStore({ initial: new Date(), onTick: () => new Date() });
  $: ({ isRunning: isDateRunning } = dateTimer);
</script>

<div>{$dateTimer}</div>
<Switch
  checked={$isDateRunning}
  on:change={(e) => ((e.target as HTMLInputElement).checked ? dateTimer.start() : dateTimer.stop())}
/>
