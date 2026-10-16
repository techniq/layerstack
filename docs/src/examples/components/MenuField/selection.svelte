<script lang="ts">
  import { MenuField } from '@layerstack/ui';

  const options = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ];

  const colors: Record<string, string> = {
    draft: 'bg-warning/20 text-warning-700',
    published: 'bg-success/20 text-success-700',
    archived: 'bg-surface-content/10',
  };

  let value = $state('published');
</script>

<div class="max-w-sm">
  <MenuField label="Status" {options} bind:value>
    {#snippet selection({ selected })}
      <span class="rounded-full px-2 py-0.5 text-sm {colors[selected?.value ?? '']}">
        {selected?.label ?? '—'}
      </span>
    {/snippet}
  </MenuField>
</div>
