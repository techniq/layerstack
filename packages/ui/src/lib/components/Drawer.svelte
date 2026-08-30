<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { PortalOptions } from '@layerstack/svelte-attachments';

  export type DrawerContext = {
    open: boolean;
    close: (options?: { force?: boolean }) => void;
  };

  type DrawerOwnProps = {
    /** Bindable */
    open?: boolean;
    /** Render outside the current DOM hierarchy */
    portal?: PortalOptions;
    /** Ignore backdrop clicks and Escape — the drawer can only be closed explicitly */
    persistent?: boolean;
    /** Cover the drawer with a loading overlay */
    loading?: boolean | null;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    class?: string;
    classes?: {
      root?: string;
      backdrop?: string;
      actions?: string;
    };
    /** Called after the drawer opens */
    onOpen?: () => void;
    /** Called after the drawer closes */
    onClose?: () => void;
    /** Called when a `persistent` drawer refuses to close */
    onCloseAttempt?: () => void;
    /** Rendered in a footer bar */
    actions?: Snippet<[DrawerContext]>;
    children?: Snippet<[DrawerContext]>;
  };

  export type DrawerProps = DrawerOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof DrawerOwnProps>;
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { focusMove, portal as portalAttachment } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import Backdrop from './Backdrop.svelte';
  import Overlay from './Overlay.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    open = $bindable(true),
    portal = true,
    persistent = false,
    loading = null,
    placement = 'right',
    class: className,
    classes = {},
    onOpen,
    onClose,
    onCloseAttempt,
    actions,
    children,
    ...restProps
  }: DrawerProps = $props();

  const settingsClasses = getComponentClasses('Drawer');

  function close(options?: { force?: boolean }) {
    if (!open) return;

    if (!persistent || options?.force) {
      open = false;
    } else {
      onCloseAttempt?.();
    }
  }

  const context = $derived<DrawerContext>({
    get open() {
      return open;
    },
    close,
  });

  let wasOpen = open;
  $effect(() => {
    if (open === wasOpen) return;
    wasOpen = open;
    if (open) {
      onOpen?.();
    } else {
      onClose?.();
    }
  });

  const flyParams = $derived({
    x: placement === 'left' ? '-100%' : placement === 'right' ? '100%' : 0,
    y: placement === 'top' ? '-100%' : placement === 'bottom' ? '100%' : 0,
  });
</script>

<!-- Separate `{#if}` blocks work around a Svelte 5 regression: https://github.com/sveltejs/svelte/issues/12440 -->
{#if open}
  <Backdrop
    onclick={() => close()}
    onmouseup={(e) => {
      // Do not let the event reach a Popover's outside-click detection
      e.stopPropagation();
    }}
    class={cls('z-50', settingsClasses.backdrop, classes.backdrop)}
    {portal}
  />
{/if}

{#if open}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    role="dialog"
    tabindex="-1"
    {...restProps}
    class={cls(
      'Drawer',
      'bg-surface-100 fixed overflow-auto transform z-50 outline-hidden',
      {
        'h-full': ['left', 'right'].includes(placement),
        'w-full': ['top', 'bottom'].includes(placement),
        'top-0': ['top', 'left', 'right'].includes(placement),
        'bottom-0': placement === 'bottom',
        'left-0': ['top', 'left', 'bottom'].includes(placement),
        'right-0': placement === 'right',
      },
      settingsClasses.root,
      classes.root,
      className
    )}
    onmouseup={(e) => {
      // Prevent the event bubbling to outside-click handlers (ex. Popover/Menu)
      e.stopPropagation();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') {
        // Do not let the event reach a Popover's keydown handler
        e.stopPropagation();
        close();
      }
    }}
    in:fly|global={flyParams}
    out:fly={flyParams}
    {@attach portalAttachment(portal)}
    {@attach focusMove({ restoreFocus: true })}
  >
    {#if loading}
      <Overlay center class="rounded-sm">
        <ProgressCircle />
      </Overlay>
    {/if}

    {@render children?.(context)}

    {#if actions}
      <div
        class={cls(
          'actions absolute bottom-0 w-full flex justify-center bg-surface-content/5 p-1 border-t',
          settingsClasses.actions,
          classes.actions
        )}
      >
        {@render actions(context)}
      </div>
    {/if}
  </div>
{/if}
