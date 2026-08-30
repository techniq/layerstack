<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';

  export type DividerDotProps = { class?: string } & HTMLAttributes<HTMLSpanElement>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let { class: className, ...restProps }: DividerDotProps = $props();

  const settingsClasses = getComponentClasses('DividerDot');
</script>

<span {...restProps} class={cls('DividerDot mx-1', settingsClasses.root, className)}> • </span>
