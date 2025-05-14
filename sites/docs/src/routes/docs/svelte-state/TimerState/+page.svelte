<script lang="ts">
  import { TimerState } from '@layerstack/svelte-state';
  import { Switch } from 'svelte-ux';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';

  const dateTimer = new TimerState({ initial: new Date(), onTick: () => new Date() });
  const tickTimer = new TimerState({ initial: 0, onTick: (value) => (value ?? 0) + 1 });
</script>

<h1>Usage</h1>

<Code source={`const timer = new TimerState();`} language="javascript" />

<Code
  source={`const timer = new TimerState<T>({ initial?: T, onTick?: (value: T) => {...}, delay?: number, disabled?: boolean })`}
  language="javascript"
/>

<h1>Examples</h1>

<h2>Default</h2>

<Code source={`const dateTimer = new TimerState();`} language="javascript" />

<Preview>
  <div>{dateTimer.current}</div>
  <Switch
    checked={dateTimer.running}
    on:change={(e) => {
      // @ts-expect-error
      e.target?.checked ? dateTimer.start() : dateTimer.stop();
    }}
  />
</Preview>

<h2>Tick count</h2>

<Code
  source={`const tickTimer = new TimerState({ initial: 0, onTick: (value) => value + 1 });`}
  language="javascript"
/>

<Preview>
  <div>{tickTimer.current}</div>
  <Switch
    checked={tickTimer.running}
    on:change={(e) => {
      // @ts-expect-error
      e.target?.checked ? tickTimer.start() : tickTimer.stop();
    }}
  />
</Preview>
