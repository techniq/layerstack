---
description: Paginate an in-memory array, exposing the state to a snippet
category: navigation
related: [svelte-state/PaginationState, ui/InfiniteScroll]
---

## Usage

```svelte
<script lang="ts">
  import { Paginate } from '@layerstack/ui';
</script>

<Paginate {data} perPage={10}>
  {#snippet children({ pagination, pageData })}
    …
  {/snippet}
</Paginate>
```

A wrapper over [`PaginationState`](/docs/svelte-state/PaginationState) that keeps `total` in sync
with the data and hands back the current slice. Reach for `PaginationState` directly when paging
server-side, where there is no local array to slice.

## Basic

:example{name="basic" showCode}
