<script lang="ts">
  import { Button, Menu, MenuItem } from '@layerstack/ui';

  let open = $state(false);
  let selected = $state('');
</script>

<div class="relative inline-block">
  <Button variant="fill" color="primary" onclick={() => (open = !open)}>Open menu</Button>

  <Menu bind:open matchWidth>
    <MenuItem onclick={() => (selected = 'Profile')}>Profile</MenuItem>
    <MenuItem onclick={() => (selected = 'Settings')}>Settings</MenuItem>
    <MenuItem onclick={() => (selected = 'Sign out')}>Sign out</MenuItem>
  </Menu>
</div>

<div class="mt-3 text-sm text-surface-content/70">Selected: {selected || '(none)'}</div>
