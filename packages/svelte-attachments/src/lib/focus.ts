import type { Attachment } from 'svelte/attachments';
import { delay } from '@layerstack/utils';

export function focusMove(
  options: { restoreFocus?: boolean; delay?: number; disabled?: boolean } = {
    restoreFocus: false,
    delay: 0,
    disabled: false,
  }
): Attachment<HTMLElement | SVGElement> {
  return (node: HTMLElement | SVGElement) => {
    let previousActiveElement: Element | null = null;

    if (!options.disabled) {
      previousActiveElement = document.activeElement;

      // Set `tabIndex` to `-1` which makes any element (ex. div) focusable programmaitcally (and mouse), but not via keyboard navigation - https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
      node.tabIndex = -1;

      // Appear to need to wait for tabIndex to update before applying focus
      delay(options.delay ?? 0).then(() => {
        node.focus();
      });
    }

    return () => {
      // Restore previous active element
      if (
        !options.disabled &&
        options.restoreFocus &&
        previousActiveElement instanceof HTMLElement
      ) {
        previousActiveElement.focus();
      }
    };
  };
}

// TODO: Add `focusTrap`
// https://css-tricks.com/a-css-approach-to-trap-focus-inside-of-an-element/
// export function focusTrap(): Attachment<HTMLElement> {
//   return (node: HTMLElement) => {
//     // TODO: Implementation
//     return () => {
//       // cleanup
//     };
//   };
// }
