---
description: Boolean state exposed to a snippet, with callbacks for each transition
category: state
related: [ui/Selection, ui/Switch]
---

## Usage

```svelte
<script lang="ts">
  import { Toggle } from '@layerstack/ui';
</script>

<Toggle>
  {#snippet children({ on, toggle })}
    <button onclick={toggle}>{on ? 'On' : 'Off'}</button>
  {/snippet}
</Toggle>
```

`on` is bindable. Svelte UX's `toggle`, `toggleOn`, and `toggleOff` events are now the `onToggle`,
`onToggleOn`, and `onToggleOff` callback props.

With runes, a plain `let on = $state(false)` covers most cases — reach for `Toggle` when the state
belongs to the markup, such as inside an `{#each}`.

## Basic

:example{name="basic" showCode}
