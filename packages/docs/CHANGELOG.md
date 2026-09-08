# @layerstack/docs

## 1.0.0-next.5

### Patch Changes

- Updated dependencies [[`f039759`](https://github.com/techniq/layerstack/commit/f039759eca12df0588ea7d3c7625fed780307b2c), [`f039759`](https://github.com/techniq/layerstack/commit/f039759eca12df0588ea7d3c7625fed780307b2c), [`f039759`](https://github.com/techniq/layerstack/commit/f039759eca12df0588ea7d3c7625fed780307b2c)]:
  - @layerstack/utils@2.0.0-next.19
  - @layerstack/tailwind@2.0.0-next.23

## 1.0.0-next.4

### Patch Changes

- feat(docs): Support passing explicit `components` as frontmatter for multi-component docs (ex. LayerChart's Tooltip.\*) ([#31](https://github.com/techniq/layerstack/pull/31))

## 1.0.0-next.3

### Patch Changes

- fix: Restore `view-transition-name` on `ExampleLink` so example screenshots morph into their detail view. ([#31](https://github.com/techniq/layerstack/pull/31))

## 1.0.0-next.2

### Patch Changes

- fix(search): Lazy-load `flexsearch` inside `initSearch()` so the CommonJS dependency (which `require`s `worker_threads`) is no longer statically pulled into SSR. Previously importing the data-only `buildSearchEntries` helper dragged `flexsearch` into server bundles; under Vite 8 / Rolldown this surfaced as an eager `createRequire(import.meta.url)` that crashes on Cloudflare Workers (`import.meta.url` is `undefined`). ([#31](https://github.com/techniq/layerstack/pull/31))

## 1.0.0-next.1

### Patch Changes

- fix: Resolve `@layerstack/*` workspace dependencies to their published versions in the released package ([#31](https://github.com/techniq/layerstack/pull/31))

## 1.0.0-next.0

### Major Changes

- feat: Add `@layerstack/docs` — reusable documentation framework and tooling for LayerStack projects ([#100](https://github.com/techniq/layerstack/pull/100))
