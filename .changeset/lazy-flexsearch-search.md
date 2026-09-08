---
'@layerstack/docs': patch
---

fix(search): Lazy-load `flexsearch` inside `initSearch()` so the CommonJS dependency (which `require`s `worker_threads`) is no longer statically pulled into SSR. Previously importing the data-only `buildSearchEntries` helper dragged `flexsearch` into server bundles; under Vite 8 / Rolldown this surfaced as an eager `createRequire(import.meta.url)` that crashes on Cloudflare Workers (`import.meta.url` is `undefined`).
