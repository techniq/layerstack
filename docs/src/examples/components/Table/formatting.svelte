<script lang="ts">
  import { Table } from '@layerstack/ui';
  import type { ColumnDef } from '@layerstack/svelte-table';

  const data = [
    { name: 'Alice', joined: new Date(2021, 4, 12), revenue: 128000 },
    { name: 'Bob', joined: new Date(2022, 9, 1), revenue: 42500 },
  ];

  const columns: ColumnDef<(typeof data)[number]>[] = [
    { name: 'name', header: 'Name' },
    { name: 'joined', header: 'Joined', format: (d: Date) => d.toLocaleDateString() },
    { name: 'revenue', header: 'Revenue', format: 'currency' },
    // `value` derives a cell from the whole row
    {
      name: 'initials',
      header: 'Initials',
      value: (row) => row.name.slice(0, 2).toUpperCase(),
    },
  ];
</script>

<Table
  {data}
  {columns}
  classes={{
    th: 'border-b px-3 py-2 text-left text-surface-content/50 text-sm',
    tr: 'border-b last:border-b-0',
    td: 'px-3 py-2',
  }}
/>
