<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements';

  type RangeSliderOwnProps = {
    min?: number;
    max?: number;
    step?: number;
    /** Bindable `[start, end]` pair */
    value?: [number, number];
    disabled?: boolean;
    /** Hide the value bubbles shown while hovering or dragging */
    disableTooltips?: boolean;
    class?: string;
  };

  export type RangeSliderProps = RangeSliderOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof RangeSliderOwnProps>;

  type Which = 'start' | 'range' | 'end';
</script>

<script lang="ts">
  /*
    TODO (carried over from Svelte UX):
      - [ ] Support single and double thumb (array)
      - [ ] Circular variant
      - [ ] Support Dates, and other non-numbers with a `valueOf`
      - [ ] Change range color / gradient
      - [ ] Show min/max scale
  */
  import { Spring } from 'svelte/motion';
  import { fly } from 'svelte/transition';
  import { scaleLinear } from 'd3-scale';

  import { decimalCount, round } from '@layerstack/utils/number';
  import { movable } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    min = 0,
    max = 100,
    step = 1,
    value = $bindable([0, 100]),
    disabled = false,
    disableTooltips = false,
    class: className,
    ...restProps
  }: RangeSliderProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
  const settingsClasses = getComponentClasses('RangeSlider');

  const stepPercent = $derived(step / (max - min));
  const stepDecimals = $derived(decimalCount(step));
  const scale = $derived(scaleLinear().domain([min, max]).range([0, 1]).clamp(true));

  let isMoving = $state(false);
  let lastMoved = $state<Which>('range');
  let showStartValue = $state(false);
  let showEndValue = $state(false);
  let ignoreClickEvents = false;

  /** The track element — `movable` reports deltas in pixels, which need its width to scale */
  let rootEl: HTMLDivElement | undefined = $state();

  const start = new Spring(0);
  const end = new Spring(0);

  $effect(() => {
    start.target = scale(value[0]);
  });
  $effect(() => {
    end.target = scale(value[1]);
  });

  function applyMove(which: Which, deltaValue: number) {
    const [currentStartValue, currentEndValue] = value;
    // Round to fix float math (ex. `0.1 + 0.2` or `0.3 - 0.1`)
    const newStartValue = round(currentStartValue + deltaValue, stepDecimals);
    const newEndValue = round(currentEndValue + deltaValue, stepDecimals);

    switch (which) {
      case 'start':
        if (newStartValue >= min && newStartValue <= max) {
          value = [newStartValue, Math.max(currentEndValue, newStartValue)];
        }
        break;

      case 'range':
        if (newStartValue >= min && newEndValue <= max) {
          value = [newStartValue, newEndValue];
        }
        break;

      case 'end':
        if (newEndValue >= min && newEndValue <= max) {
          value = [Math.min(newEndValue, currentStartValue), newEndValue];
        }
        break;
    }
  }

  function moveHandlers(which: Which) {
    return {
      onMoveStart: () => {
        ignoreClickEvents = true;
        isMoving = true;
        lastMoved = which;
        if (which !== 'end') showStartValue = true;
        if (which !== 'start') showEndValue = true;
      },
      onMove: ({ dx }: { dx: number }) => {
        const trackWidth = rootEl?.getBoundingClientRect().width ?? 0;
        if (!trackWidth) return;
        applyMove(which, (max - min) * (dx / trackWidth));
      },
      onMoveEnd: () => {
        // Ignore the click that fires immediately after a drag ends
        setTimeout(() => (ignoreClickEvents = false), 100);
        isMoving = false;
        showStartValue = false;
        showEndValue = false;
      },
    };
  }

  function onMouseEnter(which: Which) {
    if (isMoving) return;
    if (which !== 'end') showStartValue = true;
    if (which !== 'start') showEndValue = true;
  }

  function onMouseLeave() {
    if (isMoving) return;
    showStartValue = false;
    showEndValue = false;
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_role_has_required_aria_props -->
<div
  bind:this={rootEl}
  {...restProps}
  class={cls(
    'RangeSlider',
    'group relative h-2 bg-surface-content/10 rounded-full select-none outline-hidden',
    disabled && 'pointer-events-none opacity-50',
    settingsClasses.root,
    className
  )}
  style="--start: {start.current}; --end: {end.current};"
  tabindex={disabled ? -1 : 0}
  role="slider"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={value[0]}
  onclick={(e) => {
    const target = e.target as HTMLDivElement;
    // Focus for keyboard input
    target.focus();

    if (ignoreClickEvents) return;

    let sliderRect: DOMRect;
    if (target.classList.contains('RangeSlider')) {
      sliderRect = target.getBoundingClientRect();
    } else if (target.classList.contains('range')) {
      sliderRect = target.parentElement!.getBoundingClientRect();
    } else {
      // Ignore clicks on thumbs and value bubbles
      return;
    }

    const deltaPercent = (e.clientX - sliderRect.x) / sliderRect.width;
    const newValue = min + (max - min) * deltaPercent;

    // Move whichever end is closest to the clicked point
    if (Math.abs(value[0] - newValue) < Math.abs(value[1] - newValue)) {
      value = [round(newValue, stepDecimals), value[1]];
      lastMoved = 'start';
    } else {
      value = [value[0], round(newValue, stepDecimals)];
      lastMoved = 'end';
    }
  }}
  onkeydown={(e) => {
    if (e.key === 'ArrowLeft') {
      applyMove(lastMoved, -step);
    } else if (e.key === 'ArrowRight') {
      applyMove(lastMoved, step);
    }
  }}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onmouseenter={() => onMouseEnter('range')}
    onmouseleave={onMouseLeave}
    style="
      left:  calc(var(--start) * 100%);
      right: calc((1 - var(--end)) * 100%);
    "
    class="range absolute top-0 bottom-0 bg-primary"
  ></div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onmouseenter={() => onMouseEnter('range')}
    onmouseleave={onMouseLeave}
    ondblclick={() => (value = [min, max])}
    style="left: calc((((var(--end) - var(--start)) / 2 ) + var(--start)) * 100%);"
    class={cls(
      'range-thumb',
      'absolute top-1/2 w-8 h-4 -translate-x-1/2 -translate-y-1/2',
      'rounded-full',
      'flex items-center justify-center',
      showStartValue || showEndValue ? 'opacity-100' : 'opacity-0',
      'transition-opacity'
    )}
    {@attach movable({ axis: 'x', stepPercent, ...moveHandlers('range') })}
  >
    <Icon data={icons.gripHorizontal} class="size-4 text-primary-content" />
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onmouseenter={() => onMouseEnter('start')}
    onmouseleave={onMouseLeave}
    ondblclick={() => (value = [min, value[1]])}
    style="left: calc(var(--start) * 100%);"
    class={cls(
      'thumb',
      'absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2',
      'border bg-white rounded-full outline-4',
      'hover:outline hover:outline-primary/20',
      (lastMoved === 'start' || lastMoved === 'range') &&
        'group-focus:outline group-focus:outline-primary/40'
    )}
    {@attach movable({ axis: 'x', stepPercent, ...moveHandlers('start') })}
  ></div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onmouseenter={() => onMouseEnter('end')}
    onmouseleave={onMouseLeave}
    ondblclick={() => (value = [value[0], max])}
    style="left: calc(var(--end) * 100%);"
    class={cls(
      'thumb',
      'absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2',
      'border bg-white rounded-full outline-4',
      'outline-primary/20',
      'hover:outline hover:outline-primary/20',
      (lastMoved === 'end' || lastMoved === 'range') &&
        'group-focus:outline group-focus:outline-primary/40'
    )}
    {@attach movable({ axis: 'x', stepPercent, ...moveHandlers('end') })}
  ></div>

  {#if showStartValue && !disableTooltips}
    <output
      style="left: calc(var(--start) * 100%);"
      class="value absolute top-1/2 -translate-x-1/2 -translate-y-[180%] text-xs text-primary-content bg-primary rounded-full px-2 shadow-sm"
      transition:fly={{ y: 4, duration: 300 }}
    >
      {value[0]}
    </output>
  {/if}

  {#if showEndValue && !disableTooltips}
    <output
      style="left: calc(var(--end) * 100%);"
      class="value absolute top-1/2 -translate-x-1/2 -translate-y-[180%] text-xs text-primary-content bg-primary rounded-full px-2 shadow-sm"
      transition:fly={{ y: 4, duration: 300 }}
    >
      {value[1]}
    </output>
  {/if}
</div>
