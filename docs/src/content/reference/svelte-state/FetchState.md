---
title: FetchState
description: Reactive fetch state — loading, data, error, request, and response
related: [svelte-state/GraphState, svelte-state/PromiseState, svelte-stores/fetchStore]
---

## Usage

```js
import { FetchState } from '@layerstack/svelte-state';

const state = new FetchState();

state.fetch('/api/users');

state.loading;
state.data;
state.error;
state.request;
state.response;

state.refresh(); // re-run the last request
state.clear(); // reset back to empty
```

Config passed to the constructor applies to every request; config passed to `fetch()` is merged
over it for that one.

## Parsing

`as` decides how the body is read. By default (`'auto'`) it follows the response's `Content-Type` —
JSON is parsed, `text/html` and XML come back as text, anything else as an `ArrayBuffer`, and an
empty response with no `Content-Type` as `null`. It also accepts a body method (`'json'`, `'text'`,
…), a function, or a map from mime type to handler.

A response that is not `ok` puts the parsed body in `error` rather than `data`, and clears `data`.

## Skipping and repeating requests

Requesting the same url with the same body and `disabled` flag as the previous request does nothing
— which keeps a `fetch` inside a reactive block from looping. `force: true` overrides that, and is
what `refresh()` uses. `once: true` stops after the first successful load, and `disabled: true`
makes no request at all.

Responses are matched to their requests, so one that arrives after a newer request has already
settled is discarded rather than overwriting it.

## Shared errors

A `FetchErrors` instance passed as `errors` collects failures from every `FetchState` that shares
it, which is how an app shows one error surface rather than handling each call site:

```js
import { FetchErrors, initFetchClient } from '@layerstack/svelte-state';

const errors = new FetchErrors();
initFetchClient({ errors });
```

`initFetchClient` sets the default config for every `FetchState` created below it in the component
tree. Set `suppressErrors: true` to keep one request's failures out of the shared collection.

An instance's own errors are removed from the collection by `dispose()`. The store did this
automatically when its last subscriber went away; wire it up where that matters:

```js
$effect(() => state.dispose);
```

## Transforming

`onDataChange(newData, previousData)` and `onResponseChange(response, state)` run when those
change, and replace `data` if they return a value — enough to accumulate pages, or to read a
header the body does not carry.
