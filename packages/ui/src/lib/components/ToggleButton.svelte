<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { TransitionConfig } from 'svelte/transition';

  import type { TransitionParams } from '../types/index.js';
  import type { ButtonProps } from './Button.svelte';
  import type { ToggleContext } from './Toggle.svelte';

  type ToggleButtonOwnProps = {
    /** Bindable */
    on?: boolean;
    /** Transition used by the `toggle` snippet.  `false` mounts and unmounts immediately */
    transition?: ((node: HTMLElement, params: TransitionParams) => TransitionConfig) | false;
    transitionParams?: TransitionParams;
    buttonPlacement?: 'before' | 'after';
    /** The button's own content */
    children?: Snippet<[ToggleContext]>;
    /** Rendered while `on` */
    toggle?: Snippet<[ToggleContext]>;
  };

  export type ToggleButtonProps = ToggleButtonOwnProps &
    Omit<ButtonProps, keyof ToggleButtonOwnProps>;
</script>

<script lang="ts">
  import { fade } from 'svelte/transition';

  import Button from './Button.svelte';
  import Toggle from './Toggle.svelte';
  import { getComponentSettings } from './settingsState.svelte.js';

  const { defaults } = getComponentSettings('ToggleButton');

  let {
    on = $bindable(false),
    transition = fade,
    transitionParams = {},
    buttonPlacement = 'before',
    children,
    toggle: toggleSnippet,
    ...restProps
  }: ToggleButtonProps = $props();
</script>

<Toggle bind:on>
  {#snippet children(ctx)}
    {#if buttonPlacement === 'before'}
      <Button {...defaults} {...restProps} onclick={ctx.toggle}>
        {@render children?.(ctx)}
      </Button>
    {/if}

    {#if ctx.on}
      {#if transition}
        <!-- Delays unmounting so children can transition out (ex. Drawer/Dialog) -->
        <div transition:transition={transitionParams}>
          {@render toggleSnippet?.(ctx)}
        </div>
      {:else}
        {@render toggleSnippet?.(ctx)}
      {/if}
    {/if}

    {#if buttonPlacement === 'after'}
      <Button {...defaults} {...restProps} onclick={ctx.toggle}>
        {@render children?.(ctx)}
      </Button>
    {/if}
  {/snippet}
</Toggle>
