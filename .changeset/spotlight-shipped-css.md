---
'@layerstack/svelte-attachments': minor
'@layerstack/svelte-actions': patch
---

fix: `spotlight` and `scrollShadow` rendered nothing under Tailwind v4

Both drew their effect entirely from Tailwind utilities applied at runtime — `before:*` for the spotlight's gradients, `after:*` for the scroll shadows. Tailwind only emits utilities it finds while scanning source files, and a class added from a library's JavaScript is never scanned, so none of those rules existed and the effects were invisible. Tailwind v3 hid this, because apps listed the package under `content` and so scanned its source; v4's `@source` does not cover installed packages.

Each attachment now ships its own CSS. The one rule that cannot be expressed inline — the `::before`/`::after` that draws the effect — is injected into the document on first use as a constructable stylesheet, falling back to a `<style>` element, and only once per document or shadow root. Nothing depends on a stylesheet import or on a CSS framework, which also makes these usable outside Tailwind entirely.

The injected rules are wrapped in `@layer layerstack` and their selectors in `:where()`, so they carry effectively no specificity and any app rule wins. The layer alone is not enough — a layer declared from an injected sheet sorts after one the app declared earlier, such as Tailwind's `utilities`. Elements are marked with a data attribute (`data-spotlight`, `data-scroll-shadow`) rather than a class, and options are written as inline custom properties (`--default-spotlight-*`, `--hover-spotlight-*`). Setting `--spotlight-*` directly still works and still takes precedence.

`injectStyles` is exported for anyone writing an attachment with the same problem.

feat: Port `scrollShadow` and `scrollFade` to `@layerstack/svelte-attachments`, which had only `scrollIntoView`

`scrollFade` no longer relies on an `overflow-auto` class existing. Both now set `position`/`overflow` only when the element does not already have them, rather than forcing their own, and clear what they applied on cleanup — which the actions never did.
