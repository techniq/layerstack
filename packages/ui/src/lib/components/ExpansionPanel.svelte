<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { CollapseProps } from './Collapse.svelte';

  type ExpansionPanelOwnProps = {
    /**
     * How first/last and the gap between are calculated
     *   - `type`: items are of the same type
     *   - `parent`: items share a common parent
     *   - `group`: closest element with a `group` class
     */
    list?: 'type' | 'parent' | 'group';
    /** Hide the expand affordance, for a panel with nothing to reveal */
    disabled?: boolean;
    class?: string;
    classes?: {
      root?: string;
      toggle?: string;
    };
    trigger?: Snippet<[{ open: boolean }]>;
    /** Rendered inside the collapsible area, above `children` — so it appears only when expanded */
    actions?: Snippet;
    children?: Snippet;
  };

  export type ExpansionPanelProps = ExpansionPanelOwnProps &
    Omit<CollapseProps, keyof ExpansionPanelOwnProps | 'popout'>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Collapse from './Collapse.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    list = 'parent',
    disabled = false,
    class: className,
    classes = {},
    trigger,
    actions,
    children,
    ...restProps
  }: ExpansionPanelProps = $props();

  const settingsClasses = getComponentClasses('ExpansionPanel');

  const enabled = $derived(children !== undefined && !disabled);
</script>

<Collapse
  {...restProps}
  classes={{
    root: cls(
      'ExpansionPanel',
      'bg-surface-100 elevation-1 border-t',
      // Match ListItem (used for loading) so the stacking context is consistent, otherwise a solid
      // line appears between an ExpansionPanel and a ListItem
      'relative',
      list === 'type' && 'first-of-type:border-t-0 first-of-type:rounded-t last-of-type:rounded-b',
      list === 'parent' && 'first:border-t-0 first:rounded-t last:rounded-b',
      list === 'group' && 'group-first:border-t-0 group-first:rounded-t group-last:rounded-b',
      settingsClasses.root,
      classes.root,
      className
    ),
    icon: cls('text-surface-content/30 px-2', !enabled && 'hidden'),
  }}
  popout
  {list}
  {disabled}
  {trigger}
>
  {@render actions?.()}

  {#if enabled}
    <div class={cls('px-3 pt-2 pb-3', settingsClasses.toggle, classes.toggle)}>
      {@render children?.()}
    </div>
  {/if}
</Collapse>
