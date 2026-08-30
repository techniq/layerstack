<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  import type { IconProp } from '../types/index.js';
  import type { AvatarProps } from './Avatar.svelte';

  type ListItemOwnProps = {
    title?: string | number | null;
    subheading?: string | number | null;
    icon?: IconProp | null;
    /** Wrap the icon in an `Avatar`, optionally with its props */
    avatar?: boolean | AvatarProps | null;
    /**
     * How first/last and the gap between are calculated
     *   - `type`: items are of the same type
     *   - `parent`: items share a common parent
     *   - `group`: closest element with a `group` class (ex. when wrapped for `animate:flip`)
     */
    list?: 'type' | 'parent' | 'group';
    /** Remove the shadow, useful alongside `ring-3` */
    noShadow?: boolean;
    noBackground?: boolean;
    /** Cover the item with a loading overlay */
    loading?: boolean | null;
    class?: string;
    classes?: {
      root?: string;
      avatar?: string;
      icon?: string;
      title?: string;
      subheading?: string;
    };
    avatarSnippet?: Snippet;
    titleSnippet?: Snippet;
    subheadingSnippet?: Snippet;
    actions?: Snippet;
  };

  export type ListItemProps = ListItemOwnProps & Omit<HTMLLiAttributes, keyof ListItemOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import Overlay from './Overlay.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import { getComponentClasses } from './theme.js';
  import { asIconData } from '../utils/icons.js';

  let {
    title = null,
    subheading = null,
    icon = null,
    avatar = null,
    list = 'parent',
    noShadow = false,
    noBackground = false,
    loading = null,
    class: className,
    classes = {},
    avatarSnippet,
    titleSnippet,
    subheadingSnippet,
    actions,
    ...restProps
  }: ListItemProps = $props();

  const settingsClasses = getComponentClasses('ListItem');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
  role="listitem"
  {...restProps}
  class={cls(
    'ListItem',
    'flex gap-4 items-center border-t border-surface-content/10 py-2 px-4',
    // Needed for the loading overlay
    'relative',
    list === 'type' && 'first-of-type:border-t-0 first-of-type:rounded-t last-of-type:rounded-b',
    list === 'parent' && 'first:border-t-0 first:rounded-t last:rounded-b',
    list === 'group' && 'group-first:border-t-0 group-first:rounded-t group-last:rounded-b',
    noShadow !== true && 'elevation-1',
    noBackground !== true && 'bg-surface-100',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {#if loading}
    <Overlay center class="rounded-sm">
      <ProgressCircle />
    </Overlay>
  {/if}

  {#if avatarSnippet}
    {@render avatarSnippet()}
  {:else if icon != null}
    {#if avatar}
      <Avatar
        class={cls(settingsClasses.avatar, classes.avatar)}
        {...typeof avatar === 'object' ? avatar : {}}
      >
        <Icon data={asIconData(icon)} class={cls(settingsClasses.icon, classes.icon)} />
      </Avatar>
    {:else}
      <Icon data={asIconData(icon)} class={cls(settingsClasses.icon, classes.icon)} />
    {/if}
  {/if}

  <div class="grow">
    {#if titleSnippet}
      {@render titleSnippet()}
    {:else if title != null}
      <div class={cls(settingsClasses.title, classes.title)}>{title}</div>
    {/if}

    {#if subheadingSnippet}
      {@render subheadingSnippet()}
    {:else if subheading != null}
      <div
        class={cls(
          'text-sm text-surface-content/50',
          settingsClasses.subheading,
          classes.subheading
        )}
      >
        {subheading}
      </div>
    {/if}
  </div>

  {@render actions?.()}
</li>
