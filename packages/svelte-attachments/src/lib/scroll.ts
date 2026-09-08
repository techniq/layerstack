import type { Attachment } from 'svelte/attachments';
import { isVisibleInScrollParent, scrollIntoView as scrollIntoViewUtil } from '@layerstack/utils';

import { DomTracker } from './domTracker.js';
import { injectStyles } from './injectStyles.js';

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

type Edge = 'top' | 'bottom' | 'left' | 'right';

export type ScrollShadowEdgeOptions = {
  color?: string;
  /** Maximum shadow offset, in pixels */
  offset?: number;
  blur?: number;
  spread?: number;
  /** Pixels scrolled per pixel of offset, so the shadow eases in rather than snapping */
  scrollRatio?: number;
};

export type ScrollShadowOptions = Partial<Record<Edge, ScrollShadowEdgeOptions>>;

const defaultEdgeOptions = {
  offset: 10,
  blur: 6,
  spread: -7,
  color: 'rgba(0,0,0,0.2)',
  scrollRatio: 5,
};

/**
 * The shadows go on a sticky `::after` rather than the element itself so they paint over the
 * content, and the negative margin keeps that pseudo-element from taking up any space.
 *
 * An inset `box-shadow` set inline on the container would be simpler — no injected rule and no
 * pseudo-element — but an inset shadow paints above the background and *below* the content, so the
 * text would stay at full contrast as it scrolls past the edge.  Painting over the content is the
 * intended look, and was chosen deliberately; do not "simplify" this without changing that.
 */
export const scrollShadowStyles = `
:where([data-scroll-shadow])::after {
  content: '';
  display: block;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin-top: -9999px;
  pointer-events: none;
  box-shadow: var(--scroll-shadow);
}
`;

/**
 * Show an inset shadow on each edge a scroll container can still scroll toward, as an affordance
 * that there is more content that way.
 *
 * Self-contained — the rule for the `::after` that paints the shadows is injected on first use, so
 * this needs no stylesheet import and no CSS framework.
 */
export function scrollShadow(options: ScrollShadowOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    injectStyles(node, 'scroll-shadow', scrollShadowStyles);

    const tracker = new DomTracker(node);

    const resolved = {
      top: { ...defaultEdgeOptions, ...options.top },
      bottom: { ...defaultEdgeOptions, ...options.bottom },
      left: { ...defaultEdgeOptions, ...options.left },
      right: { ...defaultEdgeOptions, ...options.right },
    };

    function onScroll() {
      const { clientWidth, clientHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = node;

      const verticalScrollPercent = scrollTop / (scrollHeight - clientHeight);
      const horizontalScrollPercent = scrollLeft / (scrollWidth - clientWidth);

      const shadows = [];

      if (verticalScrollPercent > 0) {
        const { offset, blur, spread, color, scrollRatio } = resolved.top;
        const o = Math.min(scrollTop / scrollRatio, offset);
        shadows.push(`inset 0px ${o}px ${blur}px ${spread}px ${color}`);
      }

      if (verticalScrollPercent < 1) {
        const { offset, blur, spread, color, scrollRatio } = resolved.bottom;
        const o = Math.min((scrollHeight - clientHeight - scrollTop) / scrollRatio, offset);
        shadows.push(`inset 0px -${o}px ${blur}px ${spread}px ${color}`);
      }

      if (horizontalScrollPercent > 0) {
        const { offset, blur, spread, color, scrollRatio } = resolved.left;
        const o = Math.min(scrollLeft / scrollRatio, offset);
        shadows.push(`inset ${o}px 0px ${blur}px ${spread}px ${color}`);
      }

      if (horizontalScrollPercent < 1) {
        const { offset, blur, spread, color, scrollRatio } = resolved.right;
        const o = Math.min((scrollWidth - clientWidth - scrollLeft) / scrollRatio, offset);
        shadows.push(`inset -${o}px 0px ${blur}px ${spread}px ${color}`);
      }

      node.style.setProperty('--scroll-shadow', shadows.join(', '));
    }

    tracker.addAttribute('data-scroll-shadow', '');
    tracker.addCleanup(() => node.style.removeProperty('--scroll-shadow'));

    // Only when the app has not positioned or scrolled the element itself.  An environment that
    // cannot resolve computed styles reports `''`, which is treated the same as the initial value.
    const { position, overflow } = getComputedStyle(node);
    if (!position || position === 'static') {
      tracker.addStyle('position', 'relative');
    }
    if (!overflow || overflow === 'visible') {
      tracker.addStyle('overflow', 'auto');
    }

    tracker.addEventListener('scroll', onScroll);
    // Update if transitions are used (ex. children with `animate:flip`)
    tracker.addEventListener('transitionend', onScroll);
    tracker.addEventListener('animationend', onScroll);

    // Update when the node is resized (and on initial mount)
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(node);
    tracker.addCleanup(() => resizeObserver.disconnect());

    // TODO: Attributes without a filter cause the browser to lock up
    const mutationObserver = new MutationObserver(onScroll);
    mutationObserver.observe(node, { childList: true, subtree: true });
    tracker.addCleanup(() => mutationObserver.disconnect());

    return () => tracker.reset();
  };
}

