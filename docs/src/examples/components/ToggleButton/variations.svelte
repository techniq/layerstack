<script lang="ts">
  import { Button, Dialog, Drawer, ToggleButton } from '@layerstack/ui';
  import { slide } from 'svelte/transition';
</script>

<div class="grid gap-6 max-w-md">
  <!-- "Show more" — the revealed content slides in below the button -->
  <ToggleButton size="sm" transition={slide}>
    {#snippet children({ on })}
      {on ? 'Show less' : 'Show more'}…
    {/snippet}

    {#snippet toggle()}
      <div class="mt-2 border-t border-surface-content/10 text-sm">
        {#each [1, 2, 3, 4, 5] as i (i)}
          <div>Detail {i}</div>
        {/each}
      </div>
    {/snippet}
  </ToggleButton>

  <!-- `buttonPlacement="after"` puts the trigger below the content -->
  <ToggleButton size="sm" transition={slide} buttonPlacement="after" on>
    {#snippet children({ on })}
      {on ? 'Show less' : 'Show more'}…
    {/snippet}

    {#snippet toggle()}
      <div class="mb-2 border-b border-surface-content/10 text-sm">
        {#each [1, 2, 3] as i (i)}
          <div>Detail {i}</div>
        {/each}
      </div>
    {/snippet}
  </ToggleButton>

  <!-- Driving an overlay: the button is the trigger, the snippet is the overlay -->
  <div class="flex gap-3">
    <ToggleButton variant="outline">
      Open dialog

      {#snippet toggle({ on, toggleOff })}
        <Dialog open={on} onClose={toggleOff}>
          {#snippet title()}Are you sure?{/snippet}
          {#snippet actions()}
            <Button variant="fill" color="primary" onclick={toggleOff}>Close</Button>
          {/snippet}
        </Dialog>
      {/snippet}
    </ToggleButton>

    <ToggleButton variant="outline">
      Open drawer

      {#snippet toggle({ on, toggleOff })}
        <Drawer open={on} onClose={toggleOff} placement="right" class="w-96">
          <div class="p-4">Contents</div>
          {#snippet actions()}
            <Button onclick={toggleOff}>Close</Button>
          {/snippet}
        </Drawer>
      {/snippet}
    </ToggleButton>
  </div>
</div>
