import { createContentConfig } from '@layerstack/docs/content-collections';

export default createContentConfig({
  // LayerStack is a multi-package monorepo; docs are authored as `reference` content
  // organized by package under `src/content/reference/<package>/<name>.md`.
  packageName: 'layerstack',
  repo: 'techniq/layerstack',
  branch: 'main',
  // `docs` -> repo root `packages`
  packagesRoot: '../packages',
});
