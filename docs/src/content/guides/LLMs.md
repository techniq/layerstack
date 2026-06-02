---
title: LLMs
description: Using the LayerStack documentation with LLMs
order: 99
---

<script>
  import OpenWithButton from '$lib/components/OpenWithButton.svelte';
</script>

The LayerStack documentation is designed to be useful both for human developers working alongside LLMs and for large language models ingesting the docs directly.

## :icon{name="lucide:user" class="relative -top-1"} For the humans

<OpenWithButton example />

At the top of each documentation page — and demonstrated above — you'll find a button that copies the page's documentation as Markdown to your clipboard. The dropdown also offers handy options such as viewing the source or opening the page in a chat assistant.

::note
The `View Component source` option is only shown for pages with a linked source file.
::

## :icon{name="lucide:bot" class="relative -top-1"} For the bots

LayerStack adopts the [llms.txt](https://llmstxt.org/) proposal — a structured, machine-readable format optimized for LLMs — so tools and AI systems can efficiently parse the documentation.

## LLM-friendly documentation

::steps

### Per page

Append `/llms.txt` to any documentation page's URL to get its content as plain-text, LLM-optimized Markdown — the same text the `Copy Page` button copies.

:::tip
**Standard page**: [/docs/svelte-stores/debounceStore](/docs/svelte-stores/debounceStore)

**LLM-friendly version**: [/docs/svelte-stores/debounceStore/llms.txt](/docs/svelte-stores/debounceStore/llms.txt)
:::

### Root index

To explore every page in LLM-friendly format, visit the root index at [llms.txt](/llms.txt).

### Complete documentation

For a single, consolidated document containing all of the documentation, see [/docs/llms.txt](/docs/llms.txt).

::
