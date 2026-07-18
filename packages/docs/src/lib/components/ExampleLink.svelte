<script lang="ts">
  import { cls } from '@layerstack/tailwind';
  import { tick, untrack, type ComponentProps } from 'svelte';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { navigating } from '$app/state';

  import LucideChevronRight from '~icons/lucide/chevron-right';
  import LucideFileCode2 from '~icons/lucide/file-code-2';
  import ExampleScreenshot from './ExampleScreenshot.svelte';
  import ImageLink from './ImageLink.svelte';
  import { exampleViewTransitionName } from '../utils/view-transitions.js';

  let {
    component,
    example,
    title,
    showComponent,
    variant = 'default',
    aspect = undefined,
    href,
    routeBase = '/docs/components',
    viewTransitionName,
    ...restProps
  }: {
    component: string;
    example: string;
    title?: string;
    showComponent?: boolean;
    variant?: ComponentProps<typeof ImageLink>['variant'];
    aspect?: ComponentProps<typeof ExampleScreenshot>['aspect'];
    href?: string;
    routeBase?: string;
    /**
     * Override the shared-element `view-transition-name`. Leave unset to auto-derive a
     * navigation-gated name; pass `null` to disable the transition for this link.
     */
    viewTransitionName?: string | null;
  } & Partial<ComponentProps<typeof ImageLink>> = $props();

  const resolvedHref = $derived(href ?? `${routeBase}/${component}/${example}`);

  // Restore the shared-element view transition, gated to only the link being navigated
  // to/from — otherwise every screenshot on a listing page would be snapshotted, hurting
  // performance and causing stacking-order glitches. The name is removed after navigation
  // (via `tick`) so it doesn't linger and conflict with the next transition.
  // Mount-time check only (were we navigated to a listing from this link?), so read the
  // current values untracked rather than subscribing.
  let enableViewTransition = $state(
    untrack(() => navigating.from?.url.pathname === resolvedHref)
  );
  beforeNavigate((navigation) => {
    if (navigation.to?.url.pathname === resolvedHref) {
      enableViewTransition = true;
    }
  });
  afterNavigate(() => {
    tick().then(() => {
      enableViewTransition = false;
    });
  });

  // An explicit `viewTransitionName` prop (including `null` to disable) overrides the
  // auto-derived, navigation-gated name.
  const resolvedViewTransitionName = $derived(
    viewTransitionName !== undefined
      ? viewTransitionName
      : enableViewTransition
        ? exampleViewTransitionName(component, example)
        : null
  );
</script>

<ImageLink href={resolvedHref} {variant} {...restProps}>
  {#snippet image()}
    <ExampleScreenshot
      {component}
      {example}
      {aspect}
      background={variant !== 'screenshot-only'}
      viewTransitionName={resolvedViewTransitionName}
    />
  {/snippet}

  {#snippet label()}
    <LucideFileCode2
      class={cls(
        'shrink-0 transition text-surface-content/50 mr-1',
        variant === 'default' && 'group-hover:text-primary-content/50'
      )}
    />

    {#if showComponent}
      <span>{component}</span>
      <LucideChevronRight
        class="shrink-0 text-surface-content/50 group-hover:text-primary-content/50"
      />
    {/if}
    <span class="first-letter:capitalize truncate">{title ?? example.replaceAll('-', ' ')}</span>
  {/snippet}
</ImageLink>
