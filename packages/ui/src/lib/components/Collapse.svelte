<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TransitionConfig } from 'svelte/transition';

  import type { IconProp, TransitionParams } from '../types/index.js';

  type CollapseOwnProps = {
    /** Default trigger label */
    name?: string;
    /** This item's value when used as part of an accordion via `group` */
    value?: any;
    /** Bindable.  Shared across a set of `Collapse`s so only one is open at a time */
    group?: any;
    /** Bindable */
    open?: boolean;
    /** Add vertical spacing when open */
    popout?: boolean;
    disabled?: boolean;
    icon?: IconProp;
    transition?: (node: HTMLElement, params: TransitionParams) => TransitionConfig;
    transitionParams?: TransitionParams;
    class?: string;
    classes?: {
      root?: string;
      trigger?: string;
      icon?: string;
      content?: string;
    };
    /**
     * How first/last and the gap between are calculated
     *   - `type`: items are of the same type
     *   - `parent`: items share a common parent
     *   - `group`: closest element with a `group` class
     */
    list?: 'type' | 'parent' | 'group';
    /** Called when the open state changes */
    onChange?: (detail: { open: boolean; name: string }) => void;
    /** Replaces the default trigger label */
    trigger?: Snippet<[{ open: boolean }]>;
    /** Replaces the default chevron */
    iconSnippet?: Snippet<[{ open: boolean }]>;
    children?: Snippet<[{ open: boolean }]>;
  };

  export type CollapseProps = CollapseOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof CollapseOwnProps>;
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getSettings } from './settingsState.svelte.js';
  import { getComponentClasses } from './theme.js';
  import { asIconData } from '../utils/icons.js';

  const settings = getSettings();

  let {
    name = '',
    value,
    group = $bindable(),
    open = $bindable(false),
    popout = false,
    disabled = false,
    icon,
    transition = slide,
    transitionParams = {},
    class: className,
    classes = {},
    list = 'parent',
    onChange,
    trigger,
    iconSnippet,
    children,
    ...restProps
  }: CollapseProps = $props();

  const settingsClasses = getComponentClasses('Collapse');

  const resolvedIcon = $derived(icon ?? settings.icons.chevronDown);

  // When part of a group, membership decides the open state
  const isOpen = $derived(group !== undefined ? group === value : open);

  // Seeded with the initial state so `onChange` does not fire on mount
  // svelte-ignore state_referenced_locally
  let lastOpen = isOpen;
  $effect(() => {
    if (isOpen === lastOpen) return;
    lastOpen = isOpen;
    onChange?.({ open: isOpen, name });
  });
</script>

<div
  {...restProps}
  class={cls(
    'Collapse',
    popout && 'transition-all duration-all',
    popout && isOpen && 'my-3',
    popout && list === 'type' && 'first-of-type:mt-0 last-of-type:mb-0',
    popout && list === 'parent' && 'first:mt-0 last:mb-0',
    popout && list === 'group' && 'group-first:mt-0 group-last:mb-0',
    settingsClasses.root,
    classes.root,
    className
  )}
  aria-expanded={isOpen}
>
  <button
    type="button"
    class="flex items-center w-full text-left select-text focus:outline-hidden"
    {disabled}
    onclick={() => {
      open = !isOpen;
      group = group === value ? undefined : value;
    }}
  >
    {#if trigger}
      {@render trigger({ open: isOpen })}
    {:else}
      <span class={cls('flex-1', settingsClasses.trigger, classes.trigger)}>{name}</span>
    {/if}

    {#if iconSnippet}
      {@render iconSnippet({ open: isOpen })}
    {:else}
      <div
        data-open={isOpen}
        style:--duration="{transitionParams.duration ?? 300}ms"
        class={cls(
          'transition-all duration-[var(--duration)] transform',
          'data-[open=true]:-rotate-180',
          settingsClasses.icon,
          classes.icon
        )}
      >
        <Icon data={asIconData(resolvedIcon)} />
      </div>
    {/if}
  </button>

  {#if isOpen}
    <div
      transition:transition={transitionParams}
      class={cls(settingsClasses.content, classes.content)}
    >
      {@render children?.({ open: isOpen })}
    </div>
  {/if}
</div>
