<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type AppLayoutOwnProps = {
    navWidth?: number;
    headerHeight?: number;
    /** Whether the header spans the full width, or the nav runs full height */
    headerPosition?: 'full' | 'inset';
    class?: string;
    classes?: {
      root?: string;
      aside?: string;
      nav?: string;
    };
    nav?: Snippet;
    children?: Snippet;
  };

  export type AppLayoutProps = AppLayoutOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof AppLayoutOwnProps>;
</script>

<script lang="ts">
  import { BROWSER } from 'esm-env';
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import { cls } from '@layerstack/tailwind';

  import Backdrop from './Backdrop.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    navWidth = 240,
    headerHeight = 64,
    headerPosition = 'full',
    class: className,
    classes = {},
    nav,
    children,
    ...restProps
  }: AppLayoutProps = $props();

  const settingsClasses = getComponentClasses('AppLayout');
  const settings = getSettings();
  const media = new MediaQueryPresets();

  const temporaryDrawer = $derived(BROWSER ? !media.mdScreen.current : false);
</script>

<div
  {...restProps}
  style:--headerHeight="{headerHeight}px"
  style:--drawerWidth="{settings.showDrawer ? navWidth : 0}px"
  style:--navWidth="{navWidth}px"
  class={cls(
    'AppLayout',
    '[&>header]:fixed [&>header]:top-0 [&>header]:h-[var(--headerHeight)] [&>header]:transition-all',
    headerPosition === 'full' || temporaryDrawer
      ? '[&>header]:w-full'
      : '[&>header]:w-[calc(100%-var(--drawerWidth))] [&>header]:left-[var(--drawerWidth)] [&>header]:duration-500',
    'md:[&>main]:ml-(--drawerWidth) [&>main]:mt-[var(--headerHeight)] [&>main]:transition-[margin] [&>main]:duration-500',
    /* Offset scrolling for headings or any element with an id (`<a href="#id">`) */
    '[:where(&_[id])]:scroll-m-[var(--headerHeight)]',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {@render children?.()}

  <!-- Rendered before <aside> so the stacking order is correct -->
  {#if settings.showDrawer && temporaryDrawer}
    <Backdrop onclick={() => (settings.showDrawer = false)} class="z-50" />
  {/if}

  <aside
    class={cls(
      'fixed top-0 h-[calc(100%-var(--headerHeight))] w-[var(--drawerWidth)] transition-all duration-500 overflow-hidden',
      // Hide the drawer during SSR below `md`, matching the hydrated result
      !BROWSER && 'max-md:hidden',
      temporaryDrawer
        ? 'fixed h-full z-50 elevation-10'
        : headerPosition === 'full'
          ? 'mt-[var(--headerHeight)]'
          : '',
      settingsClasses.aside,
      classes.aside
    )}
  >
    <nav
      class={cls(
        'nav h-full overflow-auto overscroll-contain w-[var(--navWidth)]',
        settingsClasses.nav,
        classes.nav
      )}
    >
      {@render nav?.()}
    </nav>
  </aside>
</div>
