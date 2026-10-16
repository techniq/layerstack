<script lang="ts">
  import { BarStack } from '@layerstack/ui';

  const data = [
    { label: 'TypeScript', value: 62, color: 'var(--color-primary)' },
    { label: 'Svelte', value: 24, color: 'var(--color-secondary)' },
    { label: 'CSS', value: 14, color: 'var(--color-accent)' },
  ];

  let selected = $state<string | null>(null);
</script>

<BarStack {data} onItemClick={(item) => (selected = item.label)} class="w-full" />

<div class="flex gap-4 mt-3 text-sm">
  {#each data as item (item.label)}
    <span class="flex items-center gap-1">
      <span class="size-3 rounded-sm" style:background-color={item.color}></span>
      {item.label} ({item.value}%)
    </span>
  {/each}
</div>

<div class="mt-2 text-sm text-surface-content/70">Clicked: {selected ?? '(none)'}</div>
