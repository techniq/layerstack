<script lang="ts">
  import { Button, Card } from '@layerstack/ui';
</script>

<div class="grid gap-4 max-w-md">
  <!-- `contents` is a padded area below `children`; `actions` is a footer pinned to the bottom -->
  <Card title="With contents and actions">
    {#snippet contents()}
      <p class="text-sm text-surface-content/70">
        The contents area is padded for you, so prose lines up with the header.
      </p>
    {/snippet}

    {#snippet actions()}
      <Button variant="fill-light" color="primary">Save</Button>
      <Button>Cancel</Button>
    {/snippet}
  </Card>

  <!-- Actions stay at the bottom even when cards differ in height -->
  <div class="grid grid-cols-2 gap-4">
    <Card title="Short" class="shadow-none border border-surface-content/10">
      {#snippet actions()}
        <Button size="sm">Action</Button>
      {/snippet}
    </Card>
    <Card title="Taller">
      {#snippet contents()}
        <p class="text-sm text-surface-content/70">More content, so this card is taller.</p>
      {/snippet}
      {#snippet actions()}
        <Button size="sm">Action</Button>
      {/snippet}
    </Card>
  </div>
</div>
