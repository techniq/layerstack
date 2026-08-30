<script lang="ts">
  import { Backdrop, Button } from '@layerstack/ui';

  let shown = $state(false);
</script>

<Button variant="outline" onclick={() => (shown = true)}>Show backdrop</Button>

{#if shown}
  <Backdrop blur portal onclick={() => (shown = false)}>
    <div class="bg-surface-100 border rounded-sm p-6 shadow-lg">Click anywhere to dismiss</div>
  </Backdrop>
{/if}
