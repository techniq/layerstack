<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { TransitionConfig } from 'svelte/transition';
  import type { Placement } from '@floating-ui/dom';

  import type { TransitionParams } from '../types/index.js';
  import type { PopoverCloseReason, PopoverProps } from './Popover.svelte';

  type MenuOwnProps = {
    /** Bindable */
    open?: boolean;
    /** Offset between the anchor and the menu */
    offset?: number;
    /** Match the menu's width to the anchor's */
    matchWidth?: boolean;
    placement?: Placement;
    /** Place the menu on whichever side of the viewport has more space */
    autoPlacement?: boolean;
    resize?: PopoverProps['resize'];
    disableTransition?: boolean;
    transition?: (node: HTMLElement, params: TransitionParams) => TransitionConfig;
    transitionParams?: TransitionParams;
    /** Keep the menu open when an item is clicked */
    explicitClose?: boolean;
    /** Move focus into the menu when it opens */
    moveFocus?: boolean;
    /** The `<menu>` element.  Bindable */
    menuItemsEl?: HTMLMenuElement | undefined;
    class?: string;
    classes?: {
      root?: string;
      menu?: string;
    };
    /** Called after the menu closes, with the reason it closed */
    onClose?: (reason: PopoverCloseReason) => void;
    /** Receives a `close` callback so items can dismiss the menu */
    children?: Snippet<[{ close: () => void }]>;
  };

  export type MenuProps = MenuOwnProps & Omit<PopoverProps, keyof MenuOwnProps | 'children'>;
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { focusMove } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import Popover from './Popover.svelte';
  import { getComponentSettings } from './settingsState.svelte.js';

  let {
    open = $bindable(false),
    offset = 4,
    matchWidth = false,
    placement = matchWidth ? 'bottom-start' : 'bottom',
    autoPlacement = false,
    resize = false,
    disableTransition = false,
    transition,
    transitionParams,
    explicitClose = false,
    moveFocus = true,
    menuItemsEl = $bindable(undefined),
    class: className,
    classes = {},
    onClose,
    children,
    ...restProps
  }: MenuProps = $props();

  const { classes: settingsClasses, defaults } = getComponentSettings('Menu');

  const resolvedTransition = $derived(
    transition ??
      defaults.transition ??
      (disableTransition ? () => ({}) as TransitionConfig : slide)
  );
  const resolvedTransitionParams = $derived(transitionParams ?? defaults.transitionParams ?? {});

  function close(reason: PopoverCloseReason = 'unknown') {
    if (open) {
      open = false;
      onClose?.(reason);
    }
  }
</script>

<Popover
  {placement}
  {autoPlacement}
  {offset}
  {matchWidth}
  {resize}
  bind:open
  class={cls(
    'Menu',
    'bg-surface-100 rounded-sm shadow-sm border overflow-auto',
    settingsClasses.root,
    classes.root,
    className
  )}
  onClose={close}
  {...restProps}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <menu
    class={cls('menu-items outline-hidden max-h-screen', settingsClasses.menu, classes.menu)}
    bind:this={menuItemsEl}
    onclick={(e) => {
      if (e.target === menuItemsEl) {
        // Clicked within the menu but outside of any item
      } else if (!explicitClose) {
        close('item');
      }
    }}
    onmouseup={(e) => {
      // Do not let the event reach the popover's outside-click detection
      e.stopPropagation();
    }}
    transition:resolvedTransition={resolvedTransitionParams}
    {@attach focusMove({ disabled: !moveFocus })}
  >
    {@render children?.({ close: () => close() })}
  </menu>
</Popover>
