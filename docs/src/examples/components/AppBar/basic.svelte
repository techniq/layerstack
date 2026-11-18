<script lang="ts">
  import { AppBar, Button } from '@layerstack/ui';
  import { mdiRefresh, mdiDotsVertical } from '@mdi/js';
</script>

<div class="grid gap-3">
  <AppBar title="Example" head={false} />

  <!-- An array title renders as a Breadcrumb -->
  <AppBar title={['Projects', 'LayerStack', 'Settings']} head={false} />

  <AppBar title="With actions" head={false}>
    {#snippet actions()}
      <Button icon={mdiRefresh} class="p-2 hover:bg-surface-100/10" />
      <Button icon={mdiDotsVertical} class="p-2 hover:bg-surface-100/10" />
    {/snippet}
  </AppBar>

  <AppBar title="Custom color" head={false} class="bg-primary text-primary-content" />
</div>
