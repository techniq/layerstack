---
title: format
description: Easily format numbers and dates to a variety of formats and locales
---

## Usage

```js
import { format } from '@layerstack/utils';
format(123.456, 'decimal');
```

## Playgrounds

### Playground numbers

:example{name="playground-numbers" showCode}

### Playground dates

:example{name="playground-dates"}

## Numbers

### format (default settings)

:example{name="numbers-default"}

### format (additional options)

You can customize numbers with the 3rd arg that is an enhanced `Intl.NumberFormatOptions` type.

:example{name="numbers-options"}

### config

You can customize numbers with a config option.

:example{name="numbers-config"}

## Dates

### Custom format

:example{name="dates-custom"}

### Period types

Each `periodType` supports `short`, `default`, and `long` variants.

:example{name="dates-period-types"}
