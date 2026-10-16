<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { FadeParams } from 'svelte/transition';
  import type { PortalOptions } from '@layerstack/svelte-attachments';

  type BackdropOwnProps = {
    /** Blur the content behind the backdrop */
    blur?: boolean;
    /** Render outside the current DOM hierarchy */
    portal?: PortalOptions;
    class?: string;
    fadeParams?: FadeParams;
    children?: Snippet;
  };

  export type BackdropProps = BackdropOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BackdropOwnProps>;
</script>

<script lang="ts">
  import { fade } from 'svelte/transition';
  import { portal as portalAttachment } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    blur = false,
    portal = false,
    class: className,
    fadeParams = { duration: 300 },
    children,
    ...restProps
  }: BackdropProps = $props();

  const settingsClasses = getComponentClasses('Backdrop');
</script>

<div
  role="none"
  {...restProps}
  class={cls(
    'Backdrop',
    'fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-surface-content/50 dark:bg-surface-300/70',
    blur && 'backdrop-blur-xs',
    settingsClasses.root,
    className
  )}
  in:fade|global={fadeParams}
  out:fade={fadeParams}
  {@attach portalAttachment(portal)}
>
  {@render children?.()}
</div>
