<script lang="ts">
	import { Checkbox, Radio } from 'svelte-ux';
	import { SelectionState } from '@layerstack/svelte-state';
	import Preview from '$docs/Preview.svelte';

  const data = Array.from({ length: 5 }).map((_,i) => {
    return {
      id: i + 1
    }
  });

  const selection = new SelectionState()
  const selection2 = new SelectionState({ initial: [3,4,5]})
  const selection3 = new SelectionState({ all: data.map(d => d.id)});
  const selection4 = new SelectionState({ single: true });
  const selection5 = new SelectionState({ max: 3 });

  console.log({ selection })
</script>

<h1>Usage</h1>

<h2>Max</h2>

```js
const selection = new SelectionState({ max: 3 });
```

<Preview>
  {#each data as d}
    <div>
      <Checkbox checked={selection5.isSelected(d.id)} on:change={() => selection5.toggleSelected(d.id)} disabled={selection5.isDisabled(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selection5.current)}
</Preview>

<h2>Basic</h2>

```js
const selection = new SelectionState();
```

<Preview>
  {#each data as d}
    <div>
      <Checkbox checked={selection.isSelected(d.id)} on:change={() => selection.toggleSelected(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selection.current)}
</Preview>

<h2>Initial selection</h2>

```js
const selection2 = new SelectionState({ initial: [3, 4, 5] });
```

<Preview>
  {#each data as d}
    <div>
      <Checkbox checked={selection2.isSelected(d.id)} on:change={() => selection2.toggleSelected(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selection2.current)}
</Preview>

<h2>Select all</h2>

```js
const selection3 = new SelectionState({ all: data.map((d) => d.id) });
```

<Preview>
  <Checkbox checked={selection3.isAnySelected()} indeterminate={!selection3.isAllSelected()} on:change={() => selection3.toggleAll()}>
    Select all
  </Checkbox>
  {#each data as d}
    <div>
      <Checkbox checked={selection3.isSelected(d.id)} on:change={() => selection3.toggleSelected(d.id)}>
        {d.id}
      </Checkbox>
    </div>
  {/each}
  selected: {JSON.stringify(selection3.current)}
</Preview>

<h2>Single</h2>

```js
const selection4 = new SelectionState({ single: true });
```

<Preview>
  {#each data as d}
    <div>
      <Radio group={selection4.current} value={d.id} on:change={() => selection4.toggleSelected(d.id)}>
        {d.id}
      </Radio>
    </div>
  {/each}
  selected: {JSON.stringify(selection4.current)}
</Preview>
