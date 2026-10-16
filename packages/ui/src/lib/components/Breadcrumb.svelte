<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type BreadcrumbOwnProps<TItem> = {
    items?: TItem[];
    /** Text divider rendered between items.  Defaults to a chevron icon */
    divider?: string;
    inline?: boolean;
    class?: string;
    item?: Snippet<[{ item: TItem }]>;
    dividerSnippet?: Snippet;
  };

  export type BreadcrumbProps<TItem> = BreadcrumbOwnProps<TItem> &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BreadcrumbOwnProps<TItem>>;
</script>

<script lang="ts" generics="TItem">
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    items = [],
    divider,
    inline = false,
    class: className,
    item,
    dividerSnippet,
    ...restProps
  }: BreadcrumbProps<TItem> = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
  const settingsClasses = getComponentClasses('Breadcrumb');

  const displayItems = $derived(items?.filter((x) => x != null) ?? []);
</script>

<div
  {...restProps}
  class={cls(
    'Breadcrumb',
    inline ? 'inline-flex' : 'flex',
    'items-center justify-start flex-wrap',
    settingsClasses.root,
    className
  )}
>
  {#each displayItems as entry, index (index)}
    {#if item}
      {@render item({ item: entry })}
    {:else}
      <div class="item">{entry}</div>
    {/if}

    {#if index < displayItems.length - 1}
      {#if dividerSnippet}
        {@render dividerSnippet()}
      {:else if divider}
        <div class="divider opacity-25">{divider}</div>
      {:else}
        <Icon data={icons.chevronRight} class="divider opacity-25" />
      {/if}
    {/if}
  {/each}
</div>
