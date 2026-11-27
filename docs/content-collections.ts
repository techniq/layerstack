import { createContentConfig } from '@layerstack/docs/content-collections';

export default createContentConfig({
  // LayerStack is a multi-package monorepo; docs for most packages are authored as `reference`
  // content organized by package under `src/content/reference/<package>/<name>.md`.
  // `packageName` drives the `components`/`utils` collections, which document `@layerstack/ui`.
  packageName: 'ui',
  repo: 'techniq/layerstack',
  // `docs` -> repo root `packages`
  packagesRoot: '../packages',
});
