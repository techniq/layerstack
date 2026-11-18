import type { Action } from 'svelte/action';

import { injectStyles } from './injectStyles.js';
import { spotlightStyles } from './spotlightStyles.js';

type SpotlightColorOptions = {
  radius?: string;
  borderWidth?: string;
  borderColorStops?: string;
  surfaceColorStops?: string;
};

type SpotlightOptions =
  | (SpotlightColorOptions & {
      /** Values to use while the element is hovered */
      hover?: SpotlightColorOptions;
    })
  | undefined;

const PROPERTIES = {
  radius: 'radius',
  borderWidth: 'border-width',
  borderColorStops: 'border-color-stops',
  surfaceColorStops: 'surface-color-stops',
} as const;

/**
 * Render a spotlight (a radial gradient that follows the pointer) behind an element.
 *
 * Self-contained — the rule for the `::before` that draws the gradients is injected on first use.
 *
 * Previously this added the Tailwind utilities that draw the gradients directly to the element.
 * Tailwind only emits utilities it finds while scanning source files, and a class added from a
 * library's JavaScript is never scanned, so under Tailwind v4 none of them existed and the
 * spotlight was invisible.
 */
export const spotlight: Action<HTMLElement, SpotlightOptions> = (node, options) => {
  const appliedProperties: string[] = [];

  function apply(options: SpotlightOptions) {
    appliedProperties.forEach((property) => node.style.removeProperty(property));
    appliedProperties.length = 0;

    for (const [option, property] of Object.entries(PROPERTIES)) {
      const value = options?.[option as keyof SpotlightColorOptions];
      if (value) {
        node.style.setProperty(`--default-spotlight-${property}`, value);
        appliedProperties.push(`--default-spotlight-${property}`);
      }

      const hoverValue = options?.hover?.[option as keyof SpotlightColorOptions];
      if (hoverValue) {
        node.style.setProperty(`--hover-spotlight-${property}`, hoverValue);
        appliedProperties.push(`--hover-spotlight-${property}`);
      }
    }
  }

  injectStyles(node, 'spotlight', spotlightStyles);

  node.setAttribute('data-spotlight', '');
  const position = getComputedStyle(node).position;
  if (!position || position === 'static') {
    node.style.position = 'relative';
  }
  node.style.isolation = 'isolate';

  apply(options);

  return {
    update: apply,
    destroy() {
      node.removeAttribute('data-spotlight');
      node.style.removeProperty('position');
      node.style.removeProperty('isolation');
      appliedProperties.forEach((property) => node.style.removeProperty(property));
    },
  };
};
