---
title: SelectionState
description: Manage item selection state including toggling values, selecting all, and clear or reset selection
related: [svelte-state/UniqueState, components/MultiSelect, components/Selection]
---

## Usage

```js
import { SelectionState } from '@layerstack/svelte-state';

const state = new SelectionState();

state.current.has(value)
state.current.size
state.add(value);
state.delete(value);
state.toggle(value);
```

## Basic

:example{name="basic" showCode}

## Initial selection

:example{name="initial-selection" showCode}

## Max

:example{name="max" showCode}

## Select all

:example{name="select-all" showCode}

## Single

:example{name="single" showCode}

## Set selection

:example{name="set-selection" showCode}
