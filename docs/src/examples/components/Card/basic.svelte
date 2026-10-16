<script lang="ts">
  import { Button, Card } from '@layerstack/ui';
</script>

<div class="grid gap-4 max-w-md">
  <Card title="Card title" subheading="A short description">
    {#snippet contents()}
      <p class="text-sm text-surface-content/70 pb-4">
        Content goes in the <code>contents</code> snippet, actions in <code>actions</code>.
      </p>
    {/snippet}

    {#snippet actions()}
      <Button>Cancel</Button>
      <Button variant="fill" color="primary">Save</Button>
    {/snippet}
  </Card>

  <Card title={['Projects', 'LayerStack']} subheading="Array titles render as a breadcrumb" />
</div>