export type ScrollFadeOptions = {
  /** Maximum length of the fade, in pixels */
  length?: number;
  /** Pixels scrolled per pixel of fade, so it eases in rather than snapping */
  scrollRatio?: number;
};

/**
 * Fade out the content at each edge a scroll container can still scroll toward, using a mask.
 *
 * Unlike {@link scrollShadow} this needs no stylesheet — a mask can be set inline.
 */
export function scrollFade(options: ScrollFadeOptions = {}): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const tracker = new DomTracker(node);

    const length = options.length ?? 50;
    const scrollRatio = options.scrollRatio ?? 5;

    function onScroll() {
      const { clientWidth, clientHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = node;

      const verticalScrollPercent = scrollTop / (scrollHeight - clientHeight);
      const horizontalScrollPercent = scrollLeft / (scrollWidth - clientWidth);

      let gradient: string | null = null;

      if (scrollHeight !== clientHeight) {
        // Vertically scrollable
        const gradients = [];

        if (verticalScrollPercent > 0) {
          const topLength = Math.min(scrollTop / scrollRatio, length);
          gradients.push(`rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${topLength}px`);
        }

        if (verticalScrollPercent < 1) {
          const bottomLength = Math.min(
            (scrollHeight - clientHeight - scrollTop) / scrollRatio,
            length
          );
          gradients.push(`rgba(0, 0, 0, 1) calc(100% - ${bottomLength}px), rgba(0, 0, 0, 0)`);
        }

        gradient = `linear-gradient(to bottom, ${gradients.join(',')})`;
      } else if (scrollWidth !== clientWidth) {
        // Horizontally scrollable
        const gradients = [];

        if (horizontalScrollPercent > 0) {
          const leftLength = Math.min(scrollLeft / scrollRatio, length);
          gradients.push(`rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${leftLength}px`);
        }

        if (horizontalScrollPercent < 1) {
          const rightLength = Math.min(
            (scrollWidth - clientWidth - scrollLeft) / scrollRatio,
            length
          );
          gradients.push(`rgba(0, 0, 0, 1) calc(100% - ${rightLength}px), rgba(0, 0, 0, 0)`);
        }

        gradient = `linear-gradient(to right, ${gradients.join(',')})`;
      }

      node.style.webkitMaskImage = gradient ?? '';
      node.style.maskImage = gradient ?? '';
    }

    // Set directly rather than relying on Tailwind having generated an `overflow-auto` class
    const overflow = getComputedStyle(node).overflow;
    if (!overflow || overflow === 'visible') {
      tracker.addStyle('overflow', 'auto');
    }
    tracker.addCleanup(() => {
      node.style.webkitMaskImage = '';
      node.style.maskImage = '';
    });

    tracker.addEventListener('scroll', onScroll);
    // Update if transitions are used (ex. children with `animate:flip`)
    tracker.addEventListener('transitionend', onScroll);
    tracker.addEventListener('animationend', onScroll);

    // Update when the node is resized (and on initial mount)
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(node);
    tracker.addCleanup(() => resizeObserver.disconnect());

    const mutationObserver = new MutationObserver(onScroll);
    mutationObserver.observe(node, { childList: true, subtree: true });
    tracker.addCleanup(() => mutationObserver.disconnect());

    return () => tracker.reset();
  };
}
