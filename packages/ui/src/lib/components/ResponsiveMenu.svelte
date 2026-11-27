<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { DrawerProps } from './Drawer.svelte';
  import type { MenuProps } from './Menu.svelte';

  export type ResponsiveMenuProps = {
    /** Bindable */
    open?: boolean;
    /** Viewport width at or above which a `Menu` is used instead of a `Drawer` */
    screenWidth?: number;
    menuProps?: MenuProps;
    drawerProps?: DrawerProps;
    class?: string;
    onClose?: () => void;
    children?: Snippet<[{ open: boolean }]>;
  };
</script>

<script lang="ts">
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import { cls } from '@layerstack/tailwind';

  import Drawer from './Drawer.svelte';
  import Menu from './Menu.svelte';

  let {
    open = $bindable(true),
    screenWidth = 768,
    menuProps,
    drawerProps,
    class: className,
    onClose,
    children,
  }: ResponsiveMenuProps = $props();

  const media = new MediaQueryPresets();
  // The breakpoint is fixed for the lifetime of the component
  // svelte-ignore state_referenced_locally
  const isLargeScreen = media.width(screenWidth);
</script>

{#if isLargeScreen.current}
  <!-- `explicitClose` by default, to match the drawer's behavior -->
  <Menu
    bind:open
    explicitClose
    onClose={() => onClose?.()}
    {...menuProps}
    class={cls('ResponsiveMenu', className, menuProps?.class)}
  >
    {@render children?.({ open })}
  </Menu>
{:else}
  <Drawer
    bind:open
    placement="bottom"
    {onClose}
    {...drawerProps}
    class={cls('ResponsiveMenu', className, drawerProps?.class)}
  >
    {@render children?.({ open })}
  </Drawer>
{/if}
