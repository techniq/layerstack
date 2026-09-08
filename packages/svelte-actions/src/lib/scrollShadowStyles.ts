/**
 * Shared with `@layerstack/svelte-attachments` — keep the two in sync.
 *
 * The shadows go on a sticky `::after` so they paint over the content.  An inset `box-shadow` set
 * inline would need no rule at all, but paints below the content; painting over it is the intended
 * look and was chosen deliberately.
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
