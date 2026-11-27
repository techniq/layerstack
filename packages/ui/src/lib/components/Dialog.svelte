<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { PortalOptions } from '@layerstack/svelte-attachments';

  /** Passed to every `Dialog` snippet */
  export type DialogContext = {
    open: boolean;
    close: (options?: { force?: boolean }) => void;
  };

  type DialogOwnProps = {
    /** Bindable */
    open?: boolean;
    /** Render outside the current DOM hierarchy */
    portal?: PortalOptions;
    /** Ignore backdrop clicks and Escape — the dialog can only be closed explicitly */
    persistent?: boolean;
    /** Cover the dialog with a loading overlay */
    loading?: boolean | null;
    class?: string;
    classes?: {
      root?: string;
      dialog?: string;
      title?: string;
      actions?: string;
      backdrop?: string;
    };

    /** Called after the dialog opens */
    onOpen?: () => void;
    /** Called after the dialog closes */
    onClose?: () => void;
    /** Called when a `persistent` dialog refuses to close */
    onCloseAttempt?: () => void;

    /** Replaces the entire header, including the default `title` wrapper */
    header?: Snippet<[DialogContext]>;
    /** Rendered inside the default header wrapper */
    title?: Snippet<[DialogContext]>;
    /** Rendered in a footer bar.  Clicking a button here closes the dialog */
    actions?: Snippet<[DialogContext]>;
    children?: Snippet<[DialogContext]>;
  };

  export type DialogProps = DialogOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof DialogOwnProps>;
</script>

<script lang="ts">
  // https://twitter.com/SvelteSociety/status/1306310173393186816
  // https://svelte.dev/repl/033e824fad0a4e34907666e7196caec4?version=3.25.1
  import { scale } from 'svelte/transition';
  import { quadIn } from 'svelte/easing';

  import { focusMove, portal as portalAttachment } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import Backdrop from './Backdrop.svelte';
  import Overlay from './Overlay.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    open = $bindable(false),
    portal = true,
    persistent = false,
    loading = null,
    class: className,
    classes = {},
    onOpen,
    onClose,
    onCloseAttempt,
    header,
    title,
    actions,
    children,
    ...restProps
  }: DialogProps = $props();

  const settingsClasses = getComponentClasses('Dialog');

  let actionsEl: HTMLDivElement | undefined = $state();

  function close(options?: { force?: boolean }) {
    if (!open) return;

    if (!persistent || options?.force) {
      open = false;
    } else {
      onCloseAttempt?.();
    }
  }

  const context = $derived<DialogContext>({
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

  function onDialogClick(e: MouseEvent) {
    if (!(e.target instanceof Element)) return;

    if (actionsEl == null) {
      // Dialog is not open, or the target is no longer within the trigger
    } else if (actionsEl.contains(e.target)) {
      // Close when an action is clicked (but not the container itself).  Callers can opt out with
      // `e.stopPropagation()`
      if (e.target !== actionsEl) {
        close();
      }
    }
  }
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
    fadeParams={{ duration: 150 }}
    {portal}
  />
{/if}

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class={cls(
      'Dialog',
      'fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center pointer-events-none',
      settingsClasses.root,
      classes.root
    )}
    onclick={onDialogClick}
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
    role="presentation"
    {@attach portalAttachment(portal)}
  >
    <div
      role="dialog"
      {...restProps}
      class={cls(
        'dialog rounded-sm bg-surface-100 elevation-4 overflow-y-auto pointer-events-auto relative outline-hidden',
        settingsClasses.dialog,
        classes.dialog,
        className
      )}
      in:scale|global={{ duration: 150, easing: quadIn }}
      out:scale={{ duration: 150, easing: quadIn }}
      {@attach focusMove({ restoreFocus: true })}
    >
      {#if loading}
        <Overlay center class="rounded-sm">
          <ProgressCircle />
        </Overlay>
      {/if}

      {#if header}
        {@render header(context)}
      {:else if title}
        <div class={cls('text-xl font-bold pt-4 pb-2 px-6', settingsClasses.title, classes.title)}>
          {@render title(context)}
        </div>
      {/if}

      {@render children?.(context)}

      {#if actions}
        <div
          class={cls(
            'actions flex w-full justify-end p-2 bg-surface-content/5 border-t',
            settingsClasses.actions,
            classes.actions
          )}
          bind:this={actionsEl}
        >
          {@render actions(context)}
        </div>
      {/if}
    </div>
  </div>
{/if}
