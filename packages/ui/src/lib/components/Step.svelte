<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  import type { IconData } from '../types/index.js';

  type StepOwnProps = {
    /** Override the point's content.  Defaults to an incrementing counter */
    point?: string;
    /** Render an icon in the point instead of its content */
    icon?: IconData;
    /** Color the point and the line leading up to it */
    completed?: boolean;
    class?: string;
    classes?: {
      root?: string;
      label?: string;
      line?: string;
      point?: string;
      /** Applied to the point and line of a completed step */
      completed?: string;
    };
    /** Replaces the point's content */
    pointSnippet?: Snippet;
    children?: Snippet;
  };

  export type StepProps = StepOwnProps & Omit<HTMLLiAttributes, keyof StepOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getSteps } from './Steps.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    point,
    icon,
    completed = false,
    class: className,
    classes = {},
    pointSnippet,
    children,
    ...restProps
  }: StepProps = $props();

  const settingsClasses = getComponentClasses('Step');
  const stepsContext = getSteps();

  const vertical = $derived(stepsContext?.vertical ?? false);
</script>

<li
  {...restProps}
  class={cls(
    'Step',
    'group grid place-items-center text-center',
    vertical
      ? 'grid-cols-[40px_1fr] gap-2 min-h-16 justify-items-start'
      : 'grid-rows-[40px_1fr] min-w-16',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <div
    class={cls(
      'group-first:hidden col-start-1 row-start-1 bg-surface-300 text-surface-content top-0',
      vertical ? 'h-full w-2 -mt-[100%] justify-self-center' : 'h-2 w-full -ml-[100%]',
      completed && (settingsClasses.completed ?? classes.completed ?? 'bg-primary'),
      settingsClasses.line,
      classes.line
    )}
  ></div>

  <span class={cls(settingsClasses.label, classes.label)}>
    {@render children?.()}
  </span>

  <div
    class={cls(
      'bg-surface-300 text-surface-content relative col-start-1 row-start-1 grid size-8 place-items-center place-self-center rounded-full [counter-increment:step]',
      point == null &&
        pointSnippet === undefined &&
        icon == null &&
        'before:content-[counter(step)]',
      completed &&
        (settingsClasses.completed ?? classes.completed ?? 'bg-primary text-primary-content'),
      settingsClasses.point,
      classes.point
    )}
  >
    {#if pointSnippet}
      {@render pointSnippet()}
    {:else if icon}
      <Icon data={icon} />
    {:else}
      {point ?? ''}
    {/if}
  </div>
</li>
