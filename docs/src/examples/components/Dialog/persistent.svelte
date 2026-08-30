<script lang="ts">
  import { Button, Dialog } from '@layerstack/ui';

  let open = $state(false);
  let attempts = $state(0);
</script>

<Button variant="outline" onclick={() => (open = true)}>Open persistent dialog</Button>

<!-- A persistent dialog ignores backdrop clicks and Escape -->
<Dialog bind:open persistent onCloseAttempt={() => attempts++}>
  {#snippet title()}
    Persistent
  {/snippet}

  <div class="px-6 py-3">
    Clicking the backdrop will not close this. Blocked attempts: {attempts}
  </div>

  {#snippet actions(ctx)}
    <Button onclick={() => ctx.close({ force: true })}>Close anyway</Button>
  {/snippet}
</Dialog>
