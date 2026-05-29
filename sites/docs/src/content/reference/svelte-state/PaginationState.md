---
title: PaginationState
description: Manage pagination state including current page and page navigation (next/previous/first/last).  See related Paginate/Pagination components
related: [components/Paginate, components/Pagination]
---

## Usage

```js
import { PaginationState } from '@layerstack/svelte-state';

const state = new PaginationState({ total: 100 });

state.page
state.perPage
state.total
state.totalPages
state.from
state.to
state.isFirst
state.isLast
state.hasPrevious
state.hasNext
state.slice(data)
```
