# @layerstack/docs — consumer setup simplification (future work)

> Notes captured 2026-06-30 after extracting the docs framework into `@layerstack/docs` and
> wiring up `layerchart` as the first external consumer. Goal: make spinning up a **new** docs
> site need fewer packages and less boilerplate. Not scheduled — review when prioritizing DX work.

## Where things stand

The hard parts are already solved as factories:

- `createMdsxConfig()` (`@layerstack/docs/markdown/config`) — bundles the whole markdown pipeline
  (remark-gfm, remark-mdc, components, live-code, rehype-slug, rehype-pretty-code, code blocks,
  default blueprint).
- `createContentConfig()` (`@layerstack/docs/content-collections`) — 5 pre-wired collections
  (components, utils, guides, references, releases) with Zod schemas, source/API/example linking,
  GitHub URL building, TOC.
- CLI (`layerstack-docs`): `generate-api`, `generate-catalog`, `generate-stackblitz`,
  `generate-releases`, `generate-screenshots`.
- Glue factories: `createContentLoaders`, `createGlobExampleLoaders`/`createExampleLoaders`.
- Components, markdown components, `search`, `llms`, `context`, `catalog`, `styles.css`.

**The remaining gap is wiring boilerplate.** Every consumer re-assembles the same Vite plugins,
the same svelte preprocessor, the same `generate:*` scripts, and the same handful of route files.
Measured against the layerchart docs site, the config/route files are ~60–100% identical boilerplate.

Hard constraint to remember: **pnpm uses a strict, non-flat `node_modules`**, so a consumer can only
import packages it declares directly. Anything imported in the consumer's own config/source must be a
direct dep even if `@layerstack/docs` also depends on it. Bundling that import _inside_ a
`@layerstack/docs` export is what lets the consumer drop the dep.

## Recommendations (ranked by impact on new-project setup)

### 1. Single Vite plugin + preprocessor wrapper — biggest "reduce packages" win

- `@layerstack/docs/vite` → `layerstackDocs()` that internally runs `@content-collections/vite` +
  `unplugin-icons` (+ optionally `@tailwindcss/vite`).
- `@layerstack/docs/preprocess` → `markdownPreprocess()` wrapping `mdsx(createMdsxConfig(...))`.

Consumer `vite.config.ts` / `svelte.config.js` shrink to a few lines, and the consumer drops direct
deps: `mdsx`, `@content-collections/vite`, `unplugin-icons`, `@tailwindcss/vite` (~4 more, on top of
the 5 already removed: flexsearch, rehype-pretty-code, remark-gfm, @content-collections/core,
@content-collections/markdown).

Caveat: `~icons/<set>` virtual imports and Tailwind `@source` globs resolve against the **consumer's**
tree, so project-specific icon sets (`logos`, `vscode-icons`) and the `@source` lines stay.

### 2. Plugin-driven generators — kills the `prebuild` chain

Run `generate-api`/`catalog`/`stackblitz`/`releases` from `layerstackDocs()`'s `buildStart` hook,
driven by one `layerstack-docs.config.ts`. Removes the 5 `generate:*` scripts + `prebuild` from
`package.json`. (`generate-screenshots` needs a live server → stays a separate script.)

### 3. `layerstack-docs init` scaffold — biggest win for a brand-new project

A degit-style template or `npm create @layerstack/docs` that lays down configs, `src/content/` +
`src/examples/` dirs, base routes, and `app.css`. Turns day-one from "copy layerchart/docs and delete
stuff" into one command. The `templates/` dir already exists (StackBlitz) — extend the pattern.

### 4. Route + CSS presets — shrink the remaining hand-written files

- `docs/guides/[...name]/+page.svelte` is 100% boilerplate (`<PageComponent />` wrapper);
  `/api/search.json` and `/llms.txt` are ~80–95% boilerplate. Export reusable page components /
  endpoint factories so each route file becomes a one-line re-export. (SvelteKit still needs the
  files to exist — reduces content, not file count.)
- Ship `@layerstack/docs/preset.css` bundling `@layerstack/tailwind` core/utils/themes + docs styles,
  collapsing `app.css`'s ~200 boilerplate lines to one `@import` + the project's `@theme` colors.

### 5. Glue-layer factories accept project hooks

`content.ts`, `examples.ts`, `searchContent.ts` already use factories but still hand-write the same
glob/metadata wiring (~60% project-specific). Tighten factory signatures (pass collections + a
metadata resolver) to shave the repeated parts.

## Suggested order

1 + 2 are highest leverage and most self-contained (remove ~4 deps + most of two config files, low
risk). 3 is the headline feature for new projects but more work. The honest limit: the eslint stack,
`tailwindcss`, `@source` globs, and project-specific bits (externals, theme colors, custom icons, nav)
always stay in the consumer.

## Proving ground

When implementing, wire the layerchart docs site to each change as the test, and measure exactly how
many direct deps / config lines drop.
