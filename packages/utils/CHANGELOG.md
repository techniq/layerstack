# @layerstack/utils

## 2.0.0-next.13

### Patch Changes

- feat(format): Support passing `locale` as part of config object ([#82](https://github.com/techniq/layerstack/pull/82))

## 2.0.0-next.12

### Patch Changes

- chore: Remove unused deps ([#76](https://github.com/techniq/layerstack/pull/76))

- feat: Add string utils `toCamelCase()`, `toSnakeCase()`, `toKebabCase()`, and `toPascalCase()` ([#79](https://github.com/techniq/layerstack/pull/79))

## 2.0.0-next.11

### Patch Changes

- feat(formatDate): Support second argument as explicit `format` string accepting both `Unicode` and `strftime` formats (converting `Unicode` to `strftime`) while still supporting period type string/enum. ([#74](https://github.com/techniq/layerstack/pull/74))

- feat(parseDate): Support optional `format` argument accepting both `Unicode` and `strftime` formats (converting `Unicode` to `strftime`) ([#74](https://github.com/techniq/layerstack/pull/74))

## 2.0.0-next.10

### Patch Changes

- fix: Add more date utils to top-level exports including `intervalOffset`, `intervalDifference`, `isSameInterval`, `isDateWithin`, and more ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.9

### Patch Changes

- refactor: Replace `date-fns` usage with new date utils (based on d3-time) to reduce bundle size ([#71](https://github.com/techniq/layerstack/pull/71))

- feat: Add new date utils including `parseDate`, `timeInterval`, `startOfInterval`, `endOfInterval`, `intervalOffset`, and more ([#71](https://github.com/techniq/layerstack/pull/71))

## 2.0.0-next.8

### Patch Changes

- refactor: Remove `platform` nesting of user agent introspection functions (already nested in `env` export) ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.7

### Patch Changes

- feat: Add `platform` to get details of browser (operating system, etc) ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.6

### Patch Changes

- fix: Add `FormatConfig` as top-level export ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.5

### Patch Changes

- fix(format): Improve typing for `FormatConfig` and `formatDate()` ([#31](https://github.com/techniq/layerstack/pull/31))

## 2.0.0-next.4

### Patch Changes

- feat(format): Support passing config option to easily set `type` and additional `options` as single object (ex. `format(number, { type: 'currency', options: { notation: 'compact' } })`) ([#66](https://github.com/techniq/layerstack/pull/66))

- breaking(utils): Lowercase all periodTypeMappings, simplify (`DAY-TIME` => `daytime`, etc), and add `PeriodTypeCode` type ([#31](https://github.com/techniq/layerstack/pull/31))

- fix: Update `PeriodType.Month` `default` variant to include full name, and `long` to include year. ([#31](https://github.com/techniq/layerstack/pull/31))

- feat(format): Support passing PeriodTypeCode strings to easily format dates (ex. `format(date, 'day')`) ([#66](https://github.com/techniq/layerstack/pull/66))

## 2.0.0-next.3

### Major Changes

- breaking: Replace `getDuration()` / `humanizeDuration()` utils with `Duration` class (with `.format()` method) ([#62](https://github.com/techniq/layerstack/pull/62))

## 1.1.0-next.2

### Patch Changes

- fix(format): Do not truncate decimal values when using `metric` preset (ex. 0.5) ([#53](https://github.com/techniq/layerstack/pull/53))

## 1.0.1

### Patch Changes

- fix(format): Do not truncate decimal values when using `metric` preset (ex. 0.5) ([#53](https://github.com/techniq/layerstack/pull/53))

## 1.1.0-next.1

### Patch Changes

- Update dependencies ([#31](https://github.com/techniq/layerstack/pull/31))

## 1.1.0-next.0

### Minor Changes

- Tailwind 4 support ([#32](https://github.com/techniq/layerstack/pull/32))

### Patch Changes

- feat: Add `mapKeys()` and `mapValues()` object utils ([#32](https://github.com/techniq/layerstack/pull/32))

- feat: Add `NestedRecord` type ([#32](https://github.com/techniq/layerstack/pull/32))

## 1.0.0

### Major Changes

- Version 1.0 (Svelte 3-5 and Tailwind 3 compatible) ([`7ff8c3a`](https://github.com/techniq/layerstack/commit/7ff8c3a82e93ffb64257880d901deb56706d37cb))

### Patch Changes

- Update dependencies ([#29](https://github.com/techniq/layerstack/pull/29))

## 0.1.0

### Minor Changes

- refactor(localPoint): Swap `node` and `event` arguments and allow `node` to be optional, defaulting to `event.currentTarget ?? event.target` if not defined ([`8f8815a`](https://github.com/techniq/layerstack/commit/8f8815a0c74df91882a32436c2d905a801421c54))

## 0.0.7

### Patch Changes

- Update dependencies ([`b52ed63`](https://github.com/techniq/layerstack/commit/b52ed6361244712230edd339c0ebbefa35608949))

## 0.0.6

### Patch Changes

- Add common array and object utils to top-level export including `flatten()`, `unique()`, `isLiteralObject()`, `omit()`, and `pick()` ([`f180c69ab1969775df25b55f64faf223f9db0171`](https://github.com/techniq/layerstack/commit/f180c69ab1969775df25b55f64faf223f9db0171))

## 0.0.5

### Patch Changes

- Update dependencies ([`f19a9c4a6a499e4449aeeb2b0325e450fd7d7abd`](https://github.com/techniq/layerstack/commit/f19a9c4a6a499e4449aeeb2b0325e450fd7d7abd))

## 0.0.4

### Patch Changes

- feat: Add typeGuards to top-level exports ([`84160d60076ad6e3e22b9ee5190a1a5325cf3fcb`](https://github.com/techniq/layerstack/commit/84160d60076ad6e3e22b9ee5190a1a5325cf3fcb))

- Add localPoint() dom util ([`048a5ac2f0a31570bbef1465bcdc5d2351c1d723`](https://github.com/techniq/layerstack/commit/048a5ac2f0a31570bbef1465bcdc5d2351c1d723))

## 0.0.3

### Patch Changes

- Add dom utils to top-level exports ([`fdc6415817c32d1db45ddb02318a2bbb4ddedb90`](https://github.com/techniq/layerstack/commit/fdc6415817c32d1db45ddb02318a2bbb4ddedb90))

- Update dependencies ([`e41774903205b50f5bb0b2e2c6ed131b0b49ae97`](https://github.com/techniq/layerstack/commit/e41774903205b50f5bb0b2e2c6ed131b0b49ae97))

## 0.0.2

### Patch Changes

- Initial release ([`07f3e41c2a75a46e3c5973a9d4bed42811b917fc`](https://github.com/techniq/layerstack/commit/07f3e41c2a75a46e3c5973a9d4bed42811b917fc))
