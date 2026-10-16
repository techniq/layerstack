<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type ShineOwnProps = {
    /** Color of the light */
    lightColor?: string;
    /** Size of the light */
    lightRadius?: number;
    /** Depth of the effect */
    depth?: number;
    /** Height of the surface for the lighting filter primitive */
    surfaceScale?: number;
    /** The bigger the value, the bigger the reflection */
    specularConstant?: number;
    /** Focus of the light source.  The bigger the value, the brighter the light */
    specularExponent?: number;
    class?: string;
    classes?: {
      root?: string;
      svg?: string;
    };
    children?: Snippet;
  };

  export type ShineProps = ShineOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof ShineOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { uniqueId } from '@layerstack/utils';

  import { getComponentClasses } from './theme.js';

  let {
    lightColor = '#666666',
    lightRadius = 300,
    depth = 1,
    surfaceScale = 2,
    specularConstant = 0.75,
    specularExponent = 120,
    class: className,
    classes = {},
    children,
    ...restProps
  }: ShineProps = $props();

  const settingsClasses = getComponentClasses('Shine');

  const filterId = uniqueId('filter-');

  let mouse = $state({ x: 0, y: 0 });
  let wrapperBox = $state({ left: 0, top: 0 });
  let wrapperEl: HTMLDivElement | null = $state(null);
</script>

<svelte:window
  onpointermove={(e) => {
    wrapperBox = wrapperEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
    mouse = { x: e.clientX, y: e.clientY };
  }}
  onscroll={() => {
    wrapperBox = wrapperEl?.getBoundingClientRect() ?? { left: 0, top: 0 };
  }}
/>

<svg class={cls('fixed inset-0 pointer-events-none', settingsClasses.svg, classes?.svg)}>
  <filter id={filterId} color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation={depth} />

    <feSpecularLighting
      result="light-source"
      {surfaceScale}
      {specularConstant}
      {specularExponent}
      lighting-color={lightColor}
    >
      <fePointLight x={mouse.x - wrapperBox.left} y={mouse.y - wrapperBox.top} z={lightRadius} />
    </feSpecularLighting>

    <feComposite result="reflections" in="light-source" in2="SourceAlpha" operator="in" />

    <feComposite
      in="SourceGraphic"
      in2="reflections"
      operator="arithmetic"
      k1="0"
      k2="1"
      k3="1"
      k4="0"
    />
  </filter>
</svg>

<div
  bind:this={wrapperEl}
  style:filter="url(#{filterId})"
  {...restProps}
  class={cls('Shine', 'inline-block', settingsClasses.root, classes?.root, className)}
>
  {@render children?.()}
</div>
