<script lang="ts">
  import { Button, Dialog } from '@layerstack/ui';

  let open = $state(false);
  let loading = $state(false);

  function save() {
    loading = true;
    setTimeout(() => {
      loading = false;
      open = false;
    }, 1500);
  }
</script>

<Button variant="outline" onclick={() => (open = true)}>Open with loading</Button>

<Dialog bind:open {loading}>
  {#snippet title()}
    Save changes
  {/snippet}

  <div class="px-6 py-3 w-80">Saving covers the dialog with a loading overlay.</div>

  {#snippet actions()}
    <Button onclick={(e) => e.stopPropagation()}>Cancel</Button>
    <Button variant="fill" color="primary" onclick={save}>Save</Button>
  {/snippet}
</Dialog>
