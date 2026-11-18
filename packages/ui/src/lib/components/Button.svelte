<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  import type {
    ButtonColor,
    ButtonRounded,
    ButtonSize,
    ButtonVariant,
    IconProp,
  } from '../types/index.js';
  import type { IconProps } from './Icon.svelte';

  type ButtonOwnProps = {
    type?: 'button' | 'submit' | 'reset';
    /** Renders an `<a>` instead of a `<button>` */
    href?: string;
    target?: string;
    fullWidth?: boolean;
    /** Icon data, an icon component, or `Icon` props */
    icon?: IconProp | IconProps;
    /** Render as a square/round icon button.  Defaults to `true` when there is an icon and no children */
    iconOnly?: boolean;
    /** Replace the icon with a spinner and disable interaction */
    loading?: boolean;
    disabled?: boolean;
    rounded?: ButtonRounded;
    variant?: ButtonVariant;
    size?: ButtonSize;
    color?: ButtonColor;
    class?: string;
    classes?: {
      root?: string;
      icon?: string;
      loading?: string;
    };
    children?: Snippet;
  };

  export type ButtonProps = ButtonOwnProps &
    Omit<HTMLButtonAttributes & HTMLAnchorAttributes, keyof ButtonOwnProps>;
</script>

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import ProgressCircle from './ProgressCircle.svelte';
  import { getButtonGroup } from './ButtonGroup.svelte';
  import { getComponentSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';

  const { classes: settingsClasses, defaults } = getComponentSettings('Button');

  let {
    type = 'button',
    href,
    target,
    fullWidth = false,
    icon,
    iconOnly: iconOnlyProp,
    loading = false,
    disabled = false,
    rounded: roundedProp,
    variant: variantProp,
    size: sizeProp,
    color: colorProp,
    class: className,
    classes = {},
    children,
    ...restProps
  }: ButtonProps = $props();

  const iconOnly = $derived(iconOnlyProp ?? (icon !== undefined && !children));

  // Fall back to the enclosing `ButtonGroup`, then to the configured component defaults
  const groupContext = getButtonGroup();
  const variant = $derived(variantProp ?? groupContext?.variant ?? defaults.variant ?? 'default');
  const size = $derived(sizeProp ?? groupContext?.size ?? defaults.size ?? 'md');
  const color = $derived(colorProp ?? groupContext?.color ?? defaults.color ?? 'default');
  const rounded = $derived(
    roundedProp ?? groupContext?.rounded ?? defaults.rounded ?? (iconOnly ? 'full' : true)
  );

  const _class = $derived(
    cls(
      'Button',
      'transition duration-200 ring-surface-content/60 touch-manipulation',
      'focus:outline-hidden focus-visible:ring-1',
      fullWidth ? 'flex w-full' : 'inline-flex',
      loading ? 'gap-2' : 'gap-1',
      variant === 'none' || !rounded ? '' : rounded === 'full' ? 'rounded-full' : 'rounded-sm',
      variant !== 'none' && [
        'items-center justify-center',
        'font-medium tracking-wider whitespace-nowrap',
        iconOnly
          ? {
              sm: 'text-sm p-1',
              md: 'text-base p-2',
              lg: 'text-lg p-3',
            }[size!]
          : {
              sm: 'text-xs px-2 py-1',
              md: 'text-sm px-4 py-2',
              lg: 'text-base px-6 py-3',
            }[size!],
      ],
      disabled && 'opacity-50 pointer-events-none',
      // Variant specific styles
      `variant-${variant}`,
      {
        default: '',
        outline: 'border focus-visible:ring-offset-1',
        fill: 'focus-visible:ring-offset-1',
        'fill-outline': 'border focus-visible:ring-offset-1',
        'fill-light': '',
        text: 'p-0',
        none: '',
      }[variant ?? 'none'],

      // Variant specific colors
      {
        default: {
          default: [
            'hover:[--bg-color:var(--color-surface-content)]/10',
            // '[--text-color:var(--color-surface-content)]', // inherit
            '[--ring-color:var(--color-surface-content)]/60',
          ],
          primary: [
            'hover:[--bg-color:var(--color-primary)]/10',
            '[--text-color:var(--color-primary)]',
            '[--ring-color:var(--color-primary)]/60',
          ],
          secondary: [
            'hover:[--bg-color:var(--color-secondary)]/10',
            '[--text-color:var(--color-secondary)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          accent: [
            'hover:[--bg-color:var(--color-accent)]/10',
            '[--text-color:var(--color-accent)]',
            '[--ring-color:var(--color-accent)]/60',
          ],
          neutral: [
            'hover:[--bg-color:var(--color-neutral)]/10',
            '[--text-color:var(--color-neutral)]',
            '[--ring-color:var(--color-neutral)]/60',
          ],
          info: [
            'hover:[--bg-color:var(--color-info)]/10',
            '[--text-color:var(--color-info)]',
            '[--ring-color:var(--color-info)]/60',
          ],
          success: [
            'hover:[--bg-color:var(--color-success)]/10',
            '[--text-color:var(--color-success)]',
            '[--ring-color:var(--color-success)]/60',
          ],
          warning: [
            'hover:[--bg-color:var(--color-warning)]/10',
            '[--text-color:var(--color-warning)]',
            '[--ring-color:var(--color-warning)]/60',
          ],
          danger: [
            'hover:[--bg-color:var(--color-danger)]/10',
            '[--text-color:var(--color-danger)]',
            '[--ring-color:var(--color-danger)]/60',
          ],
        },
        outline: {
          default: [
            'hover:[--bg-color:var(--color-surface-content)]/10',
            '[--border-color:var(--color-surface-content)]',
            '[--text-color:var(--color-surface-content)]',
            '[--ring-color:var(--color-surface-content)]/60',
          ],
          primary: [
            'hover:[--bg-color:var(--color-primary)]/10',
            '[--border-color:var(--color-primary)]',
            '[--text-color:var(--color-primary)]',
            '[--ring-color:var(--color-primary)]/60',
          ],
          secondary: [
            'hover:[--bg-color:var(--color-secondary)]/10',
            '[--border-color:var(--color-secondary)]',
            '[--text-color:var(--color-secondary)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          accent: [
            'hover:[--bg-color:var(--color-accent)]/10',
            '[--border-color:var(--color-accent)]',
            '[--text-color:var(--color-accent)]',
            '[--ring-color:var(--color-accent)]/60',
          ],
          neutral: [
            'hover:[--bg-color:var(--color-neutral)]/10',
            '[--border-color:var(--color-neutral)]',
            '[--text-color:var(--color-neutral)]',
            '[--ring-color:var(--color-neutral)]/60',
          ],
          info: [
            'hover:[--bg-color:var(--color-info)]/10',
            '[--border-color:var(--color-info)]',
            '[--text-color:var(--color-info)]',
            '[--ring-color:var(--color-info)]/60',
          ],
          success: [
            'hover:[--bg-color:var(--color-success)]/10',
            '[--border-color:var(--color-success)]',
            '[--text-color:var(--color-success)]',
            '[--ring-color:var(--color-success)]/60',
          ],
          warning: [
            'hover:[--bg-color:var(--color-warning)]/10',
            '[--border-color:var(--color-warning)]',
            '[--text-color:var(--color-warning)]',
            '[--ring-color:var(--color-warning)]/60',
          ],
          danger: [
            'hover:[--bg-color:var(--color-danger)]/10',
            '[--border-color:var(--color-danger)]',
            '[--text-color:var(--color-danger)]',
            '[--ring-color:var(--color-danger)]/60',
          ],
        },
        fill: {
          default: [
            `[--bg-color:var(--color-surface-content)]`,
            'hover:[--bg-color:var(--color-surface-content)]/80',
            '[--text-color:var(--color-surface-200)]',
            '[--ring-color:var(--color-surface-content)]/60',
          ],
          primary: [
            `[--bg-color:var(--color-primary)]`,
            'hover:[--bg-color:var(--color-primary-600)]',
            '[--text-color:var(--color-primary-content)]',
            '[--ring-color:var(--color-primary)]/60',
          ],
          secondary: [
            '[--bg-color:var(--color-secondary)]',
            'hover:[--bg-color:var(--color-secondary-600)]',
            '[--text-color:var(--color-secondary-content)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          accent: [
            '[--bg-color:var(--color-accent)]',
            'hover:[--bg-color:var(--color-accent-600)]',
            '[--text-color:var(--color-accent-content)]',
            '[--ring-color:var(--color-accent)]/60',
          ],
          neutral: [
            '[--bg-color:var(--color-neutral)]',
            'hover:[--bg-color:var(--color-neutral-600)]',
            '[--text-color:var(--color-neutral-content)]',
            '[--ring-color:var(--color-neutral)]/60',
          ],
          info: [
            `[--bg-color:var(--color-info)]`,
            'hover:[--bg-color:var(--color-info-600)]',
            '[--text-color:var(--color-info-content)]',
            '[--ring-color:var(--color-info)]/60',
          ],
          success: [
            `[--bg-color:var(--color-success)]`,
            'hover:[--bg-color:var(--color-success-600)]',
            '[--text-color:var(--color-success-content)]',
            '[--ring-color:var(--color-success)]/60',
          ],
          warning: [
            `[--bg-color:var(--color-warning)]`,
            'hover:[--bg-color:var(--color-warning-600)]',
            '[--text-color:var(--color-warning-content)]',
            '[--ring-color:var(--color-warning)]/60',
          ],
          danger: [
            `[--bg-color:var(--color-danger)]`,
            'hover:[--bg-color:var(--color-danger-600)]',
            '[--text-color:var(--color-danger-content)]',
            '[--ring-color:var(--color-danger)]/60',
          ],
        },
        'fill-light': {
          default: [
            '[--bg-color:var(--color-surface-content)]/10',
            'hover:[--bg-color:var(--color-surface-content)]/20',
            '[--text-color:var(--color-surface-content)]',
            '[--ring-color:var(--color-surface-content)]/60',
          ],
          primary: [
            '[--bg-color:var(--color-primary)]/10',
            'hover:[--bg-color:var(--color-primary)]/20',
            '[--text-color:var(--color-primary)]',
            '[--ring-color:var(--color-primary)]/60',
          ],
          secondary: [
            '[--bg-color:var(--color-secondary)]/10',
            'hover:[--bg-color:var(--color-secondary)]/20',
            '[--text-color:var(--color-secondary)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          accent: [
            '[--bg-color:var(--color-accent)]/10',
            'hover:[--bg-color:var(--color-accent)]/20',
            '[--text-color:var(--color-accent)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          neutral: [
            '[--bg-color:var(--color-neutral)]/10',
            'hover:[--bg-color:var(--color-neutral)]/20',
            '[--text-color:var(--color-neutral)]',
            '[--ring-color:var(--color-neutral)]/60',
          ],
          info: [
            '[--bg-color:var(--color-info)]/10',
            'hover:[--bg-color:var(--color-info)]/20',
            '[--text-color:var(--color-info)]',
            '[--ring-color:var(--color-info)]/60',
          ],
          success: [
            '[--bg-color:var(--color-success)]/10',
            'hover:[--bg-color:var(--color-success)]/20',
            '[--text-color:var(--color-success)]',
            '[--ring-color:var(--color-success)]/60',
          ],
          warning: [
            '[--bg-color:var(--color-warning)]/10',
            'hover:[--bg-color:var(--color-warning)]/20',
            '[--text-color:var(--color-warning)]',
            '[--ring-color:var(--color-warning)]/60',
          ],
          danger: [
            '[--bg-color:var(--color-danger)]/10',
            'hover:[--bg-color:var(--color-danger)]/20',
            '[--text-color:var(--color-danger)]',
            '[--ring-color:var(--color-danger)]/60',
          ],
        },
        'fill-outline': {
          default: [
            '[--bg-color:var(--color-surface-content)]/10',
            'hover:[--bg-color:var(--color-surface-content)]/20',
            '[--border-color:var(--color-surface-content)]',
            '[--text-color:var(--color-surface-content)]',
            '[--ring-color:var(--color-surface-content)]/60',
          ],
          primary: [
            '[--bg-color:var(--color-primary)]/10',
            'hover:[--bg-color:var(--color-primary)]/20',
            '[--border-color:var(--color-primary)]',
            '[--text-color:var(--color-primary)]',
            '[--ring-color:var(--color-primary)]/60',
          ],
          secondary: [
            '[--bg-color:var(--color-secondary)]/10',
            'hover:[--bg-color:var(--color-secondary)]/20',
            '[--border-color:var(--color-secondary)]',
            '[--text-color:var(--color-secondary)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          accent: [
            '[--bg-color:var(--color-accent)]/10',
            'hover:[--bg-color:var(--color-accent)]/20',
            '[--border-color:var(--color-accent)]',
            '[--text-color:var(--color-accent)]',
            '[--ring-color:var(--color-accent)]/60',
          ],
          neutral: [
            '[--bg-color:var(--color-neutral)]/10',
            'hover:[--bg-color:var(--color-neutral)]/20',
            '[--border-color:var(--color-neutral)]',
            '[--text-color:var(--color-neutral)]',
            '[--ring-color:var(--color-neutral)]/60',
          ],
          info: [
            '[--bg-color:var(--color-info)]/10',
            'hover:[--bg-color:var(--color-info)]/20',
            '[--border-color:var(--color-info)]',
            '[--text-color:var(--color-info)]',
            '[--ring-color:var(--color-info)]/60',
          ],
          success: [
            '[--bg-color:var(--color-success)]/10',
            'hover:[--bg-color:var(--color-success)]/20',
            '[--border-color:var(--color-success)]',
            '[--text-color:var(--color-success)]',
            '[--ring-color:var(--color-success)]/60',
          ],
          warning: [
            '[--bg-color:var(--color-warning)]/10',
            'hover:[--bg-color:var(--color-warning)]/20',
            '[--border-color:var(--color-warning)]',
            '[--text-color:var(--color-warning)]',
            '[--ring-color:var(--color-warning)]/60',
          ],
          danger: [
            '[--bg-color:var(--color-danger)]/10',
            'hover:[--bg-color:var(--color-danger)]/20',
            '[--border-color:var(--color-danger)]',
            '[--text-color:var(--color-danger)]',
            '[--ring-color:var(--color-danger)]/60',
          ],
        },
        text: {
          default: [
            '[--text-color:var(--color-surface-content)]',
            'hover:[--text-color:var(--color-surface-content)]/80',
            '[--ring-color:var(--color-surface-content)]/60',
          ],
          primary: [
            '[--text-color:var(--color-primary)]',
            'hover:[--text-color:var(--color-primary-700)]',
            '[--ring-color:var(--color-primary)]/60',
          ],
          secondary: [
            '[--text-color:var(--color-secondary)]',
            'hover:[--text-color:var(--color-secondary-700)]',
            '[--ring-color:var(--color-secondary)]/60',
          ],
          accent: [
            '[--text-color:var(--color-accent)]',
            'hover:[--text-color:var(--color-accent-700)]',
            '[--ring-color:var(--color-accent)]/60',
          ],
          neutral: [
            '[--text-color:var(--color-neutral)]',
            'hover:[--text-color:var(--color-neutral-700)]',
            '[--ring-color:var(--color-neutral)]/60',
          ],
          info: [
            '[--text-color:var(--color-info)]',
            'hover:[--text-color:var(--color-info-700)]',
            '[--ring-color:var(--color-info)]/60',
          ],
          success: [
            '[--text-color:var(--color-success)]',
            'hover:[--text-color:var(--color-success-700)]',
            '[--ring-color:var(--color-success)]/60',
          ],
          warning: [
            '[--text-color:var(--color-warning)]',
            'hover:[--text-color:var(--color-warning-700)]',
            '[--ring-color:var(--color-warning)]/60',
          ],
          danger: [
            '[--text-color:var(--color-danger)]',
            'hover:[--text-color:var(--color-danger-700)]',
            '[--ring-color:var(--color-danger)]/60',
          ],
        },
        none: {
          default: '',
          primary: '',
          secondary: '',
          accent: '',
          neutral: '',
          info: '',
          success: '',
          warning: '',
          danger: '',
        },
      }[variant ?? 'none']?.[color ?? 'default'],

      // text color
      ['default', 'outline', 'fill', 'fill-outline', 'fill-light', 'text'].includes(
        variant ?? 'none'
      ) && 'text-[var(--text-color)]',

      // background color
      ['default', 'outline', 'fill', 'fill-outline', 'fill-light'].includes(variant ?? 'none') &&
        'bg-[var(--bg-color)] ',

      // border color
      ['outline', 'fill-outline'].includes(variant ?? 'none') && 'border-[var(--border-color)]',

      // ring color
      ['default', 'outline', 'fill', 'fill-outline', 'fill-light', 'text'].includes(
        variant ?? 'none'
      ) && 'ring-[var(--ring-color)]',

      settingsClasses.root,
      classes?.root,
      className
    )
  );
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  {href}
  {target}
  type={href ? undefined : type}
  {...restProps}
  class={_class}
  disabled={href ? undefined : disabled}
  aria-disabled={disabled ? 'true' : 'false'}
>
  {#if loading}
    <span transition:slide={{ axis: 'x', duration: 200 }}>
      <ProgressCircle size={16} width={2} class={cls(settingsClasses.loading, classes.loading)} />
    </span>
  {:else if icon}
    <span in:slide={{ axis: 'x', duration: 200 }}>
      {#if typeof icon === 'function' || typeof icon === 'string' || 'icon' in icon}
        <!-- icon component, path/url/svg string, or font-awesome definition -->
        <Icon
          data={asIconData(icon)}
          class={cls('pointer-events-none', settingsClasses.icon, classes.icon)}
        />
      {:else}
        <!-- `Icon` props -->
        <Icon class={cls('pointer-events-none', settingsClasses.icon, classes.icon)} {...icon} />
      {/if}
    </span>
  {/if}

  {@render children?.()}
</svelte:element>
