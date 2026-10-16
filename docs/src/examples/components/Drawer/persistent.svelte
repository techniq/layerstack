<script lang="ts">
  import { Button, Drawer, TextField } from '@layerstack/ui';

  let open = $state(false);
  let refused = $state(0);
</script>

<Button variant="outline" onclick={() => (open = true)}>Open persistent drawer</Button>

<!-- Backdrop clicks and Escape are ignored; only the explicit action closes it -->
<Drawer bind:open persistent placement="right" class="w-96" onCloseAttempt={() => refused++}>
  <div class="p-4 grid gap-3">
    <p class="text-sm text-surface-content/70">Clicking outside will not close this drawer.</p>
    <TextField label="Name" autofocus />
  </div>

  {#snippet actions({ close })}
    <Button onclick={() => close({ force: true })}>Close</Button>
  {/snippet}
</Drawer>

<div class="mt-3 text-sm text-surface-content/70">Close attempts refused: {refused}</div>
