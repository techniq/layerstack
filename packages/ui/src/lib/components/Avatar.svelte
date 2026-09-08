<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { IconProp } from '../types/index.js';

  type AvatarOwnProps = {
    size?: 'sm' | 'md' | 'lg' | 'unset';
    icon?: IconProp;
    class?: string;
    children?: Snippet;
  };

  export type AvatarProps = AvatarOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof AvatarOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getComponentClasses } from './theme.js';
  import { asIconData } from '../utils/icons.js';

  let { size = 'md', icon, class: className, children, ...restProps }: AvatarProps = $props();

  const settingsClasses = getComponentClasses('Avatar');
</script>

<div
  {...restProps}
  class={cls(
    'Avatar',
    'rounded-full inline-flex items-center justify-center shrink-0',
    {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      unset: '',
    }[size],
    settingsClasses.root,
    className
  )}
>
  {#if children}
    {@render children()}
  {:else if icon}
    <Icon data={asIconData(icon)} />
  {/if}
</div>
