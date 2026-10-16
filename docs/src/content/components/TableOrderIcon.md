---
description: Sort direction indicator rendered in a Table header
category: layout
related: [ui/Table, svelte-table/stores]
---

## Usage

```svelte
<script lang="ts">
  import { TableOrderIcon } from '@layerstack/ui';
</script>

<TableOrderIcon {order} {column} />
```

Rendered automatically by [`Table`](/docs/ui/Table) when an `order` store is supplied — you rarely
need it directly. It shows an arrow only for the column currently being ordered by, rotated for
descending order.
