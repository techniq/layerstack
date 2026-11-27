<script lang="ts">
  import { Table } from '@layerstack/ui';
  import type { ColumnDef } from '@layerstack/svelte-table';

  const data = [
    { name: 'Alice', role: 'Engineer', commits: 128 },
    { name: 'Bob', role: 'Designer', commits: 42 },
    { name: 'Charlie', role: 'Engineer', commits: 87 },
  ];

  const columns: ColumnDef<(typeof data)[number]>[] = [
    { name: 'name', header: 'Name' },
    { name: 'role', header: 'Role' },
    { name: 'commits', header: 'Commits', align: 'right' },
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
