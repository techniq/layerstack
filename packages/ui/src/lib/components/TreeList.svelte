<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TreeNode } from '@layerstack/utils/array';

  export type TreeListProps = {
    nodes: TreeNode[];
    /** Attributes applied to each `<ul>`/`<li>`, or a function of the nodes they render */
    props?: {
      ul?:
        | HTMLAttributes<HTMLUListElement>
        | ((nodes: TreeNode[]) => HTMLAttributes<HTMLUListElement>);
      li?: HTMLAttributes<HTMLLIElement> | ((node: TreeNode) => HTMLAttributes<HTMLLIElement>);
    };
    class?: string;
    classes?: {
      ul?: string | ((nodes: TreeNode[]) => string);
      li?: string | ((node: TreeNode) => string);
    };
    children?: Snippet<[{ node: TreeNode }]>;
  };
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  // Svelte 5 replaces `<svelte:self>` with importing the component by name
  import TreeList from './TreeList.svelte';
  import { getComponentClasses } from './theme.js';

  let { nodes, props = {}, class: className, classes = {}, children }: TreeListProps = $props();

  const settingsClasses = getComponentClasses('TreeList');
</script>

<ul
  {...typeof props.ul === 'function' ? props.ul(nodes) : props.ul}
  class={cls(
    'TreeList',
    typeof settingsClasses.ul === 'string' ? settingsClasses.ul : settingsClasses.ul?.(nodes),
    typeof classes.ul === 'string' ? classes.ul : classes.ul?.(nodes),
    className
  )}
>
  {#each nodes ?? [] as node (node)}
    <li
      data-level={node.level}
      class={cls(
        typeof settingsClasses.li === 'string' ? settingsClasses.li : settingsClasses.li?.(node),
        typeof classes.li === 'string' ? classes.li : classes.li?.(node)
      )}
      {...typeof props.li === 'function' ? props.li(node) : props.li}
    >
      {@render children?.({ node })}
      {#if node.children}
        <TreeList nodes={node.children} {classes} {props} {children} />
      {/if}
    </li>
  {/each}
</ul>
