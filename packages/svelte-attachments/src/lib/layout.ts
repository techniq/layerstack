import type { Attachment } from 'svelte/attachments';

export type RemainingViewportOptions = {
  /** Set `max-height`/`max-width` instead of `height`/`width` */
  max?: boolean;
  offset?: number;
  enabled?: boolean;
};

/** Set `height` (or `max-height`) to the viewport height below the node's current top */
export function remainingViewportHeight(
  options: RemainingViewportOptions = {}
): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const property = options.max ? 'max-height' : 'height';

    if (options.enabled === false) {
      node.style.removeProperty(property);
      return;
    }

    const viewportClientTop = node.getBoundingClientRect().top;
    node.style.setProperty(
      property,
      `calc(100vh - ${viewportClientTop}px - ${options.offset ?? 0}px)`
    );

    return () => node.style.removeProperty(property);
  };
}

/** Set `width` (or `max-width`) to the viewport width right of the node's current left edge */
export function remainingViewportWidth(
  options: RemainingViewportOptions = {}
): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    // TODO: Find a way to update when the viewport location changes (ex. closing a side drawer).
    // A ResizeObserver does not cover these cases; an absolutely positioned sentinel element looks
    // promising: https://stackoverflow.com/questions/40251082/an-event-or-observer-for-changes-to-getboundingclientrect
    const property = options.max ? 'max-width' : 'width';

    if (options.enabled === false) {
      node.style.removeProperty(property);
      return;
    }

    const viewportClientLeft = node.getBoundingClientRect().left;
    node.style.setProperty(
      property,
      `calc(100vw - ${viewportClientLeft}px - ${options.offset ?? 0}px)`
    );

    return () => node.style.removeProperty(property);
  };
}

export type OverflowOptions = {
  /** Called when the overflow amount on either axis changes */
  onOverflow?: (detail: { overflowX: number; overflowY: number }) => void;
};

/**
 * Watch for overflow changes on either axis.  Replaces the `overflow` custom event with an
 * `onOverflow` callback.
 */
export function overflow(options: OverflowOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    let overflowX = 0;
    let overflowY = 0;

    function update() {
      const prevOverflowX = overflowX;
      overflowX = node.scrollWidth - node.clientWidth;

      const prevOverflowY = overflowY;
      overflowY = node.scrollHeight - node.clientHeight;

      if (overflowX !== prevOverflowX || overflowY !== prevOverflowY) {
        options.onOverflow?.({ overflowX, overflowY });
      }
    }

    // Update when the node is resized (and on initial mount)
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);

    // Update when children (or grandchildren) are added/removed.  Watching attributes without a
    // filter locks up the browser, so it is left out.
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(node, { childList: true, subtree: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  };
}
