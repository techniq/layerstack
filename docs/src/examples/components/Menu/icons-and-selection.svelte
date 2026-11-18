<script lang="ts">
  import { Button, Menu, MenuItem } from '@layerstack/ui';
  import { mdiAccount, mdiCog, mdiLogout } from '@mdi/js';

  const items = [
    { label: 'Profile', icon: mdiAccount },
    { label: 'Settings', icon: mdiCog },
    { label: 'Sign out', icon: mdiLogout },
  ];

  let open = $state(false);
  let selected = $state('Settings');
</script>

<div class="relative inline-block">
  <Button variant="outline" color="primary" onclick={() => (open = !open)}>Account</Button>

  <Menu bind:open placement="bottom-start">
    {#each items as item (item.label)}
      <MenuItem
        icon={item.icon}
        selected={selected === item.label}
        scrollIntoView={selected === item.label}
        onclick={() => (selected = item.label)}
      >
        {item.label}
      </MenuItem>
    {/each}
  </Menu>
</div>

<div class="mt-3 text-sm text-surface-content/70">Selected: {selected}</div>
