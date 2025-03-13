# @layerstack/tailwind

## 2.0.0-next.2

### Patch Changes

- breaking: Rename `theme.css` to `core.css`. Provide default colors for all theme variables including deriving `-50`:`-950` shades (`primary-700`, etc). Add `themes/basic.css` for simple light/dark use cases ([#31](https://github.com/techniq/layerstack/pull/31))

- fix(theme.css): Provide default colors (instead of black) for theme variables. Use `color-mix()` to derive `-50`:`-950` shades of all theme colors (primary-100, success-700, etc) ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.1

### Patch Changes

- fix(theme.css): Apply tailwind typography `.prose` css variable overrides within `@layer utilities` to fix deployment. Properly set opacity for some variables ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.0

### Major Changes

- Tailwind 4 support ([#32](https://github.com/techniq/layerstack/pull/32))

### Patch Changes

- Updated dependencies [[`6cdcb26`](https://github.com/techniq/layerstack/commit/6cdcb26cabd0539cee2885efbaa39e7787a34114), [`c6bb443`](https://github.com/techniq/layerstack/commit/c6bb443d12ee12bd69417dcfa5880b6bf78c9f09), [`c13e65e`](https://github.com/techniq/layerstack/commit/c13e65e059d690cbc282635f6e48a27d715e5997)]:
  - @layerstack/utils@1.1.0-next.0

## 1.0.0

### Major Changes

- Version 1.0 (Svelte 3-5 and Tailwind 3 compatible) ([`7ff8c3a`](https://github.com/techniq/layerstack/commit/7ff8c3a82e93ffb64257880d901deb56706d37cb))

### Patch Changes

- Update dependencies ([#29](https://github.com/techniq/layerstack/pull/29))

- Updated dependencies [[`2842669`](https://github.com/techniq/layerstack/commit/284266956ef4e04b8233dd6f959f24d913ab16cc), [`7ff8c3a`](https://github.com/techniq/layerstack/commit/7ff8c3a82e93ffb64257880d901deb56706d37cb)]:
  - @layerstack/utils@1.0.0

## 0.0.13

### Patch Changes

- fix(createHeadSnippet): Resolve `[svelte] hydration_html_changed` issue. Resolves #25 ([#26](https://github.com/techniq/layerstack/pull/26))

## 0.0.12

### Patch Changes

- Updated dependencies [[`8f8815a`](https://github.com/techniq/layerstack/commit/8f8815a0c74df91882a32436c2d905a801421c54)]:
  - @layerstack/utils@0.1.0

## 0.0.11

### Patch Changes

- Update dependencies ([`b52ed63`](https://github.com/techniq/layerstack/commit/b52ed6361244712230edd339c0ebbefa35608949))

- Updated dependencies [[`b52ed63`](https://github.com/techniq/layerstack/commit/b52ed6361244712230edd339c0ebbefa35608949)]:
  - @layerstack/utils@0.0.7

## 0.0.10

### Patch Changes

- Updated dependencies [[`f180c69ab1969775df25b55f64faf223f9db0171`](https://github.com/techniq/layerstack/commit/f180c69ab1969775df25b55f64faf223f9db0171)]:
  - @layerstack/utils@0.0.6

## 0.0.9

### Patch Changes

- refactor: Move daisy and skeleton modules from top-level to named exports, fixing unnecessary dependencies (ex. `import { themes } from '@layerstack/tailwind/daisy'`) ([`59f8e6eb378e20fc060598f14df706bc762dbefe`](https://github.com/techniq/layerstack/commit/59f8e6eb378e20fc060598f14df706bc762dbefe))

## 0.0.8

### Patch Changes

- fix: Add daisy and skeleton exports ([`9e21367153e32fbcecc8e15e3087899e34bf32db`](https://github.com/techniq/layerstack/commit/9e21367153e32fbcecc8e15e3087899e34bf32db))

## 0.0.7

### Patch Changes

- Update dependencies ([`f19a9c4a6a499e4449aeeb2b0325e450fd7d7abd`](https://github.com/techniq/layerstack/commit/f19a9c4a6a499e4449aeeb2b0325e450fd7d7abd))

- Updated dependencies [[`f19a9c4a6a499e4449aeeb2b0325e450fd7d7abd`](https://github.com/techniq/layerstack/commit/f19a9c4a6a499e4449aeeb2b0325e450fd7d7abd)]:
  - @layerstack/utils@0.0.5

## 0.0.6

### Patch Changes

- Updated dependencies [[`84160d60076ad6e3e22b9ee5190a1a5325cf3fcb`](https://github.com/techniq/layerstack/commit/84160d60076ad6e3e22b9ee5190a1a5325cf3fcb), [`048a5ac2f0a31570bbef1465bcdc5d2351c1d723`](https://github.com/techniq/layerstack/commit/048a5ac2f0a31570bbef1465bcdc5d2351c1d723)]:
  - @layerstack/utils@0.0.4

## 0.0.5

### Patch Changes

- Add types (ThemeColors, TailwindColors) ([`e23345b641227d2d4d993c8e63c5c303767579d8`](https://github.com/techniq/layerstack/commit/e23345b641227d2d4d993c8e63c5c303767579d8))

## 0.0.4

### Patch Changes

- Fix plugin export ([`f219fe52b1c5c3cfd3f88b2aeaa5da5889404403`](https://github.com/techniq/layerstack/commit/f219fe52b1c5c3cfd3f88b2aeaa5da5889404403))

## 0.0.3

### Patch Changes

- Update dependencies ([`e41774903205b50f5bb0b2e2c6ed131b0b49ae97`](https://github.com/techniq/layerstack/commit/e41774903205b50f5bb0b2e2c6ed131b0b49ae97))

- Updated dependencies [[`fdc6415817c32d1db45ddb02318a2bbb4ddedb90`](https://github.com/techniq/layerstack/commit/fdc6415817c32d1db45ddb02318a2bbb4ddedb90), [`e41774903205b50f5bb0b2e2c6ed131b0b49ae97`](https://github.com/techniq/layerstack/commit/e41774903205b50f5bb0b2e2c6ed131b0b49ae97)]:
  - @layerstack/utils@0.0.3

## 0.0.2

### Patch Changes

- Add @layerstack/tailwind package ([`cd8a22d79e2f57ba7974e1ae1226bdceb540239d`](https://github.com/techniq/layerstack/commit/cd8a22d79e2f57ba7974e1ae1226bdceb540239d))
