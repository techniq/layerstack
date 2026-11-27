---
title: GraphState
description: Reactive GraphQL request state, built on FetchState
related: [svelte-state/FetchState, svelte-stores/graphStore]
---

## Usage

```js
import { GraphState, gql, initGraphClient } from '@layerstack/svelte-state';

// Once, near the root
initGraphClient({ url: '/graphql' });

const query = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
    }
  }
`;

const state = new GraphState({ query });

state.fetch({ variables: { id } });

state.loading;
state.data;
state.error;
```

`data` is the response's `data` payload, already unwrapped. A response carrying `errors` is treated
as a failure: `error` holds the GraphQL errors and `data` stays empty, rather than handing back a
half-filled result.

`gql` is a tag that joins the template into a plain string. It exists for editor tooling — syntax
highlighting and schema-aware completion — not to parse anything.

## Mutations

A query repeated with the same variables is skipped as a duplicate, the same as
[`FetchState`](/docs/svelte-state/FetchState). Mutations are not: sending one twice is two
operations, not a redundant read, so they always go out.

Detection is by the word `mutation` appearing in the query.

## Client config

`initGraphClient({ url, config })` provides the endpoint and a default
[`FetchConfig`](/docs/svelte-state/FetchState) for every `GraphState` below it, and also configures
plain `FetchState` instances there. Pass the config directly instead to construct outside a
component:

```js
const state = new GraphState({ query }, { url: '/graphql' });
```
