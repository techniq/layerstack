<script lang="ts">
  import { Button, Dialog } from '@layerstack/ui';

  let open = $state(false);
</script>

<Button variant="fill" color="primary" onclick={() => (open = true)}>Open dialog</Button>

<Dialog bind:open>
  {#snippet title()}
    Confirm action
  {/snippet}

  <div class="px-6 py-3">Are you sure you want to continue?</div>

  {#snippet actions()}
    <Button>Cancel</Button>
    <Button variant="fill" color="primary">Confirm</Button>
  {/snippet}
</Dialog>
