<script lang="ts" module>
  import type { Component, Snippet } from 'svelte';
  import type { SVGAttributes } from 'svelte/elements';
  import type { IconData } from '../types/index.js';

  /** In-flight/resolved `svgUrl` fetches, shared across every `Icon` instance */
  const cache = new Map<string, Promise<string>>();

  type IconOwnProps = {
    /** Sets both `width` and `height`.  Defaults to the scale used by unplugin-icons */
    size?: string | number;
    width?: string | number;
    height?: string | number;
    viewBox?: string;
    /** One or more SVG path `d` values */
    path?: string | string[];
    /**
     * An icon component, a Font Awesome definition, or a string holding an SVG path, an inline
     * `<svg>`, or a URL to fetch one from
     */
    data?: IconData;
    /** Inline `<svg>` markup */
    svg?: string;
    /** URL to fetch inline `<svg>` markup from */
    svgUrl?: string;

    /** Accessible name.  Renders a `<title>` and labels the icon */
    title?: string;
    /** Accessible description.  Renders a `<desc>` and labels the icon */
    desc?: string;
    titleId?: string;
    descId?: string;

    class?: string;
    classes?: {
      root?: string;
      path?: string | string[];
    };
    children?: Snippet;
  };

  /**
   * Remaining attributes are spread onto whichever element is rendered — an `<svg>`, a `<span>`
   * (for inline/fetched markup and `children`), or the icon component passed as `data`.  Typed as
   * SVG attributes since that is the common case; the element type is left open so the same
   * attributes fit all three.  Own props are omitted so declarations like `path?: string | string[]`
   * are not narrowed by the SVG attribute of the same name.
   */
  export type IconProps = IconOwnProps & Omit<SVGAttributes<any>, keyof IconOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { uniqueId } from '@layerstack/utils';

  import { getComponentClasses } from './theme.js';

  let {
    size = '1.2em', // default scale of unplugin-icons - https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#options
    width: widthProp,
    height: heightProp,
    viewBox: viewBoxProp = '0 0 24 24',
    path: pathProp = '',
    data,
    svg: svgProp,
    svgUrl: svgUrlProp,
    title,
    desc,
    titleId,
    descId,
    class: className,
    classes = {},
    children,
    ...restProps
  }: IconProps = $props();

  const settingsClasses = getComponentClasses('Icon');

  // `data` conveniently also accepts a path, inline `<svg>`, or a URL
  const dataString = $derived(typeof data === 'string' ? data : undefined);
  const dataIsSvg = $derived(dataString?.toLowerCase().includes('<svg') ?? false);
  const dataIsUrl = $derived(dataString?.toLowerCase().includes('http') ?? false);

  const faIcon = $derived(
    typeof data === 'object' && data !== null && 'icon' in data ? data : undefined
  );

  const svgUrl = $derived(svgUrlProp ?? (dataIsUrl ? dataString : undefined));

  let fetchedSvg = $state<string>();

  $effect(() => {
    if (!svgUrl) return;

    let request = cache.get(svgUrl);
    if (!request) {
      const url = svgUrl;
      request = fetch(url)
        .then((resp) => resp.text())
        .catch(() => {
          // Failed request, drop the promise so it is fetched again next time
          cache.delete(url);
          // TODO: Consider showing error icon
          return '';
        });
      cache.set(url, request);
    }

    let current = true;
    request.then((text) => {
      if (current) fetchedSvg = text;
    });
    return () => {
      current = false;
    };
  });

  const svg = $derived(svgProp ?? (dataIsSvg ? dataString : undefined) ?? fetchedSvg);

  // Font Awesome icons are sized in `rem` rather than following the surrounding font size.  An
  // explicit `width`/`height` still wins (in Svelte UX it was silently overridden).
  const isFontAwesome = $derived(
    faIcon !== undefined || (svg?.includes('fontawesome.com') ?? false)
  );
  const width = $derived(widthProp ?? (isFontAwesome ? '1.0rem' : size));
  const height = $derived(heightProp ?? (isFontAwesome ? '1.0rem' : size));

  const viewBox = $derived(faIcon ? `0 0 ${faIcon.icon[0]} ${faIcon.icon[1]}` : viewBoxProp);
  const path = $derived(
    faIcon
      ? faIcon.icon[4]
      : dataString !== undefined && !dataIsSvg && !dataIsUrl
        ? dataString
        : pathProp
  );

  const isLabelled = $derived(Boolean(title || desc));
  const generatedTitleId = uniqueId('title-');
  const generatedDescId = uniqueId('desc-');
  const resolvedTitleId = $derived(titleId ?? (title ? generatedTitleId : ''));
  const resolvedDescId = $derived(descId ?? (desc ? generatedDescId : ''));

  const rootClass = $derived(
    cls('Icon', 'inline-block shrink-0', settingsClasses.root, classes.root, className)
  );
</script>

{#if typeof data === 'function'}
  <!-- Icon component -->
  <!-- narrowed to a single component type: type-checking a spread against the `IconComponent`
       union (svg component | lucide component) blows past TypeScript's union complexity limit -->
  {@const IconComponent = data as Component<SVGAttributes<any>>}
  <IconComponent
    class={cls(
      'Icon',
      'icon-container inline-block shrink-0 align-middle',
      'size-[1.2em]', // default scale of unplugin-icons - https://github.com/unplugin/unplugin-icons?tab=readme-ov-file#options
      settingsClasses.root,
      classes.root,
      className
    )}
    role={isLabelled ? 'img' : 'presentation'}
    aria-labelledby={isLabelled ? `${resolvedTitleId} ${resolvedDescId}` : undefined}
    {...restProps}
  />
{:else if svg || svgUrl || children}
  <span
    class={cls(rootClass, 'icon-container align-middle fill-current')}
    style:width
    style:height
    style:--width={width}
    style:--height={height}
    role={isLabelled ? 'img' : 'presentation'}
    aria-labelledby={isLabelled ? `${resolvedTitleId} ${resolvedDescId}` : undefined}
    {...restProps}
  >
    {#if children}
      {@render children()}
    {:else}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- `svg` is caller-provided markup -->
      {@html svg ?? ''}
    {/if}
  </span>
{:else}
  <svg
    {width}
    {height}
    {viewBox}
    class={cls(rootClass, 'fill-current')}
    role={isLabelled ? 'img' : 'presentation'}
    aria-labelledby={isLabelled ? `${resolvedTitleId} ${resolvedDescId}` : undefined}
    {...restProps}
  >
    {#if title}
      <title id={resolvedTitleId}>{title}</title>
    {/if}
    {#if desc}
      <desc id={resolvedDescId}>{desc}</desc>
    {/if}

    {#each Array.isArray(path) ? path : [path] as d, i (i)}
      <path
        {d}
        fill="currentColor"
        class={cls(
          Array.isArray(settingsClasses.path) ? settingsClasses.path[i] : settingsClasses.path,
          Array.isArray(classes.path) ? classes.path[i] : classes.path
        )}
      />
    {/each}
  </svg>
{/if}

<style>
  .icon-container :global(> svg) {
    width: var(--width);
    height: var(--height);
  }
</style>
