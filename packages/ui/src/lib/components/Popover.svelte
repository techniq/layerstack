<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { OffsetOptions, Placement } from '@floating-ui/dom';
  import type { PopoverOptions } from '@layerstack/svelte-attachments';

  export type PopoverCloseReason = 'escape' | 'clickOutside' | 'unknown' | (string & {});

  type PopoverOwnProps = {
    /** Bindable */
    open?: boolean;
    placement?: Placement;
    class?: string;
    style?: string;
    /** Place the popover on whichever side of the viewport has more space */
    autoPlacement?: boolean;
    /** Element to anchor against.  Defaults to the popover's parent */
    anchorEl?: Element | HTMLElement;
    /** Offset between the anchor and the popover */
    offset?: OffsetOptions;
    /** Shift the popover if it is within this distance of the viewport edge */
    padding?: number;
    /** Match the popover's width to the anchor's */
    matchWidth?: boolean;
    /** Constrain the popover to the space remaining between the anchor and the viewport edge */
    resize?: PopoverOptions['resize'];
    /** Called after the popover closes, with the reason it closed */
    onClose?: (reason: PopoverCloseReason) => void;
    /** Receives a `close` callback so content can dismiss the popover */
    children?: Snippet<[{ close: () => void }]>;
  };

  export type PopoverProps = PopoverOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof PopoverOwnProps>;
</script>

<script lang="ts">
  import { popover } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    open = $bindable(false),
    placement,
    class: className,
    style,
    autoPlacement = false,
    anchorEl,
    offset = 0,
    padding = 4,
    matchWidth = false,
    resize = false,
    onClose,
    children,
    ...restProps
  }: PopoverProps = $props();

  const settingsClasses = getComponentClasses('Popover');

  function close(reason: PopoverCloseReason = 'unknown') {
    if (open) {
      open = false;
      onClose?.(reason);
    }
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (open && e.key === 'Escape') {
      e.stopPropagation();
      close('escape');
    }
  }}
/>

{#if open}
  <div
    {...restProps}
    class={cls('Popover absolute z-50 outline-hidden', settingsClasses.root, className)}
    {style}
    tabindex="-1"
    {@attach popover({
      anchorEl,
      placement,
      autoPlacement,
      offset,
      padding,
      matchWidth,
      resize,
      onClickOutside: () => close('clickOutside'),
    })}
  >
    {@render children?.({ close: () => close() })}
  </div>
{/if}
