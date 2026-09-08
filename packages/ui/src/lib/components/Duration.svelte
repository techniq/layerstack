<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';
  import { DurationUnits } from '@layerstack/utils';
  import type { DurationOption } from '@layerstack/utils/duration';

  type DurationOwnProps = {
    start?: Date;
    /** Leave unset to tick against the current time */
    end?: Date;
    duration?: DurationOption;
    minUnits?: DurationUnits;
    /** Maximum number of units to display */
    totalUnits?: number;
    variant?: 'short' | 'long';
    class?: string;
  };

  export type DurationProps = DurationOwnProps &
    Omit<HTMLAttributes<HTMLSpanElement>, keyof DurationOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { Duration } from '@layerstack/utils';
  import { TimerState } from '@layerstack/svelte-state';

  import { getComponentClasses } from './theme.js';

  let {
    start,
    end,
    duration,
    minUnits = DurationUnits.Millisecond,
    totalUnits = 99,
    variant = 'short',
    class: className,
    ...restProps
  }: DurationProps = $props();

  const settingsClasses = getComponentClasses('Duration');

  /**
   * How often the display needs to change.  Once seconds are no longer shown there is nothing to
   * update more than once a minute.
   */
  function getDelay(endTime: Date | null) {
    const next = new Duration({ start, end: endTime, duration });

    const unitsMoreThanSeconds = [next?.years, next?.days, next?.hours, next?.minutes].filter(
      (x) => x
    ).length;

    // `DurationUnits` is indexed largest (Year) to smallest (Millisecond)
    if (minUnits < DurationUnits.Second || unitsMoreThanSeconds >= totalUnits) {
      return 60 * 1000;
    }
    return 1000;
  }

  // svelte-ignore state_referenced_locally
  const timer = new TimerState<Date>({
    delay: getDelay(null),
    disabled: end != null,
    tick: () => new Date(),
  });

  $effect(() => {
    // Re-evaluate the tick rate as the displayed duration grows
    const nextDelay = getDelay(timer.current);
    if (nextDelay !== timer.delay) {
      timer.delay = nextDelay;
    }
  });

  const displayDuration = $derived(
    new Duration({ start, end: end ?? timer.current, duration }).format({
      minUnits,
      totalUnits,
      variant,
    })
  );
</script>

<span {...restProps} class={cls('Duration', settingsClasses.root, className)}>
  {displayDuration}
</span>
