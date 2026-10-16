<script lang="ts">
  import { Table } from '@layerstack/ui';
  import { tableOrderStore } from '@layerstack/svelte-table';

  const data = [
    { name: 'Alice', role: 'Engineer', commits: 128 },
    { name: 'Bob', role: 'Designer', commits: 42 },
    { name: 'Charlie', role: 'Engineer', commits: 87 },
  ];

  const columns = [
    { name: 'name', header: 'Name' },
    { name: 'role', header: 'Role' },
    { name: 'commits', header: 'Commits' },
  ];

  // Passing `order` is all that's needed — header clicks are wired up for you
  const order = tableOrderStore({ columns });

  const sorted = $derived($order.by ? [...data].sort($order.handler) : data);
</script>

<Table
  data={sorted}
  {columns}
  {order}
  classes={{
    th: 'border-b px-3 py-2 text-left text-surface-content/50 text-sm cursor-pointer select-none',
    tr: 'border-b last:border-b-0',
    td: 'px-3 py-2',
  }}
/>

<div class="mt-3 text-sm text-surface-content/70">
  Ordered by <code>{$order.by || '(none)'}</code>
  {$order.direction}
</div>
