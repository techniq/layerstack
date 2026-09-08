import type { Attachment } from 'svelte/attachments';
import { keys } from '@layerstack/utils';

import { DomTracker } from './domTracker.js';

export type Edge = 'top' | 'bottom' | 'left' | 'right';

export type StickyOptions = {
  [edge in Edge]?: boolean;
};

/*
  TODO
    - [ ] Consider raising a `stuck` event for styling (example: https://svelte.dev/repl/4ad71e00c86c47d29806e17f09ff0869?version=3.35.0)
*/

/** Stick an element to one or more edges of its `stickyContext` parent.  Defaults to `top`. */
export function sticky(options?: StickyOptions): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    // Track changes so they can be reversed when the attachment re-runs or is removed
    const tracker = new DomTracker(node);

    // Default to top sticky if no options passed
    const edges = options ?? { top: true };

    if (keys(edges).some((edge) => edges[edge])) {
      tracker.addStyle('position', 'sticky');
    }

    keys(edges).forEach((edge) => {
      if (!(edges[edge] ?? false)) {
        return;
      }

      switch (edge) {
        case 'top':
          tracker.addStyle(
            'top',
            `calc(var(--sticky-top, 0px) + ${node.offsetTop}px)` // Add offsetTop to parent (for nested table headers)
          );
          break;
        case 'bottom':
          tracker.addStyle('bottom', `calc(var(--sticky-bottom, 0px))`);
          break;
        case 'left':
          // TODO: Determine workaround for reading `node.offsetLeft` having big performance implicaitons
          tracker.addStyle(
            'left',
            // `calc(var(--sticky-left, 0px) + ${node.offsetLeft}px)` // Add offsetLeft to parent (for columns after the first)
            `calc(var(--sticky-left, 0px))`
          );
          break;
        case 'right':
          tracker.addStyle('right', `calc(var(--sticky-right, 0px))`);
          break;
      }
    });

    return () => tracker.reset();
  };
}

export type StickyContextOptions = { type?: 'page' | 'container' };

/** Establish the offsets (`--sticky-top`, `--sticky-bottom`) that `sticky` children position against */
export function stickyContext(options?: StickyContextOptions): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const tracker = new DomTracker(node);
    const type = options?.type ?? 'page';

    let stickyTop = 0;
    let stickyBottom = 0;

    switch (type) {
      case 'page': {
        const marginTop = getComputedStyle(node).marginTop; // Remove marginTop (offsetTop does not include margins)
        stickyTop = node.offsetTop - (parseInt(marginTop) || 0);

        // If any parent is overflow: 'auto', etc, remove their offset top (as they are the scroll container)
        let parent = node.parentElement;
        while (parent) {
          const overflow = getComputedStyle(parent).overflow;

          if (overflow !== 'visible') {
            stickyTop -= parent.offsetTop;
          }
          parent = parent.parentElement;
        }
        break;
      }

      case 'container':
        stickyTop = 0;
        tracker.addStyle('overflow', 'scroll');
        break;

      default:
        console.error(`Unexpected type: ${type}`);
    }

    tracker.addStyle('--sticky-top', `${stickyTop}px`);

    // TODO: Calculate stickyBottom offset instead of always 0 (only useful for last row).  Tricky as rows can be rendered one at a time (ex. HierarchyTable)
    tracker.addStyle('--sticky-bottom', `${stickyBottom}px`);

    return () => tracker.reset();
  };
}
