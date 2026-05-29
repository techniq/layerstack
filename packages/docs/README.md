# @layerstack/docs

Reusable documentation framework and tooling for LayerStack projects (LayerStack, LayerChart, …).

It provides:

- **Markdown rendering** — a shared [mdsx](https://github.com/huntabyte/mdsx) config (`createMdsxConfig`) with GFM, MDC directives, [Shiki](https://shiki.style/) syntax highlighting, automatic heading slugs, and a set of styled markdown element components.
- **Content collections** — a [`@content-collections`](https://www.content-collections.dev/) config factory (`createContentConfig`) that turns `src/content/**/*.md` into typed collections (components, utils, guides, references, releases) with TOC, source links, and generated API/catalog data.
- **Doc UI components** — `Code`, `Json`, `TableOfContents`, `ViewSourceButton`, `ExampleLink`, `ExampleListing`, `RelatedLink`, `LoadingPlaceholder`, etc.
- **Example/content loaders** — `createExampleLoaders` / `createContentLoaders` to wire a docs app's `import.meta.glob` to the framework.
- **CLI (`layerstack-docs`)** — build-time generators for component API JSON, example catalogs, screenshots, StackBlitz projects, and release notes.

## Usage

A docs app depends on this package via `workspace:*` (in this monorepo) or `link:` (cross-repo), and follows this convention:

```
docs-app/
  content-collections.ts      # createContentConfig({ packageName, repo })
  mdsx.config.js              # createMdsxConfig({ exampleComponentPath })
  src/
    content/                  # *.md docs (components/, utils/, guides/, reference/)
    examples/                 # *.svelte examples referenced from markdown
    lib/
      content.ts              # createContentLoaders(...)
      examples.ts             # createExampleLoaders(...)
  generated/                  # CLI output (api/, releases/)
```

### Markdown (`mdsx.config.js`)

```js
import { createMdsxConfig } from '@layerstack/docs/markdown/config';

export const mdsxConfig = createMdsxConfig({
	exampleComponentPath: '$lib/components'
});
```

The `reference` collection infers each doc's source file from its path by convention —
`src/content/reference/<package>/<item>.md` → `packages/<package>/src/lib/<item>.{ts,svelte.ts}`
(with a camelCase fallback, e.g. `Duration` → `duration.ts`, `SelectionState` → `selectionState.svelte.ts`).
Add a `sourceFile:` frontmatter (relative to `packages/`) only to override the inferred path.

### Content collections (`content-collections.ts`)

```ts
import { createContentConfig } from '@layerstack/docs/content-collections';

export default createContentConfig({
	packageName: 'layerstack',
	repo: 'techniq/layerstack'
});
```

### Styles (`app.css`)

```css
@import 'tailwindcss';
@import '@layerstack/tailwind/core.css';
@import '@layerstack/tailwind/utils.css';
@import '@layerstack/tailwind/themes/all.css';
@import '@layerstack/docs/styles.css';
```

### CLI

```jsonc
{
	"scripts": {
		"generate:api": "layerstack-docs generate-api ../packages/<pkg>/src/lib/components generated/api",
		"generate:catalog": "layerstack-docs generate-catalog ../packages/<pkg>/src/lib/components src/examples/components src/examples/catalog",
		"generate:screenshots": "layerstack-docs generate-screenshots src/examples/components static/screenshots",
		"generate:stackblitz": "layerstack-docs generate-stackblitz src static/stackblitz-files.json [remote-sources.json]",
		"generate:releases": "layerstack-docs generate-releases techniq/<repo> generated/releases"
	}
}
```

`generate-stackblitz` uses this package's bundled template at `templates/stackblitz-template` by default; `--template-dir` overrides it.
