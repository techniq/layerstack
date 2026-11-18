<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { IconProp } from '../types/index.js';

  type AppBarOwnProps = {
    title?: string | number | Array<string | number>;
    /** Icon for the drawer toggle.  `null` hides it */
    menuIcon?: IconProp | null;
    /** Update `document.title` from `title` */
    head?: boolean;
    class?: string;
    /** Replaces the drawer toggle button */
    menuIconSnippet?: Snippet<[{ toggleMenu: () => void; isMenuOpen: boolean }]>;
    titleSnippet?: Snippet;
    actions?: Snippet;
    children?: Snippet;
  };

  export type AppBarProps = AppBarOwnProps &
    Omit<HTMLAttributes<HTMLElement>, keyof AppBarOwnProps>;
</script>

<script lang="ts">
  import { BROWSER } from 'esm-env';
  import { cls } from '@layerstack/tailwind';

  import Breadcrumb from './Breadcrumb.svelte';
  import Button from './Button.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';

  const settings = getSettings();
  const settingsClasses = getComponentClasses('AppBar');

  let {
    title = '',
    menuIcon,
    head = true,
    class: className,
    menuIconSnippet,
    titleSnippet,
    actions,
    children,
    ...restProps
  }: AppBarProps = $props();

  const resolvedMenuIcon = $derived(menuIcon === undefined ? settings.icons.menu : menuIcon);

  const titleString = $derived(
    Array.isArray(title) ? title.filter((x) => x).join(' › ') : title.toString()
  );

  $effect(() => {
    // `<svelte:head>` alone does not always update an already-rendered document title
    if (BROWSER && head) {
      document.title = titleString;
    }
  });

  function toggleMenu() {
    settings.showDrawer = !settings.showDrawer;
  }
</script>

<header
  {...restProps}
  class={cls('AppBar', 'px-4 flex items-center relative z-50', settingsClasses.root, className)}
>
  {#if resolvedMenuIcon}
    {#if menuIconSnippet}
      {@render menuIconSnippet({ toggleMenu, isMenuOpen: settings.showDrawer })}
    {:else}
      <Button icon={asIconData(resolvedMenuIcon)} onclick={toggleMenu} class="p-3" />
    {/if}
  {/if}

  {#if titleSnippet}
    {@render titleSnippet()}
  {:else}
    <div class="ml-2 text-lg font-medium">
      {#if typeof title === 'string' || typeof title === 'number'}
        {title}
      {:else}
        <Breadcrumb items={title} class="gap-2" />
      {/if}
    </div>
  {/if}

  {@render children?.()}

  <div class="flex-1 grid justify-end">
    {@render actions?.()}
  </div>
</header>

<svelte:head>
  {#if head}
    <title>{titleString}</title>
  {/if}
</svelte:head>
