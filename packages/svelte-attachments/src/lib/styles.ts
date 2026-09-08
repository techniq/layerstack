import type { Attachment } from 'svelte/attachments';
import { entries } from '@layerstack/utils';

export type CSSProps = { [key: string]: string | number | boolean | null | undefined };

/**
 * Set style properties from a single object.  Properties are re-applied whenever the object
 * changes, and any that are removed (or become `null`/`undefined`) are removed from the element.
 * Booleans are written as `1`/`0` so they can be used with `calc()` and friends.
 */
export function styleProps(props: CSSProps): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    const applied: string[] = [];

    entries(props ?? {}).forEach(([key, value]) => {
      // Ignore if null or undefined
      if (value != null) {
        const property = String(key);
        const resolved = typeof value === 'boolean' ? (value ? 1 : 0) : value;
        node.style.setProperty(property, String(resolved));
        applied.push(property);
      }
    });

    return () => {
      applied.forEach((property) => node.style.removeProperty(property));
    };
  };
}

export type ComputedStylesCallback = (styles: CSSStyleDeclaration) => void;

/**
 * Retrieve all computed styles for an element, and again whenever its `class` or `style` changes.
 * Useful to resolve CSS variable values or when working with `canvas`.
 */
export function computedStyles(
  onStyles: ComputedStylesCallback
): Attachment<HTMLElement | SVGElement> {
  return (node: HTMLElement | SVGElement) => {
    onStyles(window.getComputedStyle(node));

    const observer = new MutationObserver(() => onStyles(window.getComputedStyle(node)));
    observer.observe(node, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => observer.disconnect();
  };
}
