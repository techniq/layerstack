<script lang="ts">
  import { Button, Overlay, ProgressCircle } from '@layerstack/ui';

  let loading = $state(true);
</script>

<Button variant="outline" class="mb-3" onclick={() => (loading = !loading)}>
  {loading ? 'Hide' : 'Show'} overlay
</Button>

<div class="relative border rounded-sm p-4 h-32">
  <p class="text-sm text-surface-content/70">Content underneath the overlay.</p>

  {#if loading}
    <Overlay center class="rounded-sm">
      <ProgressCircle />
    </Overlay>
  {/if}
</div>
