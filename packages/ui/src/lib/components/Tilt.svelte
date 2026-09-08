<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type TiltOwnProps = {
    /** Maximum rotation in degrees, in either direction */
    maxRotation?: number;
    /** Also vary brightness with the pointer's vertical position */
    setBrightness?: boolean;
    class?: string;
    children?: Snippet;
  };

  export type TiltProps = TiltOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof TiltOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { scaleLinear } from 'd3-scale';

  import { getComponentClasses } from './theme.js';

  let {
    maxRotation = 20,
    setBrightness = false,
    class: className,
    children,
    ...restProps
  }: TiltProps = $props();

  const settingsClasses = getComponentClasses('Tilt');

  let width = $state(0);
  let height = $state(0);

  let rotateX = $state(0);
  let rotateY = $state(0);
  let brightness = $state(1);

  const scaleX = $derived(scaleLinear().domain([0, height]).range([-maxRotation, maxRotation]));
  const scaleY = $derived(scaleLinear().domain([0, width]).range([maxRotation, -maxRotation]));
  const scaleBrightness = $derived(scaleLinear().domain([0, height]).range([2.0, 1.0]));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  {...restProps}
  style:--rotateX="{rotateX}deg"
  style:--rotateY="{rotateY}deg"
  style:--brightness={brightness}
  class={cls(
    'Tilt [perspective:600px]',
    '*:[transform:rotateX(var(--rotateX))_rotateY(var(--rotateY))]',
    '*:brightness-(--brightness)',
    settingsClasses.root,
    className
  )}
  bind:clientWidth={width}
  bind:clientHeight={height}
  onmousemove={(e) => {
    rotateY = scaleY(e.offsetX);
    rotateX = scaleX(e.offsetY);
    if (setBrightness) {
      brightness = scaleBrightness(e.offsetY);
    }
  }}
  onmouseleave={() => {
    rotateX = 0;
    rotateY = 0;
    brightness = 1;
  }}
>
  {@render children?.()}
</div>
