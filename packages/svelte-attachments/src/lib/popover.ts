import type { Attachment } from 'svelte/attachments';
import {
  computePosition,
  autoUpdate,
  flip,
  offset,
  shift,
  autoPlacement,
  size,
  type Alignment,
  type ComputePositionConfig,
  type OffsetOptions,
  type Placement,
} from '@floating-ui/dom';

import { portal } from './portal.js';

export type PopoverOptions = {
  /** Element to anchor against.  Defaults to the node's parent */
  anchorEl?: Element | HTMLElement;
  placement?: Placement;
  /** Offset between the anchor and the popover */
  offset?: OffsetOptions;
  /** Shift the popover if it is within this distance of the viewport edge */
  padding?: number;
  /** Place the popover on whichever side of the viewport has more space */
  autoPlacement?: boolean;
  /** Match the popover's width to the anchor's */
  matchWidth?: boolean;
  /** Constrain the popover to the space remaining between the anchor and the viewport edge */
  resize?: boolean | 'width' | 'height';
  /**
   * Called when a click completes outside both the anchor and the popover.  Replaces the
   * `clickOutside` custom event dispatched by `@layerstack/svelte-actions`.
   */
  onClickOutside?: (event: MouseEvent) => void;
};

/** Position an element against an anchor using floating-ui, portaled out of the DOM hierarchy */
export function popover(options: PopoverOptions = {}): Attachment<Element | HTMLElement> {
  return (node: Element | HTMLElement) => {
    const popoverEl = node as HTMLElement;
    const anchorEl = options.anchorEl ?? node.parentElement;

    if (!anchorEl) {
      return;
    }

    const cleanupAutoUpdate = autoUpdate(anchorEl, popoverEl, () => {
      // Only allow autoPlacement to swap sides (ex. top/bottom) and not also axes (ex. left/right).
      // Matches `flip` behavior.
      const alignment =
        options.autoPlacement && options.placement
          ? (options.placement.split('-')[1] as Alignment)
          : undefined;
      const allowedPlacements =
        options.autoPlacement && options.placement
          ? [options.placement, getOppositePlacement(options.placement)]
          : undefined;

      const positionOptions: ComputePositionConfig = {
        placement: options.placement,
        middleware: [
          offset(options.offset),
          options.autoPlacement ? autoPlacement({ alignment, allowedPlacements }) : flip(),
          options.resize &&
            size({
              padding: options.padding,
              apply({ availableWidth, availableHeight, elements }) {
                Object.assign(elements.floating.style, {
                  ...((options.resize === true || options.resize === 'width') && {
                    maxWidth: `${availableWidth}px`,
                  }),
                  ...((options.resize === true || options.resize === 'height') && {
                    maxHeight: `${availableHeight}px`,
                  }),
                });
              },
            }),
          shift({ padding: options.padding }),
        ],
      };

      computePosition(anchorEl, popoverEl, positionOptions).then(({ x, y }) => {
        Object.assign(popoverEl.style, {
          left: `${x}px`,
          top: `${y}px`,
          ...(options.matchWidth && {
            width: `${(anchorEl as HTMLElement).offsetWidth}px`,
          }),
        });
      });
    });

    // Track whether the mouse changed targets between `mousedown` and `mouseup` (ex. dragging from
    // within an input out to the body).  Better control than `click`.
    let clickTarget: EventTarget | null = null;
    function onMouseDown(e: MouseEvent) {
      clickTarget = e.target;
    }

    function onMouseUp(e: MouseEvent) {
      if (
        e.target instanceof HTMLElement &&
        clickTarget === e.target &&
        !anchorEl?.contains(e.target) &&
        !popoverEl.contains(e.target)
      ) {
        options.onClickOutside?.(e);
      }
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    const cleanupPortal = portal({})(popoverEl);

    return () => {
      cleanupAutoUpdate();
      cleanupPortal?.();
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  };
}

// See: https://github.com/floating-ui/floating-ui/blob/master/packages/core/src/utils/getOppositePlacement.ts (not exported)
const hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };

export function getOppositePlacement<T extends string>(placement: T): T {
  return placement.replace(/left|right|bottom|top/g, (matched) => (hash as any)[matched]) as T;
}
