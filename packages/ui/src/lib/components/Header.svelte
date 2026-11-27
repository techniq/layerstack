<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type HeaderOwnProps = {
    /** A string, or an array rendered as a `Breadcrumb` */
    title?: string | string[] | null;
    /** A string, or an array rendered as a `Breadcrumb` */
    subheading?: string | string[] | null;
    class?: string;
    classes?: {
      root?: string;
      container?: string;
      title?: string;
      subheading?: string;
    };
    avatar?: Snippet;
    titleSnippet?: Snippet;
    subheadingSnippet?: Snippet;
    actions?: Snippet;
  };

  export type HeaderProps = HeaderOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof HeaderOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Breadcrumb from './Breadcrumb.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    title = null,
    subheading = null,
    class: className,
    classes = {},
    avatar,
    titleSnippet,
    subheadingSnippet,
    actions,
    ...restProps
  }: HeaderProps = $props();

  const settingsClasses = getComponentClasses('Header');
</script>

<div
  {...restProps}
  class={cls('Header', 'flex items-center gap-4', settingsClasses.root, classes.root, className)}
>
  {@render avatar?.()}

  <div class={cls('flex-1', classes.container)}>
    {#if titleSnippet}
      {@render titleSnippet()}
    {:else if title}
      {#if Array.isArray(title)}
        <Breadcrumb items={title} class="text-lg" />
      {:else}
        <div class={cls('text-lg', classes.title)}>{title}</div>
      {/if}
    {/if}

    {#if subheadingSnippet}
      {@render subheadingSnippet()}
    {:else if subheading}
      {#if Array.isArray(subheading)}
        <Breadcrumb
          items={subheading}
          class={cls('text-sm text-surface-content/50', classes.subheading)}
        />
      {:else}
        <div class={cls('text-sm text-surface-content/50', classes.subheading)}>{subheading}</div>
      {/if}
    {/if}
  </div>

  {@render actions?.()}
</div>
