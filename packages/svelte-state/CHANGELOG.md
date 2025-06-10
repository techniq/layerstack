# @layerstack/svelte-state

## 0.1.0-next.15

### Patch Changes

- Updated dependencies [[`32eb536`](https://github.com/techniq/layerstack/commit/32eb5367e8a9e545026c6254827547b374d1db94)]:
  - @layerstack/utils@2.0.0-next.10

## 0.1.0-next.14

### Patch Changes

- refactor: Replace `date-fns` usage with new date utils (based on d3-time) to reduce bundle size ([#71](https://github.com/techniq/layerstack/pull/71))

- Updated dependencies [[`abd845a`](https://github.com/techniq/layerstack/commit/abd845a53b4b1cdc3a61a6503b6cb4fd144d35a5), [`abd845a`](https://github.com/techniq/layerstack/commit/abd845a53b4b1cdc3a61a6503b6cb4fd144d35a5)]:
  - @layerstack/utils@2.0.0-next.9

## 0.1.0-next.13

### Patch Changes

- Updated dependencies [[`e47ed35`](https://github.com/techniq/layerstack/commit/e47ed359ae04ce24d70f3ab5369366f77cdc93d6)]:
  - @layerstack/utils@2.0.0-next.8

## 0.1.0-next.12

### Patch Changes

- Updated dependencies [[`a6df412`](https://github.com/techniq/layerstack/commit/a6df412a42636fead1b1ce4f92d114ecc6b1d727)]:
  - @layerstack/utils@2.0.0-next.7

## 0.1.0-next.11

### Patch Changes

- Updated dependencies [[`23651ad`](https://github.com/techniq/layerstack/commit/23651adc92ef675c3fedb4fbc6fa3d976df57cb4)]:
  - @layerstack/utils@2.0.0-next.6

## 0.1.0-next.10

### Patch Changes

- Updated dependencies [[`7642289`](https://github.com/techniq/layerstack/commit/7642289e1a99cf8092f2695491fd78b35a796bff)]:
  - @layerstack/utils@2.0.0-next.5

## 0.1.0-next.9

### Patch Changes

- Updated dependencies [[`ab0bb08`](https://github.com/techniq/layerstack/commit/ab0bb086257e281aa10ef13a3296aedf95c777f9), [`48b0aea`](https://github.com/techniq/layerstack/commit/48b0aead52ca6aeb2135a5297f5d774c8b510e12), [`38c4443`](https://github.com/techniq/layerstack/commit/38c44438c2454d3ffe328be15c1077987f64ee24), [`eaca635`](https://github.com/techniq/layerstack/commit/eaca6356ccd5288950aca64b8082ef18df2757ec)]:
  - @layerstack/utils@2.0.0-next.4

## 0.1.0-next.8

### Patch Changes

- fix: Add `PaginationState` to top-level exports ([#31](https://github.com/techniq/layerstack/pull/31))

## 0.1.0-next.7

### Patch Changes

- fix(TimerState): Only restart timer after updating delay if previously running ([#31](https://github.com/techniq/layerstack/pull/31))

## 0.1.0-next.6

### Patch Changes

- breaking(TimerState): Rename `onTick` to `tick` ([#31](https://github.com/techniq/layerstack/pull/31))

- Updated dependencies [[`4ed65a7`](https://github.com/techniq/layerstack/commit/4ed65a76562db9af2d18a196a2ba9e58f959aa5c)]:
  - @layerstack/utils@2.0.0-next.3

## 0.1.0-next.5

### Patch Changes

- fix(SelectionState): Improve `current` type (based on `single`) ([#31](https://github.com/techniq/layerstack/pull/31))

- Add PaginationState ([#60](https://github.com/techniq/layerstack/pull/60))

- fix(MediaQueryPresets): Add workaround for `screen` and `print` for upstream svelte issue ([#31](https://github.com/techniq/layerstack/pull/31))

## 0.1.0-next.4

### Patch Changes

- feat: Add `MediaQueryPresets` ([#31](https://github.com/techniq/layerstack/pull/31))

- breaking(SelectionState): Refine API (use `current` property setter instead of `setSelected()` and rename `toggleSelected()` to `toggle()`) ([#31](https://github.com/techniq/layerstack/pull/31))

## 0.1.0-next.3

### Patch Changes

- feat: Add `TimerState` ([#56](https://github.com/techniq/layerstack/pull/56))

## 0.1.0-next.2

### Patch Changes

- Updated dependencies [[`955e07b`](https://github.com/techniq/layerstack/commit/955e07b5aed62acd8afba10f9eaa68b90d72bb74)]:
  - @layerstack/utils@1.1.0-next.2

## 0.1.0-next.1

### Minor Changes

- breaking: Migrate `selectionState` and `uniqueState` to `SelectionState` and `UniqueState` classes ([#31](https://github.com/techniq/layerstack/pull/31))

## 0.1.0-next.0

### Minor Changes

- feat: Add `@layerstack/svelte-state` package, initially with `selectionState` and `uniqueState` ([#31](https://github.com/techniq/layerstack/pull/31))

### Patch Changes

- Updated dependencies [[`b7ca80b`](https://github.com/techniq/layerstack/commit/b7ca80b6a8a07c53ec4a99864ec6b9fd1ecab0b4)]:
  - @layerstack/utils@1.1.0-next.1
