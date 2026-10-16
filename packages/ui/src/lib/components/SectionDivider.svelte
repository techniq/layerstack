<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export type SectionDividerProps = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let { class: className, children, ...restProps }: SectionDividerProps = $props();

  const settingsClasses = getComponentClasses('SectionDivider');
</script>

<div
  {...restProps}
  class={cls('SectionDivider', 'flex items-center my-2', settingsClasses.root, className)}
>
  <div class="flex-1 border h-px rounded-full mr-2"></div>
  <div class="font-medium text-surface-content border px-4 rounded-full bg-surface-100 shadow-sm">
    {@render children?.()}
  </div>
  <div class="flex-1 border h-px rounded-full ml-2"></div>
</div>
