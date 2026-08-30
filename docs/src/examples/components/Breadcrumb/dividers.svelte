<script lang="ts">
  import { Breadcrumb, DividerDot, Icon } from '@layerstack/ui';
  import { mdiArrowRight } from '@mdi/js';

  const items = ['Home', 'Projects', 'LayerStack'];
</script>

<div class="grid gap-3">
  <Breadcrumb {items} />
  <Breadcrumb {items} class="gap-1" />

  <!-- A plain string divider -->
  <Breadcrumb {items} divider="/" class="gap-2" />

  <!-- Or any markup -->
  <Breadcrumb {items} class="gap-2">
    {#snippet dividerSnippet()}
      <Icon data={mdiArrowRight} class="text-surface-content/25" />
    {/snippet}
  </Breadcrumb>

  <Breadcrumb {items} class="gap-2">
    {#snippet dividerSnippet()}
      <DividerDot class="text-surface-content/50" />
    {/snippet}
  </Breadcrumb>
</div>
