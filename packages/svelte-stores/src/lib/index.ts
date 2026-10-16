/**
 * @deprecated Use `@layerstack/svelte-state` instead.
 *
 * Svelte 5 runes replace stores.  Each store here has a state class equivalent read through
 * properties rather than a `$` prefix — `paginationStore(...)` becomes `new PaginationState(...)`.
 * `changeStore`, `dirtyStore`, and `mapStore` are dropped, as `$effect`, `$derived`, and
 * `SvelteMap` cover them directly.
 */

export { default as changeStore } from './changeStore.js';
export { default as debounceStore } from './debounceStore.js';
export { default as dirtyStore } from './dirtyStore.js';
export { default as fetchStore } from './fetchStore.js';
export { default as graphStore, initGraphClient, gql } from './graphStore.js';
export { default as formStore } from './formStore.js';
export { default as localStore } from './localStore.js';
export { default as mapStore } from './mapStore.js';
export * from './matchMedia.js';
export { default as paginationStore } from './paginationStore.js';
export * from './promiseStore.js';
export { default as selectionStore } from './selectionStore.js';
export * from './themeStore.js';
export { default as timerStore } from './timerStore.js';
export { default as uniqueStore } from './uniqueStore.js';
export * from './queryParamsStore.js';
