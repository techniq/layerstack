<script lang="ts">
  import { Button, Dialog, ViewportCenter } from '@layerstack/ui';

  let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Show centered overlay</Button>

<Dialog bind:open classes={{ dialog: 'bg-transparent shadow-none' }}>
  <ViewportCenter>
    <div class="bg-surface-100 border rounded-sm p-6 shadow-lg">Centered in the viewport</div>
  </ViewportCenter>
</Dialog>
