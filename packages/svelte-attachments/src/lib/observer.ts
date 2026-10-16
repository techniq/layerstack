import type { Attachment } from 'svelte/attachments';
import { getScrollParent } from '@layerstack/utils';

export type ResizeOptions = ResizeObserverOptions & {
  /** Called for each `ResizeObserver` entry */
  onResize?: (entry: ResizeObserverEntry) => void;
};

/** Observe size changes.  Replaces the `resize` custom event with an `onResize` callback */
export function resize(options: ResizeOptions = {}): Attachment<Element> {
  return (node: Element) => {
    const { onResize, ...observerOptions } = options;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) onResize?.(entry);
    });
    observer.observe(node, observerOptions);

    return () => observer.disconnect();
  };
}

export type IntersectionOptions = IntersectionObserverInit & {
  /** Called whenever the intersection with the root changes */
  onIntersecting?: (entry: IntersectionObserverEntry) => void;
};

/**
 * Observe intersection with the nearest scroll parent (or the viewport).  Replaces the
 * `intersecting` custom event with an `onIntersecting` callback.
 */
export function intersection(options: IntersectionOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const { onIntersecting, ...observerOptions } = options;

    const scrollParent = getScrollParent(node);
    // Use the viewport (null) when the scroll parent is `<body>`
    const root = scrollParent === document.body ? null : scrollParent;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) onIntersecting?.(entry);
      },
      { root, ...observerOptions }
    );
    observer.observe(node);

    return () => observer.disconnect();
  };
}

export type MutateOptions = MutationObserverInit & {
  /** Called with each batch of mutations */
  onMutate?: (mutations: MutationRecord[]) => void;
};

/** Observe DOM mutations.  Replaces the `mutate` custom event with an `onMutate` callback */
export function mutate(options: MutateOptions = {}): Attachment<Element> {
  return (node: Element) => {
    const { onMutate, ...observerOptions } = options;

    const observer = new MutationObserver((mutations) => onMutate?.(mutations));
    observer.observe(node, observerOptions);

    return () => observer.disconnect();
  };
}
