<script lang="ts">
  import { tableOrderStore } from '@layerstack/svelte-table';
  import Table from '../Table.svelte';

  let { columns, data, ...props }: Record<string, any> = $props();

  // The store is created once from the initial columns, which is what this harness wants
  // svelte-ignore state_referenced_locally
  const order = tableOrderStore({ columns });

  // Passing `order` is enough — the `tableCell` attachment wires header clicks to it.  Also
  // passing `onHeaderClick={order.onHeaderClick}` would sort twice per click.
  const sorted = $derived($order.by ? [...data].sort($order.handler) : data);
</script>

<Table {columns} data={sorted} {order} {...props} />

<output data-testid="order-state">{$order.by}:{$order.direction}</output>
