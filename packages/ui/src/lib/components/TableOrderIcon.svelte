<script lang="ts" module>
  import type { tableOrderStore, ColumnDef } from '@layerstack/svelte-table';

  export type TableOrderIconProps = {
    order: ReturnType<typeof tableOrderStore>;
    column: ColumnDef;
  };
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getSettings } from './settingsState.svelte.js';
  import Icon from './Icon.svelte';

  let { order, column }: TableOrderIconProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
</script>

{#if $order.by && ($order.by === column.value || $order.by === column.name || $order.by === column.orderBy)}
  <span class="TableOrderIcon">
    <Icon
      data={icons.arrowUp}
      class={cls(
        'inline-block size-4 transition duration-100 transform',
        $order.direction === 'desc' && 'rotate-180'
      )}
    />
  </span>
{/if}
