<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { HeaderProps } from './Header.svelte';

  type CardOwnProps = {
    title?: string | string[] | null;
    subheading?: string | string[] | null;
    /** Cover the card with a loading overlay */
    loading?: boolean | null;
    class?: string;
    classes?: {
      root?: string;
      header?: HeaderProps['classes'];
      headerContainer?: string;
      content?: string;
      actions?: string;
    };
    /** Replaces the default `Header` */
    header?: Snippet;
    /** Rendered in a padded content area below `children` */
    contents?: Snippet;
    /** Rendered in a footer bar */
    actions?: Snippet;
    children?: Snippet;
  };

  export type CardProps = CardOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof CardOwnProps>;
</script>

<script lang="ts">
  import { cls, clsMerge } from '@layerstack/tailwind';

  import Header from './Header.svelte';
  import Overlay from './Overlay.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    title = null,
    subheading = null,
    loading = null,
    class: className,
    classes = {},
    header,
    contents,
    actions,
    children,
    ...restProps
  }: CardProps = $props();

  const settingsClasses = getComponentClasses('Card');
</script>

<!--
  `position: relative` sets a container for `position: absolute` children (ex. Overlay), and with
  `z-index` establishes a stacking context so children (Overlay, sticky columns, ...) do not
  overlap other components
-->
<div
  {...restProps}
  class={cls(
    'Card',
    'relative z-0 bg-surface-100 border rounded-sm elevation-1 flex flex-col justify-between',
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

  {#if title || subheading || header}
    <div class={cls('p-4', settingsClasses.headerContainer, classes.headerContainer)}>
      {#if header}
        {@render header()}
      {:else}
        <Header {title} {subheading} classes={clsMerge(settingsClasses.header, classes.header)} />
      {/if}
    </div>
  {/if}

  {@render children?.()}

  {#if contents}
    <div class={cls('px-4 flex-1', settingsClasses.content, classes.content)}>
      {@render contents()}
    </div>
  {/if}

  {#if actions}
    <div class={cls('py-2 px-1', settingsClasses.actions, classes.actions)}>
      {@render actions()}
    </div>
  {/if}
</div>
