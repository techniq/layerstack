<script lang="ts" module>
  import { setContext, getContext, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ButtonColor, ButtonRounded, ButtonSize, ButtonVariant } from '../types/index.js';

  /**
   * Group defaults read by descendant `Button`s.  Accessors rather than plain values so a group
   * whose props change updates the buttons inside it (in Svelte UX the context was a snapshot
   * taken at initialization).
   */
  type ButtonGroupContext = {
    readonly variant: ButtonVariant | undefined;
    readonly size: ButtonSize | undefined;
    readonly color: ButtonColor | undefined;
    readonly rounded: ButtonRounded | undefined;
  };

  const buttonGroupKey = Symbol();

  export function setButtonGroup(value: ButtonGroupContext | undefined) {
    setContext(buttonGroupKey, value);
  }

  export function getButtonGroup() {
    return getContext<ButtonGroupContext | undefined>(buttonGroupKey);
  }

  type ButtonGroupOwnProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: ButtonColor;
    rounded?: ButtonRounded;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
  };

  export type ButtonGroupProps = ButtonGroupOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof ButtonGroupOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import { getComponentSettings } from './settingsState.svelte.js';

  const { classes: settingsClasses, defaults } = getComponentSettings('ButtonGroup');

  let {
    variant = defaults.variant,
    size = defaults.size,
    color = defaults.color,
    rounded = defaults.rounded,
    disabled = false,
    class: className,
    children,
    ...restProps
  }: ButtonGroupProps = $props();

  setButtonGroup({
    get variant() {
      return variant;
    },
    get size() {
      return size;
    },
    get color() {
      return color;
    },
    get rounded() {
      return rounded;
    },
  });

  const _class = $derived(
    cls(
      'ButtonGroup',
      'inline-flex',
      disabled && 'opacity-50 pointer-events-none',
      `variant-${variant}`, // used for per-variant group overrides below

      /* Remove left/right rounding if Button is not first/last, or if it is a child of an element
         that is first/last (ex. wrapped in a span for menu/tooltip/etc) */
      '[&_.Button:not(:first-child)]:rounded-l-none',
      '[&_.Button:not(:last-child)]:rounded-r-none',
      '[&_:not(:first-child)_.Button]:rounded-l-none',
      '[&_:not(:last-child)_.Button]:rounded-r-none',

      /* Overlap borders to allow selection styling per Button.  Should be used with z-index */
      '[&.variant-outline_.Button:not(:first-child)]:-ml-px',
      '[&.variant-outline_:not(:first-child)_.Button]:-ml-px',
      '[&.variant-fill-outline_.Button:not(:first-child)]:-ml-px',
      '[&.variant-fill-outline_:not(:first-child)_.Button]:-ml-px',

      /* Add gap between buttons (default, filled) */
      '[&.variant-default_.Button:not(:first-child)]:ml-px',
      '[&.variant-default_:not(:first-child)_.Button]:ml-px',
      '[&.variant-fill_.Button:not(:first-child)]:ml-px',
      '[&.variant-fill_:not(:first-child)_.Button]:ml-px',
      '[&.variant-fill-light_.Button:not(:first-child)]:ml-px',
      '[&.variant-fill-light_:not(:first-child)_.Button]:ml-px',

      settingsClasses.root,
      className
    )
  );
</script>

<div role="group" class={_class} {...restProps}>
  {@render children?.()}
</div>
