<script lang="ts" module>
  import type { HTMLProgressAttributes } from 'svelte/elements';

  type ProgressOwnProps = {
    /** `null` renders an indeterminate bar */
    value?: number | null;
    max?: number;
    class?: string;
  };

  export type ProgressProps = ProgressOwnProps &
    Omit<HTMLProgressAttributes, keyof ProgressOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let { value = null, max, class: className, ...restProps }: ProgressProps = $props();

  const settingsClasses = getComponentClasses('Progress');
</script>

<progress
  value={value ?? 0}
  {max}
  {...restProps}
  class={cls(
    'Progress',
    'h-2 w-full',

    // bar color
    '[--color:var(--color-primary)]',
    '[&::-webkit-progress-value]:bg-[var(--color)]',
    '[&::-moz-progress-bar]:bg-[var(--color)]',

    // track color
    '[--track-color:var(--color-surface-200)]',
    '[&::-webkit-progress-bar]:bg-[var(--track-color)]',
    'bg-[var(--track-color)]',

    // rounded
    '[&::-webkit-progress-value]:rounded-full',
    '[&::-moz-progress-bar]:rounded-full',
    '[&::-webkit-progress-bar]:rounded-full',
    'rounded-full',

    settingsClasses.root,
    className
  )}
></progress>
