---
description: Selection state for a list of values, exposed to a snippet
category: state
related: [svelte-state/SelectionState, ui/Toggle]
---

## Usage

```svelte
<script lang="ts">
  import { Selection } from '@layerstack/ui';
</script>

<Selection all={options}>
  {#snippet children({ selected, isSelected, toggleSelected, toggleAll, clear })}
    …
  {/snippet}
</Selection>
```

A thin wrapper over [`SelectionState`](/docs/svelte-state/SelectionState) for when the state should
live in the markup rather than a script block. Reach for `SelectionState` directly when you need
the state outside a single subtree — the `state` property is also passed to the snippet.

Svelte UX dispatched a `change` event; this is now the `onChange` callback prop.

## Basic

:example{name="basic" showCode}

## Select all, single, and max

`all` is the set `toggleAll()` operates on — pass the current page's ids to get "select all on this
page". `isAnySelected()` alongside `isAllSelected()` gives the indeterminate header checkbox.
`single` allows only one selection, and `max` caps the count, with `isDisabled` marking the rest.

:example{name="select-all"}
