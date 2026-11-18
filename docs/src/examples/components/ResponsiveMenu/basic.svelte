<script lang="ts">
  import { Button, MenuItem, ResponsiveMenu } from '@layerstack/ui';

  let open = $state(false);
</script>

<!-- A Menu on wide viewports, a bottom Drawer on narrow ones — resize to see it switch -->
<div class="relative inline-block">
  <Button variant="outline" onclick={() => (open = !open)}>Open</Button>

  <ResponsiveMenu bind:open screenWidth={640}>
    {#snippet children()}
      <menu class="group p-1">
        <MenuItem onclick={() => (open = false)}>Profile</MenuItem>
        <MenuItem onclick={() => (open = false)}>Settings</MenuItem>
        <MenuItem onclick={() => (open = false)}>Sign out</MenuItem>
      </menu>
    {/snippet}
  </ResponsiveMenu>
</div>
