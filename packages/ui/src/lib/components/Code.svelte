<script lang="ts" module>
  import { BROWSER } from 'esm-env';
  import type { Highlighter } from 'shiki/bundle/web';

  /**
   * A single shiki highlighter (browser-only) shared by every `<Code>` instance.
   *
   * `shiki` is an optional peer dependency — when it is not installed the import fails and code
   * renders unhighlighted rather than breaking the page.
   */
  let highlighter = $state<Highlighter | null>(null);
  let metaHighlightTransformer = $state<(() => any) | null>(null);

  if (BROWSER) {
    import('shiki/bundle/web')
      .then(({ createHighlighter }) =>
        createHighlighter({
          themes: ['github-light-default', 'github-dark-default'],
          langs: [
            'svelte',
            'javascript',
            'js',
            'typescript',
            'ts',
            'json',
            'sh',
            'bash',
            'css',
            'html',
            'md',
          ],
        })
      )
      .then((h) => {
        highlighter = h;
      })
      .catch(() => {
        // `shiki` not installed — fall back to plain text
      });

    import('@shikijs/transformers')
      .then(({ transformerMetaHighlight }) => {
        metaHighlightTransformer = transformerMetaHighlight;
      })
      .catch(() => {
        // line highlighting unavailable
      });
  }

  /** Remove the indentation shared by all lines, so template-literal sources highlight cleanly */
  export function stripIndent(text: string): string {
    const lines = text.split('\n');
    const indents = lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
    const minIndent = indents.length ? Math.min(...indents) : 0;
    return (minIndent ? lines.map((line) => line.slice(minIndent)) : lines).join('\n').trim();
  }

  export type CodeProps = {
    source?: string | null;
    language?: string;
    copyButton?: boolean | 'hover';
    showLineNumbers?: boolean;
    /** Lines to highlight, ex. `"1,3-5"` */
    highlight?: string;
    classes?: { root?: string; pre?: string; code?: string };
    class?: string;
  };
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import CopyButton from './CopyButton.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    source = null,
    language = 'svelte',
    copyButton = true,
    showLineNumbers = false,
    highlight,
    classes = {},
    class: className,
  }: CodeProps = $props();

  const settingsClasses = getComponentClasses('Code');

  const sourceStr = $derived(stripIndent(source ?? ''));
</script>

<div
  class={cls(
    'Code',
    'rounded-sm overflow-hidden border',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <div
    class={cls(
      'relative bg-surface-100 dark:bg-surface-300 p-4 overflow-auto not-prose [tab-size:2]',
      copyButton === 'hover' && 'group',
      showLineNumbers && 'show-line-numbers'
    )}
  >
    {#if source}
      <!-- Keep <pre><code> tightly packed: Svelte preserves whitespace inside <pre>, so any
           newlines/indentation between these tags would render as leading blank lines. -->
      <!-- prettier-ignore -->
      <pre class={cls('whitespace-normal overflow-auto', classes.pre)}><code class={cls('text-sm', classes.code)}>{#if highlighter}{@html highlighter.codeToHtml(sourceStr, {
            lang: language,
            themes: { light: 'github-light-default', dark: 'github-dark-default' },
            meta: highlight ? { __raw: `{${highlight}}` } : undefined,
            transformers: highlight && metaHighlightTransformer ? [metaHighlightTransformer()] : undefined,
          })}{:else}{sourceStr}{/if}</code></pre>

      {#if copyButton !== false}
        <div
          class={cls(
            'absolute top-0 right-0 p-2 z-10',
            copyButton === 'hover' && 'opacity-0 group-hover:opacity-100 transition-opacity'
          )}
        >
          <CopyButton
            value={sourceStr}
            class="text-surface-content/70 hover:bg-surface-100/20 py-1 backdrop-blur-md"
            size="sm"
          />
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  :global(.shiki) {
    background-color: transparent !important;
  }

  :global(html.dark .shiki),
  :global(html.dark .shiki span) {
    color: var(--shiki-dark) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }

  /* Line highlighting */
  :global(.shiki .line.highlighted) {
    background-color: rgba(101, 117, 133, 0.16);
    margin: 0 -1rem;
    padding: 0 1rem;
    display: inline-block;
    width: calc(100% + 2rem);
  }

  :global(html.dark .shiki .line.highlighted) {
    background-color: rgba(142, 150, 170, 0.14);
  }

  /* Line numbers */
  .show-line-numbers :global(.shiki code) {
    counter-reset: line;
  }

  .show-line-numbers :global(.shiki .line::before) {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 2rem;
    margin-right: 1rem;
    text-align: right;
    color: rgba(115, 138, 148, 0.4);
    user-select: none;
  }
</style>
