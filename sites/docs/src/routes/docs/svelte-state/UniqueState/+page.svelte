<script lang="ts">
  import { UniqueState } from '@layerstack/svelte-state';
  import { Checkbox } from 'svelte-ux';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';

  const data = Array.from({ length: 5 }).map((_, i) => {
    return {
      id: i + 1,
    };
  });

  const state = new UniqueState();
</script>

<h1>Usage</h1>

<Code
  source={`import { UniqueState } from '@layerstack/svelte-state';

const state = new UniqueState();

state.current.has(value)
state.current.size
state.add(value);
state.addEach([value1, value2]);
state.delete(value);
state.toggle(value);
state.reset();
state.clear();
`}
  language="javascript"
/>

<h1>Examples</h1>

<h2>Basic</h2>

<Preview>
  {#each data as d}
    <div>
      <Checkbox checked={state.current.has(d.id)} on:change={() => state.toggle(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify([...state.current])}
</Preview>
