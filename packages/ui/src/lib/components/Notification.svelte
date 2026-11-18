<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { ThemeColors } from '@layerstack/tailwind';

  import type { IconProp } from '../types/index.js';
  import type { IconProps } from './Icon.svelte';

  type NotificationOwnProps = {
    title?: string;
    description?: string;
    icon?: IconProp;
    /** Buttons rendered from a `{ label: handler }` map */
    actions?: Record<string, () => void>;
    color?: ThemeColors;
    variant?: 'default' | 'fill';
    actionsPlacement?: 'inline' | 'below' | 'split';
    /** Bindable */
    open?: boolean;
    closeIcon?: boolean;
    class?: string;
    classes?: {
      root?: string;
      title?: string;
      description?: string;
      icon?: IconProps['classes'];
      actions?: string;
    };
    /** Called once the notification has transitioned out */
    onClose?: () => void;
    iconSnippet?: Snippet;
    titleSnippet?: Snippet;
    descriptionSnippet?: Snippet;
    actionsSnippet?: Snippet;
  };

  export type NotificationProps = NotificationOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof NotificationOwnProps>;
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quadIn } from 'svelte/easing';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import { getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';

  let {
    title,
    description,
    icon,
    actions = {},
    color = 'primary',
    variant = 'default',
    actionsPlacement = 'inline',
    open = $bindable(true),
    closeIcon = false,
    class: className,
    classes = {},
    onClose,
    iconSnippet,
    titleSnippet,
    descriptionSnippet,
    actionsSnippet,
    ...restProps
  }: NotificationProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);

  let actionsEl = $state<HTMLDivElement | undefined>();

  const hasActions = $derived(Object.keys(actions).length > 0 || actionsSnippet !== undefined);

  const contentColor = $derived(
    {
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      neutral: 'text-neutral',
      info: 'text-info',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger',
    }[color]
  );
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    {...restProps}
    class={cls(
      'Notification rounded-lg border bg-surface-100 shadow-lg z-10',
      {
        fill: {
          primary: 'bg-primary text-primary-content',
          secondary: 'bg-secondary text-secondary-content',
          accent: 'bg-accent text-accent-content',
          neutral: 'bg-neutral text-neutral-content',
          info: 'bg-info text-info-content',
          success: 'bg-success text-success-content',
          warning: 'bg-warning text-warning-content',
          danger: 'bg-danger text-danger-content',
        }[color],
        default: '',
      }[variant],
      classes.root,
      className
    )}
    transition:fly={{ duration: 200, easing: quadIn, x: 100 }}
    onoutroend={() => onClose?.()}
    onclick={(e) => {
      if (!(e.target instanceof Element)) return;
      // Close when an action is clicked (but not the container).  Opt out with `e.stopPropagation()`
      if (e.target !== actionsEl && actionsEl?.contains(e.target)) {
        open = false;
      }
    }}
  >
    <div class="flex">
      <div class="flex-1 flex items-center gap-4 p-4">
        {#if iconSnippet}
          {@render iconSnippet()}
        {:else if icon}
          <Icon
            data={asIconData(icon)}
            class={cls(
              actionsPlacement === 'below' && 'self-start mt-0.5',
              variant === 'default' && contentColor
            )}
            classes={classes.icon}
          />
        {/if}

        <div class="flex-1 grid gap-1">
          {#if titleSnippet}
            <div class={cls('font-medium', classes.title)}>{@render titleSnippet()}</div>
          {:else if title}
            <div class={cls('font-medium', classes.title)}>{title}</div>
          {/if}

          {#if descriptionSnippet || description}
            <div
              class={cls(
                'text-sm',
                {
                  fill: {
                    primary: 'text-primary-content/50',
                    secondary: 'text-secondary-content/50',
                    accent: 'text-accent-content/50',
                    neutral: 'text-neutral-content/50',
                    info: 'text-info-content/50',
                    success: 'text-success-content/50',
                    warning: 'text-warning-content/50',
                    danger: 'text-danger-content/50',
                  }[color],
                  default: 'text-surface-content/50',
                }[variant],
                classes.description
              )}
            >
              {#if descriptionSnippet}
                {@render descriptionSnippet()}
              {:else}
                {description}
              {/if}
            </div>
          {/if}

          {#if hasActions && actionsPlacement === 'below'}
            <div bind:this={actionsEl} class={cls('mt-2 -ml-4 -mb-2', classes.actions)}>
              {#if actionsSnippet}
                {@render actionsSnippet()}
              {:else}
                {#each Object.entries(actions) as [name, fn], i (name)}
                  <Button
                    color={i === 0 && variant === 'default' ? 'primary' : 'default'}
                    class={cls(i === 0 && variant === 'default' && contentColor)}
                    onclick={() => fn()}
                  >
                    {name}
                  </Button>
                {/each}
              {/if}
            </div>
          {/if}
        </div>

        {#if hasActions && actionsPlacement === 'inline'}
          <div bind:this={actionsEl} class={cls('-my-2 -mr-2', classes.actions)}>
            {#if actionsSnippet}
              {@render actionsSnippet()}
            {:else}
              {#each Object.entries(actions) as [name, fn], i (name)}
                <Button
                  color={i === 0 && variant === 'default' ? 'primary' : 'default'}
                  onclick={() => fn()}
                >
                  {name}
                </Button>
              {/each}
            {/if}
          </div>
        {/if}

        {#if closeIcon}
          <Button
            icon={icons.close}
            onclick={() => (open = false)}
            class={cls(
              'self-start',
              {
                fill: {
                  primary: 'text-primary-content/25',
                  secondary: 'text-secondary-content/25',
                  accent: 'text-accent-content/25',
                  neutral: 'text-neutral-content/25',
                  info: 'text-info-content/25',
                  success: 'text-success-content/25',
                  warning: 'text-warning-content/25',
                  danger: 'text-danger-content/25',
                }[color],
                default: 'text-surface-content/25',
              }[variant]
            )}
          />
        {/if}
      </div>

      {#if hasActions && actionsPlacement === 'split'}
        <div
          bind:this={actionsEl}
          class={cls(
            'grid border-l divide-y',
            {
              fill: {
                primary: 'border-primary-content/25 divide-primary-content/25',
                secondary: 'border-secondary-content/25 divide-secondary-content/25',
                accent: 'border-accent-content/25 divide-accent-content/25',
                neutral: 'border-neutral-content/25 divide-neutral-content/25',
                info: 'border-info-content/25 divide-info-content/25',
                success: 'border-success-content/25 divide-success-content/25',
                warning: 'border-warning-content/25 divide-warning-content/25',
                danger: 'border-danger-content/25 divide-danger-content/25',
              }[color],
              default: 'border-surface-content/25',
            }[variant],
            classes.actions
          )}
        >
          {#if actionsSnippet}
            {@render actionsSnippet()}
          {:else}
            {#each Object.entries(actions) as [name, fn], i (name)}
              <Button
                class={cls('rounded-none', variant === 'default' && i === 0 && 'text-primary')}
                onclick={() => fn()}
              >
                {name}
              </Button>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
