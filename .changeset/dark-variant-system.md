---
'@layerstack/tailwind': patch
'@layerstack/ui': patch
'@layerstack/docs': patch
---

fix: Follow `prefers-color-scheme` in the `dark:` variant, not just `<html class="dark">`.

There were two disagreeing sources of truth for "is it dark". The theme palettes darken from
`@media (prefers-color-scheme: dark)` on `:root`, which needs no JavaScript, but the `dark:` variant
was keyed on the `dark` class, which is only ever set by JavaScript. Any moment the two disagreed —
before hydration, or permanently when no dark themes are registered — produced dark surfaces with
every `dark:` utility still in its light state. Most visibly, code blocks styled by
`dark:text-(--shiki-dark)` rendered near-black tokens on a dark background.

The variant now mirrors the palettes: an explicit `[data-theme]` selection wins, and everything else
follows the system setting. `@layerstack/docs`' `Code` component gets the same treatment for its
hand-written `html.dark .shiki` rules.

Also fixes `ThemeInit` on client-only apps. It injects its pre-paint script through `{@html}`, and
the browser never executes a `<script>` inserted that way — so with `ssr = false` the guard was
inert. `@layerstack/tailwind` now exports `applyInitialTheme`, which `ThemeInit` calls directly in
the browser.
