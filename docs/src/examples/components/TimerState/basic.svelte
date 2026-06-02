<script lang="ts">
  import { TimerState } from '@layerstack/svelte-state';
  import { Switch } from 'svelte-ux';

  const dateTimer = new TimerState({ initial: new Date() });
</script>

<div>{dateTimer.current}</div>
<Switch
  checked={dateTimer.running}
  on:change={(e) => {
    // @ts-expect-error
    e.target?.checked ? dateTimer.start() : dateTimer.stop();
  }}
/>
