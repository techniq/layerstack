<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { OffsetOptions, Placement } from '@floating-ui/dom';

  import type { PopoverProps } from './Popover.svelte';

  /** Shared across instances so moving between adjacent tooltips shows the next one immediately */
  let lastShown: Date | null = null;

  type TooltipOwnProps = {
    title?: string;
    /** Bindable */
    open?: boolean;
    offset?: OffsetOptions;
    /** How long to hover before showing, in milliseconds */
    delay?: number;
    /** Underline the trigger with a dotted border */
    underline?: boolean;
    /** Show a `help` cursor over the trigger */
    cursor?: boolean;
    enabled?: boolean;
    placement?: Placement;
    autoPlacement?: boolean;
    matchWidth?: boolean;
    class?: string;
    classes?: {
      root?: string;
      popover?: string;
      title?: string;
      content?: string;
    };
    /** Replaces the default tooltip body */
    titleSnippet?: Snippet;
    /** The trigger */
    children?: Snippet;
  };

  export type TooltipProps = TooltipOwnProps &
    Omit<PopoverProps, keyof TooltipOwnProps | 'children' | 'anchorEl'>;
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import Popover from './Popover.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    title = '',
    open = $bindable(false),
    offset = 0,
    delay = 500,
    underline = false,
    cursor = false,
    enabled = true,
    placement = 'bottom',
    autoPlacement = false,
    matchWidth = false,
    class: className,
    classes = {},
    titleSnippet,
    children,
    ...restProps
  }: TooltipProps = $props();

  const settingsClasses = getComponentClasses('Tooltip');

  const hasTitle = $derived(Boolean(title) || titleSnippet !== undefined);

  let containerEl = $state<HTMLDivElement | undefined>();
  let timeoutId: ReturnType<typeof setTimeout>;

  function showTooltip(e: MouseEvent | FocusEvent) {
    if (
      delay === 0 ||
      e instanceof FocusEvent ||
      new Date().valueOf() - (lastShown?.valueOf() ?? 0) < 500
    ) {
      // No delay, keyboard focus, or another tooltip shown recently — show immediately
      lastShown = new Date();
      open = true;
    } else {
      timeoutId = setTimeout(() => {
        lastShown = new Date();
        open = true;
      }, delay);
    }
  }

  function hideTooltip() {
    clearTimeout(timeoutId);
    if (open) {
      lastShown = new Date();
    }
    open = false;
  }
</script>

{#if enabled && hasTitle}
  <Popover
    anchorEl={containerEl?.firstElementChild ?? undefined}
    {placement}
    {autoPlacement}
    {offset}
    {matchWidth}
    {open}
    class={cls('Tooltip pointer-events-none', settingsClasses.popover, classes.popover)}
    {...restProps}
  >
    {#if titleSnippet}
      {@render titleSnippet()}
    {:else}
      <div
        class={cls(
          'text-xs text-surface-100 bg-surface-content px-2 py-1 rounded-sm whitespace-nowrap',
          settingsClasses.title,
          classes.title
        )}
        transition:fly={{
          x: placement === 'left' ? 6 : placement === 'right' ? -6 : 0,
          y: placement === 'top' ? 6 : placement === 'bottom' ? -6 : 0,
          duration: 300,
        }}
      >
        {title}
      </div>
    {/if}
  </Popover>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={containerEl}
  class={cls('contents', settingsClasses.content, classes.content)}
  onmouseenter={showTooltip}
  onmouseleave={hideTooltip}
  onfocusin={(e) => {
    // TODO: Is there a better way to tell focus-from-click apart from focus-from-tab?
    if ((e.target as Element)?.parentElement?.querySelector(':focus-visible')) {
      showTooltip(e);
    } else {
      hideTooltip();
      lastShown = null;
    }
  }}
  onfocusout={hideTooltip}
  onclick={hideTooltip}
>
  {#if className || underline || cursor}
    <span
      class={cls(
        hasTitle && underline && 'border-b border-dotted',
        hasTitle && cursor && 'cursor-help',
        settingsClasses.root,
        classes.root,
        className
      )}
    >
      {@render children?.()}
    </span>
  {:else}
    {@render children?.()}
  {/if}
</div>
