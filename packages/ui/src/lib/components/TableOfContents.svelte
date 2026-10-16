<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TreeNode } from '@layerstack/utils/array';

  import type { TreeListProps } from './TreeList.svelte';

  type TableOfContentsOwnProps = {
    /** Selector for the element to collect headings from */
    element?: string;
    scrollContainer?: (Window & typeof globalThis) | HTMLElement | null;
    /** Offset from the top when deciding which heading is active */
    scrollOffset?: number;
    /** Deepest heading level to include (`h1`–`h6`) */
    maxDepth?: number;
    /** Indentation of each item, in pixels */
    itemIndent?: number;
    /** Indentation of each link, multiplied by its level */
    linkIndent?: number;
    class?: string;
    classes?: {
      root?: string;
      a?: string | ((node: TreeNode) => string);
    } & TreeListProps['classes'];
    props?: {
      a?:
        | HTMLAttributes<HTMLAnchorElement>
        | ((node: TreeNode) => HTMLAttributes<HTMLAnchorElement>);
    } & TreeListProps['props'];
    /** Called when a heading link is clicked */
    onNodeClick?: (node: TreeNode) => void;
    /** Replaces the whole item */
    children?: Snippet<[{ node: TreeNode; activeHeadingId: string }]>;
    /** Replaces the link's content */
    link?: Snippet<[{ node: TreeNode; activeHeadingId: string }]>;
  };

  export type TableOfContentsProps = TableOfContentsOwnProps &
    Omit<HTMLAttributes<HTMLUListElement>, keyof TableOfContentsOwnProps>;
</script>

<script lang="ts">
  import { BROWSER } from 'esm-env';
  import { buildTree } from '@layerstack/utils/array';
  import { cls } from '@layerstack/tailwind';

  import TreeList from './TreeList.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    element = 'main',
    scrollContainer = BROWSER ? window : null,
    scrollOffset = 0,
    maxDepth = 6,
    itemIndent = 0,
    linkIndent = 0,
    class: className,
    classes = {},
    props = {},
    onNodeClick,
    children: itemSnippet,
    link,
    ...restProps
  }: TableOfContentsProps = $props();

  const settingsClasses = getComponentClasses('TableOfContents');

  type HeadingNode = { id: string; name: string; level: number; element: HTMLElement };

  let activeHeadingId = $state('');
  let nodes = $state<TreeNode[]>([]);

  $effect(() => {
    const el = document.querySelector(element);

    const selector = Array.from({ length: maxDepth }, (_, i) => 'h' + (i + 1)).join(',');
    const headings: HeadingNode[] = Array.from(
      el?.querySelectorAll<HTMLElement>(selector) ?? [],
      (heading) => {
        if (!heading.hasAttribute('id')) {
          heading.setAttribute('id', heading.innerText.toLowerCase().replace(/\s+/g, '_'));
        }

        return {
          id: heading.id,
          name: heading.innerHTML,
          level: Number(heading.tagName[1]),
          element: heading,
        };
      }
    );

    nodes = buildTree(headings);
    // Highlight the first heading until something is scrolled past
    activeHeadingId = headings[0]?.id ?? '';

    function onScroll() {
      activeHeadingId =
        headings.find((heading) => heading.element.offsetTop >= window.scrollY + scrollOffset)
          ?.id ?? '';
    }

    scrollContainer?.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollContainer?.removeEventListener('scroll', onScroll);
  });
</script>

<TreeList
  {nodes}
  {classes}
  props={{
    li: {
      style: `margin-left: ${itemIndent}px`,
    },
    ...props,
  }}
  {...restProps}
  class={cls('TableOfContents', settingsClasses.root, className)}
>
  {#snippet children({ node })}
    {@const resolvedProps = typeof props.a === 'function' ? props.a(node) : props.a}
    {@const resolvedClass = typeof classes.a === 'function' ? classes.a(node) : classes.a}

    {#if itemSnippet}
      {@render itemSnippet({ node, activeHeadingId })}
    {:else}
      <a
        href="#{node.id}"
        data-level={node.level}
        data-active={node.id && node.id === activeHeadingId ? true : undefined}
        style={linkIndent ? `padding-left: ${linkIndent * node.level}px` : undefined}
        {...resolvedProps}
        class={cls('block', resolvedProps?.class, resolvedClass)}
        onclick={() => onNodeClick?.(node)}
      >
        {#if link}
          {@render link({ node, activeHeadingId })}
        {:else}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- heading markup from the page -->
          {@html node.name}
        {/if}
      </a>
    {/if}
  {/snippet}
</TreeList>
