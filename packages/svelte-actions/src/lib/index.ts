/**
 * @deprecated Use `@layerstack/svelte-attachments` instead.
 *
 * Svelte 5 attachments replace actions.  Each action here has an attachment equivalent that takes
 * its options up front — `use:sticky={options}` becomes `{@attach sticky(options)}` — except
 * `multi`, which is dropped because attachments compose natively.
 *
 * This package remains only so `@layerstack/svelte-table` keeps working while it is migrated.
 */

export * from './dataBackground.js';
export * from './input.js';
export * from './layout.js';
export * from './mouse.js';
export * from './multi.js';
export * from './observer.js';
export * from './popover.js';
export * from './portal.js';
export * from './scroll.js';
export * from './spotlight.js';
export * from './sticky.js';
export * from './styles.js';
