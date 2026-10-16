<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  import type { IconProp } from '../types/index.js';
  import type { IconProps } from './Icon.svelte';

  type NavItemOwnProps = {
    currentUrl: URL;
    path: string;
    text?: string;
    icon?: IconProp | IconProps;
    class?: string;
    classes?: {
      root?: string;
      active?: string;
      icon?: IconProps['classes'];
    };
    avatar?: Snippet;
    children?: Snippet;
  };

  export type NavItemProps = NavItemOwnProps & Omit<HTMLAnchorAttributes, keyof NavItemOwnProps>;
</script>

<script lang="ts">
  import { isActive, url } from '@layerstack/utils/routing';
  import { scrollIntoView } from '@layerstack/svelte-attachments';
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';

  let {
    currentUrl,
    path,
    text = '',
    icon,
    class: className,
    classes = {},
    onclick,
    avatar,
    children,
    ...restProps
  }: NavItemProps = $props();

  const settingsClasses = getComponentClasses('NavItem');
  const settings = getSettings();
  const media = new MediaQueryPresets();

  const isPathActive = $derived(path ? isActive(currentUrl, path) : false);
</script>

<a
  {...restProps}
  href={url(currentUrl, path)}
  class={cls(
    'NavItem',
    'flex items-center',
    settingsClasses.root,
    classes.root,
    className,
    isPathActive && ['is-active', settingsClasses.active, classes.active]
  )}
  onclick={(e) => {
    // Close the drawer when it is temporary (narrow viewports)
    if (!media.mdScreen.current) {
      settings.showDrawer = false;
    }
    onclick?.(e);
  }}
  {@attach scrollIntoView({
    condition: isPathActive,
    onlyIfNeeded: true,
    delay: 500,
  })}
>
  {@render avatar?.()}

  {#if icon}
    {#if typeof icon === 'function' || typeof icon === 'string' || 'icon' in icon}
      <Icon
        data={asIconData(icon)}
        class={cls('mr-3 shrink-0', settingsClasses.icon)}
        classes={classes.icon}
      />
    {:else}
      <Icon class={cls('mr-3 shrink-0', settingsClasses.icon)} classes={classes.icon} {...icon} />
    {/if}
  {/if}

  {text}

  {@render children?.()}
</a>
