import type { Attachment } from 'svelte/attachments';

import { DomTracker } from './domTracker.js';
import { injectStyles } from './injectStyles.js';

export type SpotlightColorOptions = {
  radius?: string;
  borderWidth?: string;
  borderColorStops?: string;
  surfaceColorStops?: string;
};

export type SpotlightOptions = SpotlightColorOptions & {
  /** Values to use while the element is hovered */
  hover?: SpotlightColorOptions;
};

const PROPERTIES = {
  radius: 'radius',
  borderWidth: 'border-width',
  borderColorStops: 'border-color-stops',
  surfaceColorStops: 'surface-color-stops',
} as const;

/**
 * Each value resolves in the same order:
 *   1. `--spotlight-*`          — set directly by the app, including under variants
 *   2. `--default-spotlight-*` / `--hover-spotlight-*` — written by the attachment from its options
 *   3. a built-in default
 */
export const spotlightStyles = `
:where([data-spotlight])::before {
  --_radius: var(--spotlight-radius, var(--default-spotlight-radius, 200px));
  --_border-width: var(--spotlight-border-width, var(--default-spotlight-border-width, 0px));
  --_border-color-stops: var(
    --spotlight-border-color-stops,
    var(--default-spotlight-border-color-stops, transparent, transparent)
  );
  --_surface-color-stops: var(
    --spotlight-surface-color-stops,
    var(--default-spotlight-surface-color-stops, transparent, transparent)
  );

  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  /* Transparent border so \`border-box\` leaves a ring for the border gradient to show through */
  border: var(--_border-width) solid transparent;
  background:
    fixed padding-box radial-gradient(var(--_radius) at var(--x, 0px) var(--y, 0px), var(--_surface-color-stops)),
    fixed border-box radial-gradient(var(--_radius) at var(--x, 0px) var(--y, 0px), var(--_border-color-stops));
}

/* Hover options win over the base ones, so \`hover:[--spotlight-radius:…]\` still resolves first */
:where([data-spotlight]:hover)::before {
  --_radius: var(--hover-spotlight-radius, var(--spotlight-radius, var(--default-spotlight-radius, 200px)));
  --_border-width: var(
    --hover-spotlight-border-width,
    var(--spotlight-border-width, var(--default-spotlight-border-width, 0px))
  );
  --_border-color-stops: var(
    --hover-spotlight-border-color-stops,
    var(--spotlight-border-color-stops, var(--default-spotlight-border-color-stops, transparent, transparent))
  );
  --_surface-color-stops: var(
    --hover-spotlight-surface-color-stops,
    var(--spotlight-surface-color-stops, var(--default-spotlight-surface-color-stops, transparent, transparent))
  );
}
`;

/**
 * Render a spotlight (a radial gradient that follows the pointer) behind an element.
 *
 * Self-contained — the rule for the `::before` that draws the gradients is injected on first use,
 * so this needs no stylesheet import and no CSS framework.
 *
 * Both gradients are `fixed`, so they read `--x`/`--y` as viewport coordinates — set those once on
 * a shared ancestor (see `mouseCoords`) and one listener drives every spotlight below it.
 *
 * Every option is also settable as a CSS variable (`[--spotlight-radius:100px]`,
 * `hover:[--spotlight-radius:50px]`), which composes better with Tailwind variants.  Variables set
 * that way win over the options passed here.
 */
export function spotlight(options?: SpotlightOptions): Attachment<HTMLElement> {
  return (node: HTMLElement) => {
    injectStyles(node, 'spotlight', spotlightStyles);

    const tracker = new DomTracker(node);

    tracker.addAttribute('data-spotlight', '');

    // Inline rather than in the injected rule, so an app positioning the element itself is not
    // overridden, and the pseudo-element still has something to position against
    // An environment that cannot resolve computed styles reports `''`; treat that as unpositioned
    const position = getComputedStyle(node).position;
    if (!position || position === 'static') {
      tracker.addStyle('position', 'relative');
    }
    // Keep the negative z-index from escaping to an ancestor's stacking context
    tracker.addStyle('isolation', 'isolate');

    for (const [option, property] of Object.entries(PROPERTIES)) {
      const value = options?.[option as keyof SpotlightColorOptions];
      if (value) {
        tracker.addStyle(`--default-spotlight-${property}`, value);
      }

      const hoverValue = options?.hover?.[option as keyof SpotlightColorOptions];
      if (hoverValue) {
        tracker.addStyle(`--hover-spotlight-${property}`, hoverValue);
      }
    }

    return () => tracker.reset();
  };
}
