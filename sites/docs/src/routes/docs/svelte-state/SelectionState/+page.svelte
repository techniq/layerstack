<script lang="ts">
  import { SelectionState } from '@layerstack/svelte-state';
  import { Button, Checkbox, Radio } from 'svelte-ux';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';

  const data = Array.from({ length: 5 }).map((_, i) => {
    return {
      id: i + 1,
    };
  });

  const selection = new SelectionState();
  const selectionInitial = new SelectionState({ initial: [3, 4, 5] });
  const selectionAll = new SelectionState({ all: data.map((d) => d.id) });
  const selectionSingle = new SelectionState({ single: true });
  const selectionSet = new SelectionState();
</script>

<h1>Usage</h1>

<Code
  source={`import { SelectionState } from '@layerstack/svelte-state';

const state = new SelectionState();

state.current.has(value)
state.current.size
state.add(value);
state.delete(value);
state.toggle(value);
`}
  language="javascript"
/>

<h1>Examples</h1>

<h2>Basic</h2>

<Code source={`const selection = new SelectionState();`} language="javascript" />

<Preview>
  {#each data as d}
    <div>
      <Checkbox checked={selection.isSelected(d.id)} on:change={() => selection.toggle(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selection.current)}
</Preview>

<h2>Initial selection</h2>

<Code
  source={`const selection = new SelectionState({ initial: [3, 4, 5] });`}
  language="javascript"
/>

<Preview>
  <Button on:click={() => selectionInitial.clear()}>Clear</Button>
  <Button on:click={() => selectionInitial.reset()}>Reset</Button>
  {#each data as d}
    <div>
      <Checkbox
        checked={selectionInitial.isSelected(d.id)}
        on:change={() => selectionInitial.toggle(d.id)}
      >
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selectionInitial.current)}
</Preview>

<h2>Max</h2>

<Code source={`const selection = new SelectionState({ max: 3 });`} language="javascript" />

<Preview>
  {#each data as d}
    <div>
      <Checkbox
        checked={selectionSet.isSelected(d.id)}
        on:change={() => selectionSet.toggle(d.id)}
        disabled={selectionSet.isDisabled(d.id)}
      >
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selectionSet.current)}
</Preview>

<h2>Select all</h2>

<Code
  source={`const selection = new SelectionState({ all: data.map((d) => d.id) });`}
  language="javascript"
/>

<Preview>
  <Checkbox
    checked={selectionAll.isAnySelected()}
    indeterminate={!selectionAll.isAllSelected()}
    on:change={() => selectionAll.toggleAll()}
  >
    Select all
  </Checkbox>
  {#each data as d}
    <div>
      <Checkbox checked={selectionAll.isSelected(d.id)} on:change={() => selectionAll.toggle(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selectionAll.current)}
</Preview>

<h2>Single</h2>

<Code source={`const selection = new SelectionState({ single: true });`} language="javascript" />

<Preview>
  {#each data as d}
    <div>
      <Radio
        group={selectionSingle.current}
        value={d.id}
        on:change={() => selectionSingle.toggle(d.id)}
      >
        {d.id}
      </Radio>
    </div>
  {/each}
  selected: {JSON.stringify(selectionSingle.current)}
</Preview>

<h2>Set selection</h2>

<Code source={`const selection = new SelectionState();`} language="javascript" />

<Preview>
  <Button on:click={() => (selectionSet.current = [1, 2, 3])}>Select first 3</Button>
  <Button on:click={() => (selectionSet.current = [4, 5])}>Select last 2</Button>
  <Button on:click={() => selectionSet.clear()}>Clear</Button>
  {#each data as d}
    <div>
      <Checkbox checked={selectionSet.isSelected(d.id)} on:change={() => selectionSet.toggle(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selectionSet.current)}
</Preview>
