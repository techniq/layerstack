<script lang="ts">
  import { Button, MenuItem, ResponsiveMenu, TextField } from '@layerstack/ui';

  let open = $state(false);
</script>

<div class="relative inline-block">
  <Button variant="outline" onclick={() => (open = !open)}>Filters</Button>

  <!-- Each surface is configured independently -->
  <ResponsiveMenu
    bind:open
    screenWidth={768}
    menuProps={{ placement: 'bottom-end', matchWidth: false }}
    drawerProps={{ placement: 'bottom', class: 'h-64' }}
  >
    {#snippet children()}
      <div class="p-3 grid gap-3 w-64">
        <TextField label="Search" dense />
        <menu class="group">
          <MenuItem onclick={() => (open = false)}>Recent</MenuItem>
          <MenuItem onclick={() => (open = false)}>Starred</MenuItem>
        </menu>
      </div>
    {/snippet}
  </ResponsiveMenu>
</div>
