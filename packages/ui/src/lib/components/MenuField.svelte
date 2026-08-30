<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { MenuOption } from '../types/index.js';
  import type { FieldProps } from './Field.svelte';
  import type { MenuItemProps } from './MenuItem.svelte';
  import type { MenuProps } from './Menu.svelte';

  type MenuFieldOwnProps = {
    options?: MenuOption[];
    /** Bindable */
    value?: any;
    menuProps?: MenuProps;
    /** Show previous/next buttons to step through the options */
    stepper?: boolean;
    /** Bindable.  The option matching `value` */
    selected?: MenuOption | undefined;
    classes?: FieldProps['classes'] & {
      option?: string;
      menuItem?: MenuItemProps['classes'];
      menuIcon?: string;
      group?: string;
    };
    /** Called when the value changes */
    onChange?: (detail: { value: any; option: MenuOption | undefined }) => void;
    /** Replaces the field's displayed value */
    selection?: Snippet<[{ selected: MenuOption | undefined }]>;
    /** Replaces the generated menu items */
    children?: Snippet<
      [
        {
          options: MenuOption[];
          selected: MenuOption | undefined;
          close: () => void;
          setValue: (value: any) => void;
        },
      ]
    >;
    prepend?: Snippet;
    append?: Snippet;
  };

  export type MenuFieldProps = MenuFieldOwnProps &
    Omit<FieldProps, keyof MenuFieldOwnProps | 'children'>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Field from './Field.svelte';
  import Icon from './Icon.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('MenuField');

  let {
    options = [],
    value = $bindable(null),
    menuProps = { autoPlacement: true, resize: true },
    stepper = false,
    selected = $bindable(),
    classes = {},
    onChange,
    selection,
    // Renamed: the `{#snippet children/prepend/append}` blocks below would otherwise shadow these
    children: childrenSnippet,
    prepend: prependSnippet,
    append: appendSnippet,
    ...restProps
  }: MenuFieldProps = $props();

  const icons = $derived(settings.icons);

  let open = $state(false);

  const resolvedSelected = $derived(options?.find((x) => x.value === value));

  $effect(() => {
    selected = resolvedSelected;
  });

  let lastValue = value;
  $effect(() => {
    if (value === lastValue) return;
    lastValue = value;
    onChange?.({ value, option: resolvedSelected });
  });

  /** Wraps around at either end */
  function previous() {
    const index = options.findIndex((o) => o.value === value);
    return index <= 0 ? options[options.length - 1].value : options[index - 1].value;
  }

  function next() {
    const index = options.findIndex((o) => o.value === value);
    return index === options.length - 1 ? options[0].value : options[index + 1].value;
  }

  function setValue(next: any) {
    value = next;
  }
</script>

<Field
  class="cursor-pointer"
  {...defaults}
  {...restProps}
  classes={{ input: 'overflow-hidden', ...classes }}
  onclick={() => (open = !open)}
>
  {#snippet children()}
    {#if selection}
      {@render selection({ selected: resolvedSelected })}
    {:else}
      <div class="truncate text-sm">
        {resolvedSelected?.label ?? 'No selection'}
      </div>
    {/if}
  {/snippet}

  {#snippet prepend()}
    <span>
      {#if stepper}
        <Button
          icon={icons.chevronLeft}
          onclick={() => (value = previous())}
          class="mr-2"
          size="sm"
        />
      {/if}
      {@render prependSnippet?.()}
    </span>
  {/snippet}

  {#snippet append()}
    <span class="flex items-center">
      {@render appendSnippet?.()}

      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span
        onclick={(e) => {
          e.stopPropagation();
          open = !open;
        }}
      >
        <Icon
          data={icons.chevronDown}
          class={cls(
            'text-surface-content/50 mr-1 transform transition-all duration-300 pointer-events-none',
            open && '-rotate-180',
            settingsClasses.menuIcon,
            classes.menuIcon
          )}
        />
      </span>

      {#if stepper}
        <Button icon={icons.chevronRight} onclick={() => (value = next())} class="mr-2" size="sm" />
      {/if}
    </span>
  {/snippet}

  {#snippet root()}
    <Menu bind:open matchWidth {...menuProps}>
      {#if childrenSnippet}
        {@render childrenSnippet({
          options,
          selected: resolvedSelected,
          close: () => (open = false),
          setValue,
        })}
      {:else}
        <menu class="group p-1">
          {#each options as option, index (`${option.group}-${option.value}`)}
            {@const previousOption = options[index - 1]}
            {#if option.group && option.group !== previousOption?.group}
              <div
                class={cls(
                  'group-header text-xs leading-8 tracking-widest text-surface-content/50 px-2',
                  settingsClasses.group,
                  classes.group
                )}
              >
                {option.group}
              </div>
            {/if}

            <MenuItem
              icon={option.icon}
              selected={option.value === value}
              class={cls(option.group ? 'px-4' : 'px-2', settingsClasses.option, classes.option)}
              classes={classes.menuItem}
              disabled={option.disabled}
              onclick={() => (value = option.value)}
            >
              {option.label}
            </MenuItem>
          {/each}
        </menu>
      {/if}
    </Menu>
  {/snippet}
</Field>
