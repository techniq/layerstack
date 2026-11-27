---
description: Data table driven by column definitions, with ordering, formatting, and per-part styling
category: layout
related: [ui/TableOrderIcon, svelte-table/stores, svelte-table/actions]
---

## Usage

```svelte
<script lang="ts">
  import { Table } from '@layerstack/ui';

  const columns = [
    { name: 'name', header: 'Name' },
    { name: 'commits', header: 'Commits' },
  ];
</script>

<Table {data} {columns} />
```

Columns come from [`@layerstack/svelte-table`](/docs/svelte-table/stores), which also provides the
ordering store and the `tableCell` behavior applied to each cell.

## Basic

:example{name="basic" showCode}

## Ordering

Pass an `order` store and header clicks are wired up for you — the `tableCell` attachment calls
`order.onHeaderClick` itself, so you do **not** also need `onHeaderClick={order.onHeaderClick}`
(that would sort twice per click). Use `onHeaderClick` only for additional behavior.

:example{name="ordering"}

## Formatting

`format` accepts a function or the name of one of the configured
[format presets](/docs/utils/format). `value` derives a cell from the whole row, and `html` opts a
column into rendering markup.

:example{name="formatting"}

## Custom header and body

The generated `<thead>` and `<tbody>` can each be replaced with a snippet:

```svelte
<Table {data} {columns}>
  {#snippet body({ data, columns, getCellContent })}
    <tbody>
      {#each data ?? [] as rowData, rowIndex}
        <tr>
          {#each columns as column}
            <td>{getCellContent(column, rowData, rowIndex)}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  {/snippet}
</Table>
```

The body snippet is named `body` rather than Svelte UX's `data` slot, which would collide with the
`data` prop.
