<script lang="ts">
  import { TimerState } from '@layerstack/svelte-state';
  import { Switch } from 'svelte-ux';

  const tickTimer = new TimerState({ initial: 0, tick: (value) => (value ?? 0) + 1 });
</script>

<div>{tickTimer.current}</div>
<Switch
  checked={tickTimer.running}
  on:change={(e) => {
    // @ts-expect-error
    e.target?.checked ? tickTimer.start() : tickTimer.stop();
  }}
/>
