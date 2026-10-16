---
title: TimerState
description: Manage interval ticks, useful for timely updates and countdowns
related: [ui/Duration, ui/ScrollingValue]
---

## Usage

```js
const timer = new TimerState();
```

```js
const timer = new TimerState<T>({ initial?: T, tick?: (value: T) => {...}, delay?: number, disabled?: boolean })
```

## Default

:example{name="basic" showCode}

## Tick count

:example{name="tick-count"}
