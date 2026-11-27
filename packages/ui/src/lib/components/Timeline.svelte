<script lang="ts" module>
  import { getContext, setContext, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import type { IconData } from '../types/index.js';
  import type { TimelineEventProps } from './TimelineEvent.svelte';

  export type TimelineContext = {
    readonly vertical: boolean;
    readonly compact: boolean;
    readonly icon: IconData;
    readonly snapPoint: boolean;
  };

  const timelineKey = Symbol();

  export function setTimeline(value: TimelineContext | undefined) {
    setContext(timelineKey, value);
  }

  export function getTimeline() {
    return getContext<TimelineContext | undefined>(timelineKey);
  }

  export type TimelineEventData = {
    start?: string | number | boolean;
    end?: string | number | boolean;
    icon?: IconData;
    completed?: boolean;
  };

  type TimelineOwnProps = {
    data?: TimelineEventData[];
    /** Align vertically rather than horizontally */
    vertical?: boolean;
    /** Place the timeline to one side, with all start/end values on the other */
    compact?: boolean;
    /** Common icon for every event */
    icon?: IconData;
    /** Snap the point to the start of the event */
    snapPoint?: boolean;
    class?: string;
    classes?: {
      root?: string;
      event?: TimelineEventProps['classes'];
    };
    /** Replaces the generated events */
    children?: Snippet<[{ data: TimelineEventData[] }]>;
  };

  export type TimelineProps = TimelineOwnProps &
    Omit<HTMLAttributes<HTMLUListElement>, keyof TimelineOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import TimelineEvent from './TimelineEvent.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    data = [],
    vertical = false,
    compact = false,
    icon,
    snapPoint = false,
    class: className,
    classes = {},
    children,
    ...restProps
  }: TimelineProps = $props();

  const settingsClasses = getComponentClasses('Timeline');

  setTimeline({
    get vertical() {
      return vertical;
    },
    get compact() {
      return compact;
    },
    get icon() {
      return icon;
    },
    get snapPoint() {
      return snapPoint;
    },
  });
</script>

<ul
  {...restProps}
  class={cls(
    'Timeline',
    'relative flex',
    vertical && 'flex-col timeline-vertical',
    settingsClasses.root,
    classes.root,
    className
  )}
>
  {#if children}
    {@render children({ data })}
  {:else}
    {#each data as item, i (i)}
      <TimelineEvent
        classes={classes.event}
        start={item.start}
        end={item.end}
        icon={item.icon}
        completed={item.completed}
      />
    {/each}
  {/if}
</ul>
