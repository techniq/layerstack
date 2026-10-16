---
title: Query params
description: Manage query params as a store, with multiple serialization strategies
hideUsage: true
sourceFile: svelte-stores/src/lib/queryParamsStore.ts
---

## queryParamStore()

Manage a single query param

```js
import { queryParamStore } from '@layerstack/svelte-stores';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

const dateRange = queryParamStore({
  name: 'range',
  default: {
    from: startOfToday(),
    to: endOfToday(),
  },
  paramType: 'object',
  page,
});

$: setDataRange = (value) => {
  const params = new URLSearchParams(location.search);
  dateRange.apply(params, value);
  const url = `${location.pathname}?${params.toString()}`;
  goto(url, $page);
};
```

If `goto` is passed, store can be set directly

```js
import { queryParamsStore } from '@layerstack/svelte-stores';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

const filters = queryParamStore({
  name: 'range',
  default: {
    from: startOfToday(),
    to: endOfToday(),
  },
  paramType: 'object',
  page,
  goto, // <--- IMPORTANT
});

$dataRange = newValue;
```

## queryParamsStore()

Manage all query params as a single store

```js
import { queryParamsStore } from '@layerstack/svelte-stores';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

const filters = queryParamsStore({
  defaults: {
    name: null,
    value: null,
    range: {
      from: startOfToday(),
      to: endOfToday(),
    },
  },
  paramTypes: (key) => {
    switch (key) {
      case 'name':
        return 'string';
      case 'value':
        return 'number';
      case 'range':
        return 'object';
    }
  },
  page,
});

$: setFilters = (newFilters) => {
  const url = filters.createUrl(newFilters);
  goto(url, $page);
};
```

If `goto` is passed, store can be set directly

```js
import { queryParamsStore } from '@layerstack/svelte-stores';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

const filters = queryParamsStore({
  defaults: {
    name: null,
    value: null,
    range: {
      from: startOfToday(),
      to: endOfToday(),
    },
  },
  paramTypes: (key) => {
    switch (key) {
      case 'name':
        return 'string';
      case 'value':
        return 'number';
      case 'range':
        return 'object';
    }
  },
  page,
  goto, // <--- IMPORTANT
});

$filters = newFilters;
```

## Param types

### string

input

```js
const value = 'example';
```

output

```
?value=example
```

### string[]

input

```js
const value = ['one', 'two', 'three'];
```

output

```
?value=one_two_three
```

### number

input

```js
const value = 1234;
```

output

```
?value=1234
```

### number[]

input

```js
const value = [1, 2, 3, 4];
```

output

```
?value=1_2_3_4
```

### boolean

input

```js
const value = true;
```

output

```
?value=1
```

### date

input

```js
const value = new Date('1982-03-30T00:00:00'); // keep in local time
```

output

```
?value=1982-03-30
```

### datetime

input

```js
const value = new Date('1982-03-30T00:00:00-05:00');
```

output

```
?value=1982-03-30T05:00:00.000Z
```

### json

input

```js
const value = {
  number: 1234,
  string: 'example',
  bool: true,
  date: new Date('1982-03-30T00:00:00-05:00'),
};
```

output

```
?value={"number":1234,"string":"example","bool":true,"date":"1982-03-30T05:00:00.000Z"}
```

### object

input

```js
const value = {
  number: 1234,
  string: 'example',
  bool: true,
  date: new Date('1982-03-30T00:00:00-05:00'),
};
```

output

```
?value=number-1234_string-"example"_bool-true_date-"1982-03-30T05:00:00.000Z"
```
