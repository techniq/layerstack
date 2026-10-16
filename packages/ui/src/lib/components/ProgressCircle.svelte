<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type ProgressCircleOwnProps = {
    /** Progress from `0` to `100`.  `null` renders an indeterminate (spinning) circle */
    value?: number | null;
    /** Rotation of the circle, in degrees */
    rotate?: number;
    /** Width and height of the circle, in pixels */
    size?: number;
    /** Stroke width, in pixels */
    width?: number;
    /** Show the unfilled portion of the track */
    track?: boolean;
    class?: string;
    /** Rendered in the center of the circle */
    children?: Snippet;
  };

  export type ProgressCircleProps = ProgressCircleOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof ProgressCircleOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentClasses } from './theme.js';

  let {
    value = null,
    rotate = 0,
    size = 40,
    width = 4,
    track = false,
    class: className,
    children,
    ...restProps
  }: ProgressCircleProps = $props();

  const settingsClasses = getComponentClasses('ProgressCircle');

  const radius = 20;

  const indeterminate = $derived(value == null);
  const circumference = $derived(2 * Math.PI * radius);
  const strokeDashArray = $derived(Math.round(circumference * 1000) / 1000);
  const strokeDashOffset = $derived(((100 - (value ?? 0)) / 100) * circumference + 'px');
  const viewBoxSize = $derived(radius / (1 - width / size));
  const strokeWidth = $derived((width / size) * viewBoxSize * 2);
</script>

<div
  role="progressbar"
  aria-valuenow={indeterminate ? undefined : value}
  aria-valuemin={indeterminate ? undefined : 0}
  aria-valuemax={indeterminate ? undefined : 100}
  {...restProps}
  class={cls(
    'ProgressCircle',
    'relative inline-flex justify-center items-center align-middle',
    settingsClasses.root,
    className
  )}
  class:indeterminate
  style:height="{size}px"
  style:width="{size}px"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="transform: rotate({rotate - (indeterminate ? 0 : 90)}deg)"
    viewBox="{viewBoxSize}
    {viewBoxSize}
    {2 * viewBoxSize}
    {2 * viewBoxSize}"
  >
    {#if track}
      <circle
        class="track"
        fill="transparent"
        cx={2 * viewBoxSize}
        cy={2 * viewBoxSize}
        r={radius}
        stroke-width={strokeWidth}
        stroke-dasharray={strokeDashArray}
        stroke-dashoffset={0}
      />
    {/if}

    <circle
      class="path"
      fill="transparent"
      cx={2 * viewBoxSize}
      cy={2 * viewBoxSize}
      r={radius}
      stroke-width={strokeWidth}
      stroke-dasharray={strokeDashArray}
      stroke-dashoffset={strokeDashOffset}
    />
  </svg>
  <div class="info">
    {@render children?.()}
  </div>
</div>

<style>
  svg {
    width: 100%;
    height: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }

  .indeterminate > svg {
    animation: rotate 1.4s linear infinite;
    transform-origin: center center;
    transition: all 0.2s ease-in-out;
  }
  .indeterminate .path {
    animation: dash 1.4s ease-in-out infinite;
    stroke-linecap: round;
    stroke-dasharray: 80, 200;
    stroke-dashoffset: 0px;
  }

  .info {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .track {
    stroke: var(--track-color, rgba(0, 0, 0, 0.1));
    z-index: 1;
  }

  .path {
    stroke: var(--path-color, currentColor);
    z-index: 2;
    transition: all 0.6s ease-in-out;
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0px;
    }

    50% {
      stroke-dasharray: 100, 200;
      stroke-dashoffset: -15px;
    }

    100% {
      stroke-dasharray: 100, 200;
      stroke-dashoffset: -125px;
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
