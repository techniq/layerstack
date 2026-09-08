---
'@layerstack/svelte-state': patch
'@layerstack/svelte-stores': patch
'@layerstack/tailwind': patch
'@layerstack/docs': patch
---

fix: Stop the fallback settings from stripping the applied theme, and derive `dark:` from the themes.

`getSettings()` builds a fallback outside a `settings()` provider, and that fallback constructed a
theme store with **no themes configured**. Its constructor still ran, read `localStorage`, wrote
`<html data-theme="dark">`, and then — because `[].includes('dark')` is false — *removed* the `dark`
class the real instance had just applied. The result was `data-theme="dark"` with no `dark` class:
a dark palette with every `dark:` utility still light, most visibly light code tokens on a dark
background. Whether it happened at all depended on when the fallback was first touched, which is why
it was intermittent, and why toggling the theme fixed it.

A theme store with nothing configured is now inert — it never touches the document or
`localStorage`. A stored theme the app no longer defines is also ignored rather than applied, since
it cannot be classified as light or dark.

The `dark:` variant is now generated from the themes themselves. A theme declares its darkness with
`color-scheme: dark`, so that is the single source of truth: `@custom-variant dark` lists every dark
`[data-theme]` alongside `.dark` and the `prefers-color-scheme` fallback. The palette and the variant
can no longer disagree, whatever JavaScript does.

`@layerstack/docs` moves its Shiki color rules out of `Code.svelte`'s `<style>` block — Svelte
compiles those, so Tailwind never saw the `dark:` variant there — and into `styles.css`, which also
covers the runtime-highlighted blocks that the markdown-only rule missed.
