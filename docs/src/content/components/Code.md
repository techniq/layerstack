---
description: Syntax-highlighted code block with copy, line numbers, and line highlighting
category: utility
related: [ui/CopyButton]
---

## Usage

```svelte
<script lang="ts">
  import { Code } from '@layerstack/ui';
</script>

<Code {source} language="ts" />
```

Highlighting is done by [shiki](https://shiki.style/), loaded lazily in the browser and shared
across every `Code` instance.

`shiki` and `@shikijs/transformers` are **optional peer dependencies** — a code block most apps
never render should not pull a syntax highlighter into everyone's bundle. Without them installed,
`Code` renders the source as plain text rather than failing.

```sh
npm install shiki @shikijs/transformers
```

Shared leading indentation is stripped, so a source held in a template literal highlights cleanly
without being flattened against the left margin first.

## Basic

:example{name="basic" showCode}

## Line numbers and highlighting

`highlight` takes a line spec such as `"1,3-5"`, and `copyButton="hover"` reveals the copy button
only on hover.

:example{name="options"}
