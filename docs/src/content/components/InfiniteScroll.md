---
description: Reveal more of a list each time a sentinel scrolls into view
category: layout
related: [ui/Lazy, ui/Paginate]
---

## Usage

```svelte
<script lang="ts">
  import { InfiniteScroll } from '@layerstack/ui';
</script>

<InfiniteScroll {items} perPage={10}>
  {#snippet children({ visibleItems })}
    {#each visibleItems as item}…{/each}
  {/snippet}
</InfiniteScroll>
```

Works over an in-memory array — it reveals more of `items` rather than fetching. `disabled` renders
everything at once and removes the sentinel.

## Basic

:example{name="basic" showCode}

## Page size

:example{name="per-page"}
