import type { Attachment } from 'svelte/attachments';
import { isVisibleInScrollParent, scrollIntoView as scrollIntoViewUtil } from '@layerstack/utils';

export type ScrollIntoViewOptions = {
  condition?: boolean | ((node: HTMLElement) => boolean);
  /** Only scroll if needed (not visible in the scroll parent).  Similar to the non-standard `scrollIntoViewIfNeeded()` */
  onlyIfNeeded?: boolean;
  delay?: number;
};

/** Scroll an element into view when `condition` is met */
export function scrollIntoView(options: ScrollIntoViewOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const condition =
      typeof options.condition === 'function' ? options.condition(node) : options.condition;

    const needed = options.onlyIfNeeded ? !isVisibleInScrollParent(node) : true;

    if (condition && needed) {
      const timeoutId = setTimeout(() => scrollIntoViewUtil(node), options.delay ?? 0);
      return () => clearTimeout(timeoutId);
    }
  };
}
