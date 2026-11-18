<script lang="ts">
  import { NavItem } from '@layerstack/ui';
  import { page } from '$app/state';
  import { mdiHome, mdiCog, mdiAccount } from '@mdi/js';

  const items = [
    { path: '/', text: 'Home', icon: mdiHome },
    { path: '/docs/ui/NavItem', text: 'NavItem (active)', icon: mdiCog },
    { path: '/docs/ui/Button', text: 'Button', icon: mdiAccount },
  ];
</script>

<nav class="border rounded-sm divide-y max-w-xs">
  {#each items as item (item.path)}
    <NavItem
      currentUrl={page.url}
      path={item.path}
      text={item.text}
      icon={item.icon}
      class="px-3 py-2 text-sm hover:bg-surface-200"
      classes={{ active: 'bg-primary/10 text-primary font-medium' }}
    />
  {/each}
</nav>
