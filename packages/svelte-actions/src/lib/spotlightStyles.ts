/**
 * Shared with `@layerstack/svelte-attachments` — keep the two in sync.  Each value resolves in the
 * same order: `--spotlight-*` set by the app, then `--default-spotlight-*`/`--hover-spotlight-*`
 * written from this action's options, then a built-in default.
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
