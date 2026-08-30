---
title: SelectionState
description: Manage item selection state including toggling values, selecting all, and clear or reset selection
related: [svelte-state/UniqueState, ui/MultiSelect, ui/Selection]
---

## Usage

```js
import { SelectionState } from '@layerstack/svelte-state';

const state = new SelectionState();

state.current.has(value);
state.current.size;
state.add(value);
state.delete(value);
state.toggle(value);
```

## Basic

:example{name="basic" showCode}

## Initial selection

:example{name="initial-selection"}

## Max

:example{name="max"}

## Select all

:example{name="select-all"}

## Single

:example{name="single"}

## Set selection

:example{name="set-selection"}
