<script lang="ts">
  import { BarStack } from '@layerstack/ui';
  import { format } from '@layerstack/utils';

  const data = [
    { label: 'Chrome', value: 62 },
    { label: 'Safari', value: 20 },
    { label: 'Firefox', value: 11 },
    { label: 'Other', value: 7 },
  ];

  const colored = [
    { label: 'Chrome', value: 62, color: 'var(--color-primary)' },
    { label: 'Safari', value: 20, color: 'var(--color-secondary)' },
    { label: 'Firefox', value: 11, color: 'var(--color-accent)' },
    { label: 'Other', value: 7, color: 'var(--color-neutral)' },
  ];
</script>

<div class="grid gap-6">
  <BarStack {data} class="gap-1" />

  <!-- Per-item colors -->
  <BarStack data={colored} class="gap-1" />

  <!-- Replace just the bar, keeping the layout -->
  <BarStack {data} class="gap-1">
    {#snippet bar({ item, total })}
      <div class="flex items-center gap-2 truncate py-1 px-2 text-xs">
        <span class="font-semibold">{format(item.value / total, 'percent')}</span>
        <span class="truncate text-surface-content/50">{item.label}</span>
      </div>
    {/snippet}
  </BarStack>

  <!-- Or the whole segment, for a label under the bar -->
  <BarStack {data} class="gap-1">
    {#snippet children({ item, total })}
      <div class="h-1 bg-primary group-first:rounded-l group-last:rounded-r"></div>
      <div class="truncate text-xs mt-1">
        <div class="font-semibold">{item.label}</div>
        <div class="text-surface-content/50">{format(item.value / total, 'percent')}</div>
      </div>
    {/snippet}
  </BarStack>
</div>
