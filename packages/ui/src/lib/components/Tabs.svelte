<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { TabPlacement, TabProps } from './Tab.svelte';

  type TabsOwnProps = {
    /** Bindable */
    value?: any;
    placement?: TabPlacement;
    /** Renders a `Tab` per option when no `children` are supplied */
    options?: { label: string; value: any }[];
    class?: string;
    classes?: {
      root?: string;
      tabs?: string;
      tab?: TabProps['classes'];
      content?: string;
    };
    /** Replaces the generated tabs */
    children?: Snippet;
    /** The selected tab's content */
    content?: Snippet<[{ value: any }]>;
  };

  export type TabsProps = TabsOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TabsOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Tab from './Tab.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    value = $bindable(),
    placement = 'top',
    options = [],
    class: className,
    classes = {},
    children,
    content,
    ...restProps
  }: TabsProps = $props();

  const settingsClasses = getComponentClasses('Tabs');

  const vertical = $derived(placement === 'left' || placement === 'right');
</script>

<div
  {...restProps}
  class={cls(
    'Tabs',
    'overflow-auto flex',
    `placement-${placement}`,
    {
      top: 'flex-col',
      bottom: 'flex-col-reverse',
      left: 'flex-row',
      right: 'flex-row-reverse',
    }[placement],
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <div
    class={cls(
      'flex gap-1 overflow-auto z-1',
      vertical && 'flex-col',
      {
        top: '-mb-px',
        bottom: '-mt-px',
        left: '-mr-px',
        right: '-ml-px',
      }[placement],
      settingsClasses.tabs,
      classes.tabs
    )}
  >
    {#if children}
      {@render children()}
    {:else}
      {#each options as tab (tab.value)}
        <Tab
          {placement}
          selected={value === tab.value}
          onclick={() => (value = tab.value)}
          classes={{ ...settingsClasses.tab, ...classes.tab }}
        >
          {tab.label}
        </Tab>
      {/each}
    {/if}
  </div>

  <div
    class={cls(
      vertical && 'flex-1',
      {
        top: 'border-t',
        bottom: 'border-b',
        left: 'border-l',
        right: 'border-r',
      }[placement],
      settingsClasses.content,
      classes.content
    )}
  >
    {@render content?.({ value })}
  </div>
</div>
