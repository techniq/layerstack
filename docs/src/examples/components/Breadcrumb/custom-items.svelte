<script lang="ts">
  import { Breadcrumb } from '@layerstack/ui';

  const items = [
    { label: 'Region', value: 'North America' },
    { label: 'Country', value: 'Canada' },
    { label: 'City', value: 'Toronto' },
  ];

  // `null` entries are skipped, so a sparse path does not need filtering first
  const sparse = ['Home', null, 'Projects', null, 'LayerStack'];
</script>

<div class="grid gap-4">
  <Breadcrumb {items} class="gap-2">
    {#snippet item({ item })}
      <span>
        <span class="text-surface-content/50 text-xs uppercase">{item.label}</span>
        <span class="text-sm">{item.value}</span>
      </span>
    {/snippet}
  </Breadcrumb>

  <Breadcrumb items={sparse} />

  <!-- Long paths scroll rather than wrap -->
  <Breadcrumb items={Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)} class="overflow-auto" />
</div>
