<script lang="ts" module>
  import type { Snippet } from 'svelte';

  import type { IconProp, MenuOption } from '../types/index.js';
  import type { ButtonProps } from './Button.svelte';
  import type { MenuProps } from './Menu.svelte';

  type MenuButtonOwnProps = {
    options?: MenuOption[];
    /** Bindable */
    value?: any;
    menuProps?: MenuProps;
    /** Trailing chevron.  `false` or `null` hides it */
    menuIcon?: IconProp | false | null;
    class?: string;
    classes?: {
      root?: string;
      label?: string;
      icon?: string;
    };
    /** Called when a option is chosen */
    onChange?: (detail: { value: any; option: MenuOption }) => void;
    /** Replaces the button's label */
    selection?: Snippet<[{ value: MenuOption | undefined }]>;
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
  };

  export type MenuButtonProps = MenuButtonOwnProps & Omit<ButtonProps, keyof MenuButtonOwnProps>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import { getComponentSettings, getSettings } from './settingsState.svelte.js';
  import { asIconData } from '../utils/icons.js';

  const settings = getSettings();
  const { classes: settingsClasses, defaults } = getComponentSettings('MenuButton');

  let {
    options = [],
    value = $bindable(null),
    menuProps = { placement: 'bottom-start' },
    menuIcon,
    class: className,
    classes = {},
    onChange,
    selection,
    children,
    ...restProps
  }: MenuButtonProps = $props();

  const icons = $derived(settings.icons);
  const resolvedMenuIcon = $derived(menuIcon === undefined ? icons.chevronDown : menuIcon);
  const selected = $derived(options?.find((x) => x.value === value));

  let open = $state(false);

  function setValue(next: any) {
    value = next;
  }
</script>

<Button
  {...defaults}
  {...restProps}
  onclick={() => (open = !open)}
  class={cls('MenuButton', settingsClasses.root, classes.root, className)}
>
  {#if selection}
    {@render selection({ value: selected })}
  {:else}
    <span class={cls('truncate', settingsClasses.label, classes.label)}>
      {selected?.label ?? 'No selection'}
    </span>
  {/if}

  {#if resolvedMenuIcon}
    <Icon
      data={asIconData(resolvedMenuIcon)}
      class={cls(
        'opacity-50 transform transition-all -mr-2 duration-300',
        open && '-rotate-180',
        settingsClasses.icon,
        classes.icon
      )}
    />
  {/if}

  <Menu bind:open {...menuProps}>
    {#if children}
      {@render children({ options, selected, close: () => (open = false), setValue })}
    {:else}
      <menu class="group p-1">
        {#each options as option (option.value)}
          <MenuItem
            icon={option.icon}
            selected={option.value === value}
            disabled={option.disabled}
            onclick={() => {
              value = option.value;
              onChange?.({ option, value });
            }}
          >
            {option.label}
          </MenuItem>
        {/each}
      </menu>
    {/if}
  </Menu>
</Button>
