<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { ButtonProps } from './Button.svelte';

  type CopyButtonOwnProps = {
    /** The text to copy, or a function returning it */
    value: string | (() => string);
    /** Confirmation shown after copying.  `null` disables it */
    message?: string | null;
    /** How long the confirmation stays visible, in milliseconds */
    messageDuration?: number;
    class?: string;
    children?: Snippet;
  };

  export type CopyButtonProps = CopyButtonOwnProps & Omit<ButtonProps, keyof CopyButtonOwnProps>;
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  let {
    value,
    message = 'Copied!',
    messageDuration = 3000,
    class: className,
    onclick,
    children,
    ...restProps
  }: CopyButtonProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
  const { classes: settingsClasses, defaults } = getComponentSettings('CopyButton');

  let showMessage = $state(false);

  $effect(() => {
    if (!showMessage) return;

    // Re-runs (and re-arms) only when the message is shown again, not on every render
    const timeoutId = setTimeout(() => (showMessage = false), messageDuration);
    return () => clearTimeout(timeoutId);
  });
</script>

<Button
  icon={icons.copy}
  {...defaults}
  {...restProps}
  class={cls('CopyButton', settingsClasses.root, className)}
  onclick={(e) => {
    navigator.clipboard.writeText(typeof value === 'function' ? value() : value);
    if (message) {
      showMessage = true;
    }
    // `Button` renders either a `<button>` or an `<a>`, so its `onclick` is a union of the two
    // handler signatures — the event we received satisfies whichever one is in play
    (onclick as (event: typeof e) => void | undefined)?.(e);
  }}
>
  {#if children}
    {@render children()}
  {:else if showMessage && message}
    <span transition:slide={{ axis: 'x', duration: 200 }}>{message}</span>
  {/if}
</Button>
