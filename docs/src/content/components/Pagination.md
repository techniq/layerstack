---
description: Page controls driven by a PaginationState
category: navigation
related: [svelte-state/PaginationState, ui/Paginate]
---

## Usage

```svelte
<script lang="ts">
  import { Pagination } from '@layerstack/ui';
  import { PaginationState } from '@layerstack/svelte-state';

  const pagination = new PaginationState({ perPage: 10, total: 143 });
</script>

<Pagination {pagination} />
```

`show` selects which controls appear **and in what order**, so the same component covers a compact
prev/next pair and a full first/prev/summary/next/last/per-page bar.

Takes a [`PaginationState`](/docs/svelte-state/PaginationState) rather than owning the state, so it
works for server-side paging too. [`Paginate`](/docs/ui/Paginate) is the counterpart that slices an
in-memory array.

Svelte UX took a `paginationStore`; `PaginationState` replaces it.

## Basic

:example{name="basic" showCode}
