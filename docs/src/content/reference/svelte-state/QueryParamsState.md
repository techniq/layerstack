---
title: QueryParamsState
description: Read and write querystring params as typed reactive state
related: [svelte-stores/queryParamsStore]
---

## Usage

```svelte
<script>
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { QueryParamsState } from '@layerstack/svelte-state';

  const params = new QueryParamsState({
    page,
    goto,
    defaults: { page: 1, tags: [] },
    paramTypes: { page: 'number', tags: 'string[]' },
  });
</script>

{params.current.page}

<button onclick={() => (params.current = { ...params.current, page: 2 })}>Next</button>
```

Reads flow through the reactive `page`, so the values update on navigation — including the back and
forward buttons, which is what separates this from parsing `location.search` once.

`goto` is required to write. Without it, setting logs an error and leaves the URL alone.

## Param types

`paramType` decides how a value is encoded and decoded: `string`, `string[]`, `number`, `number[]`,
`boolean`, `date`, `datetime`, `json`, or `object`. Without one, the param is not decoded at all.
For `QueryParamsState`, `paramTypes` is either a map keyed by param name or a function of the name.

## What is written

`QueryParamsState` owns the whole querystring — setting `current` rebuilds it from scratch, so a
param that is absent from the object disappears from the URL. Values equal to their default, `null`
or `undefined`, and empty arrays are left out, which keeps a shared link to the default view clean
rather than spelling out every default.

Pass `gotoOptions` to forward navigation options:

```js
new QueryParamsState({ page, goto, gotoOptions: { replaceState: true, noScroll: true } });
```

`createParams(values)` and `createUrl(values)` build the `URLSearchParams` or `URL` without
navigating, for links and exports.

## A single param

`QueryParamState` is the same thing for one param, and leaves the rest of the querystring untouched:

```js
const search = new QueryParamState({ name: 'q', page, goto, paramType: 'string' });

search.current;
search.current = 'layerstack';
```
