<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLLiAttributes } from 'svelte/elements';

  import type { IconData } from '../types/index.js';

  type TimelineEventOwnProps = {
    /** Value shown above (horizontal) or left (vertical) */
    start?: string | number | boolean;
    /** Value shown below (horizontal) or right (vertical) */
    end?: string | number | boolean;
    /** Icon shown on the timeline */
    icon?: IconData;
    /** Color the icon and the line leading up to this event */
    completed?: boolean;
    class?: string;
    classes?: {
      root?: string;
      start?: string;
      end?: string;
      point?: string;
      icon?: string;
      line?: string;
    };
    startSnippet?: Snippet;
    endSnippet?: Snippet;
    /** Replaces the point marker */
    pointSnippet?: Snippet;
  };

  export type TimelineEventProps = TimelineEventOwnProps &
    Omit<HTMLLiAttributes, keyof TimelineEventOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getTimeline } from './Timeline.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    start = false,
    end = false,
    icon,
    completed = false,
    class: className,
    classes = {},
    startSnippet,
    endSnippet,
    pointSnippet,
    ...restProps
  }: TimelineEventProps = $props();

  const settingsClasses = getComponentClasses('TimelineEvent');
  const timeline = getTimeline();

  const vertical = $derived(timeline?.vertical ?? false);
  const compact = $derived(timeline?.compact ?? false);
  const snapPoint = $derived(timeline?.snapPoint ?? false);
  const resolvedIcon = $derived(icon ?? timeline?.icon);

  const hasStart = $derived(Boolean(start) || startSnippet !== undefined);
  const hasEnd = $derived(Boolean(end) || endSnippet !== undefined);
</script>

<li
  {...restProps}
  class={cls(
    'TimelineEvent',
    'relative grid shrink-0 items-center',
    'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
    'grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)]',
    '[--color-completed:var(--color-primary)]',
    snapPoint
      ? vertical
        ? 'grid-rows-[0.25rem_auto_minmax(0,1fr)]'
        : 'grid-cols-[0.25rem_auto_minmax(0,1fr)]'
      : '',
    compact && vertical ? 'grid-cols-[0_auto_minmax(0,1fr)] grid-rows-[0_auto_minmax(0,1fr)]' : '',
    vertical && 'justify-items-center',
    completed &&
      'timelineevent-completed has-[~li.timelineevent-completed]:[&_hr:last-child]:bg-(--color-completed)',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <hr
    class={cls(
      'border-0 bg-surface-300',
      '[:first-child>&]:hidden',
      vertical
        ? 'w-1 h-full col-start-2 row-start-1 rounded-b'
        : 'w-full h-1 col-start-1 row-start-2 rounded-r',
      !resolvedIcon && 'rounded-none',
      completed && 'bg-[var(--color-completed)]',
      settingsClasses.line,
      classes.line
    )}
  />

  {#if hasStart}
    <div
      class={cls(
        'start',
        vertical
          ? 'col-start-1 col-end-2 row-start-1 row-end-4 self-center justify-self-end'
          : 'col-start-1 col-end-4 row-start-1 row-end-2 self-end justify-self-center m-1',
        compact
          ? vertical
            ? 'col-start-3 col-end-4 row-start-1 row-end-4 self-center justify-self-start'
            : 'col-start-1 col-end-4 row-start-3 row-end-4 self-start justify-self-center m-1'
          : '',
        settingsClasses.start,
        classes.start
      )}
    >
      {#if startSnippet}
        {@render startSnippet()}
      {:else}
        {start}
      {/if}
    </div>
  {/if}

  <div class={cls('point', 'col-start-2 row-start-2 grid', settingsClasses.point, classes.point)}>
    {#if pointSnippet}
      {@render pointSnippet()}
    {:else}
      <Icon
        data={resolvedIcon ?? 'M12 2A10 10 0 0 0 12 22A10 10 0 0 0 12 2Z'}
        size={resolvedIcon ? '1rem' : '.5rem'}
        class={cls(
          'icon',
          completed && 'text-[var(--color-completed)]',
          settingsClasses.icon,
          classes.icon
        )}
      />
    {/if}
  </div>

  {#if hasEnd}
    <div
      class={cls(
        'end',
        vertical
          ? 'col-start-3 col-end-4 row-start-1 row-end-4 self-center justify-self-start'
          : 'col-start-1 col-end-4 row-start-3 row-end-4 m-1 self-start justify-self-center',
        settingsClasses.end,
        classes.end
      )}
    >
      {#if endSnippet}
        {@render endSnippet()}
      {:else}
        {end}
      {/if}
    </div>
  {/if}

  <hr
    class={cls(
      'border-0 bg-surface-300',
      '[:last-child>&]:hidden',
      vertical
        ? 'w-1 h-full col-start-2 col-end-auto row-start-3 row-end-[none] rounded-t'
        : 'w-full h-1 col-start-3 col-end-[none] row-start-2 row-end-auto rounded-l',
      !resolvedIcon && 'rounded-none',
      settingsClasses.line,
      classes.line
    )}
  />
</li>
