import type { Attachment } from 'svelte/attachments';
import { focusMove } from './focus.js';

/**
 * Auto focus node when rendered.  Useful for inputs
 */
export function autoFocus(
  options?: Parameters<typeof focusMove>['0']
): Attachment<HTMLElement | SVGElement> {
  // Delay by 5ms by default since Dialog/Drawer/Menu also call `focusMove` but with default `0ms` delay, and we want to focus last
  // Chrome works with `1ms`, but Firefox required `2ms` and Safari required `3ms`, so using `5ms` as a buffer
  return focusMove({ delay: 5, ...options });
}

/**
 * Selects the text inside a text node when the node is focused
 */
export function selectOnFocus(): Attachment<HTMLInputElement | HTMLTextAreaElement> {
  return (node: HTMLInputElement | HTMLTextAreaElement) => {
    const handleFocus = (event: Event) => {
      node.select();
    };

    node.addEventListener('focus', handleFocus);

    return () => {
      node.removeEventListener('focus', handleFocus);
    };
  };
}

/**
 * Blurs the node when Escape is pressed
 */
export function blurOnEscape(): Attachment<HTMLInputElement | HTMLTextAreaElement> {
  return (node: HTMLInputElement | HTMLTextAreaElement) => {
    const handleKey = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        node.blur();
      }
    };

    node.addEventListener('keydown', handleKey);

    return () => {
      node.removeEventListener('keydown', handleKey);
    };
  };
}

/**
 * Automatically resize textarea based on content
 * See:
 *  - https://svelte.dev/repl/ead0f1fcd2d4402bbbd64eca1d665341?version=3.14.1
 *  - https://svelte.dev/repl/f1a7e24a08a54947bb4447f295c741fb?version=3.14.1
 */
export function autoHeight(): Attachment<HTMLTextAreaElement> {
  return (node: HTMLTextAreaElement) => {
    function resize({ target }: { target: EventTarget | null }) {
      if (target instanceof HTMLElement) {
        target.style.height = '1px';
        target.style.height = +target.scrollHeight + 'px';
      }
    }

    node.style.overflow = 'hidden';
    node.addEventListener('input', resize);

    // Resize initially
    resize({ target: node });

    return () => {
      node.removeEventListener('input', resize);
    };
  };
}

/**
 * Debounce event handler (change, input, etc)
 */
export function debounceEvent(
  options?: { type: string; listener: (e: Event) => any; timeout?: number } | null
): Attachment<HTMLInputElement | HTMLTextAreaElement> {
  return (node: HTMLInputElement | HTMLTextAreaElement) => {
    let lastTimeoutId: ReturnType<typeof setTimeout>;

    if (options) {
      const { type, listener, timeout } = options;

      function onEvent(e: Event) {
        clearTimeout(lastTimeoutId);
        lastTimeoutId = setTimeout(() => {
          listener(e);
        }, timeout ?? 300);
      }

      node.addEventListener(type, onEvent);

      return () => {
        node.removeEventListener(type, onEvent);
        clearTimeout(lastTimeoutId);
      };
    }

    return () => {
      clearTimeout(lastTimeoutId);
    };
  };
}
