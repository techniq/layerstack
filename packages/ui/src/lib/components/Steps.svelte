<script lang="ts" module>
  import { getContext, setContext, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { IconData } from '../types/index.js';
  import type { StepProps } from './Step.svelte';

  export type StepsContext = {
    readonly vertical: boolean;
  };

  const stepsKey = Symbol();

  export function setSteps(value: StepsContext | undefined) {
    setContext(stepsKey, value);
  }

  export function getSteps() {
    return getContext<StepsContext | undefined>(stepsKey);
  }

  export type StepData = {
    label: string;
    content?: string;
    icon?: IconData;
    completed?: boolean;
  };

  type StepsOwnProps = {
    data?: StepData[];
    /** Align vertically rather than horizontally */
    vertical?: boolean;
    class?: string;
    classes?: {
      root?: string;
      item?: StepProps['classes'];
    };
    /** Replaces the generated steps */
    children?: Snippet<[{ data: StepData[] }]>;
  };

  export type StepsProps = StepsOwnProps &
    Omit<HTMLAttributes<HTMLUListElement>, keyof StepsOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Step from './Step.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    data = [],
    vertical = false,
    class: className,
    classes = {},
    children,
    ...restProps
  }: StepsProps = $props();

  const settingsClasses = getComponentClasses('Steps');

  setSteps({
    get vertical() {
      return vertical;
    },
  });
</script>

<ul
  {...restProps}
  class={cls(
    'Steps',
    'inline-grid overflow-hidden overflow-x-auto auto-cols-fr [counter-reset:step]',
    vertical ? 'grid-flow-row' : 'grid-flow-col',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {#if children}
    {@render children({ data })}
  {:else}
    {#each data as item (item.label)}
      <Step classes={classes.item} icon={item.icon} completed={item.completed}>
        {item.label}
      </Step>
    {/each}
  {/if}
</ul>
