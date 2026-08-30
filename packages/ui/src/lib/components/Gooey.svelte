<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes, SVGAttributes } from 'svelte/elements';

  type GooeyOwnProps = {
    /** Apply a gaussian blur.  Required unless blurring externally (`filter: blur()`, ...) */
    blur?: number;
    /** `a4` of feColorMatrix — see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix */
    alphaPixel?: number;
    /** `a5` of feColorMatrix — see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix */
    alphaShift?: number;
    composite?: SVGAttributes<SVGFECompositeElement>['operator'];
    class?: string;
    classes?: {
      root?: string;
      svg?: string;
    };
    children?: Snippet;
  };

  export type GooeyProps = GooeyOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof GooeyOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { uniqueId } from '@layerstack/utils';

  import { getComponentClasses } from './theme.js';

  let {
    blur,
    alphaPixel = 255,
    alphaShift = -140,
    composite,
    class: className,
    classes = {},
    children,
    ...restProps
  }: GooeyProps = $props();

  const settingsClasses = getComponentClasses('Gooey');

  const filterId = uniqueId('filter-');
</script>

<svg class={cls('fixed inset-0 pointer-events-none', settingsClasses.svg, classes?.svg)}>
  <filter id={filterId}>
    {#if blur}
      <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur-sm" />
    {/if}

    <feColorMatrix
      in="blur"
      type="matrix"
      values="1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 {alphaPixel} {alphaShift}"
      result="goo"
    />

    {#if composite}
      <feComposite in="SourceGraphic" in2="goo" operator={composite} />
    {/if}
  </filter>
</svg>

<div
  style:filter="url(#{filterId})"
  {...restProps}
  class={cls('Gooey', 'inline-block', settingsClasses.root, classes?.root, className)}
>
  {@render children?.()}
</div>
