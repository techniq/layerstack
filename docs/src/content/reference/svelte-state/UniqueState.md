---
title: UniqueState
description: State to manage unique values using `Set` with improves ergonomics and better control of updates
related: [svelte-state/SelectionState]
---

## Usage

```js
import { UniqueState } from '@layerstack/svelte-state';

const state = new UniqueState();

state.current.has(value);
state.current.size;
state.add(value);
state.addEach([value1, value2]);
state.delete(value);
state.toggle(value);
state.reset();
state.clear();
```

## Basic

:example{name="basic" showCode}
