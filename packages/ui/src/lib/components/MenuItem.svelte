<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { ScrollIntoViewOptions } from '@layerstack/svelte-attachments';

  import type { IconProp } from '../types/index.js';
  import type { ButtonProps } from './Button.svelte';
  import type { IconProps } from './Icon.svelte';

  type MenuItemOwnProps = {
    icon?: IconProp | IconProps;
    /** Scroll this item into view (ex. the selected item when a menu opens) */
    scrollIntoView?: ScrollIntoViewOptions | boolean;
    disabled?: boolean;
    selected?: boolean;
    class?: string;
    classes?: ButtonProps['classes'] & { selected?: string };
    children?: Snippet;
  };

  export type MenuItemProps = MenuItemOwnProps & Omit<ButtonProps, keyof MenuItemOwnProps>;
</script>

<script lang="ts">
  import { scrollIntoView as scrollIntoViewAttachment } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import { setButtonGroup } from './ButtonGroup.svelte';
  import { getComponentClasses } from './theme.js';
  import { setComponentSettings } from './settingsState.svelte.js';

  let {
    icon,
    scrollIntoView = false,
    disabled = false,
    selected = false,
    class: className,
    classes = {
      root: 'text-sm gap-3',
      icon: 'text-surface-content/50',
      selected: 'font-semibold [:not(.group:hover)>&]:bg-surface-content/5',
    },
    children,
    ...restProps
  }: MenuItemProps = $props();

  const settingsClasses = getComponentClasses('MenuItem');

  // Ignore any enclosing `ButtonGroup`
  setButtonGroup(undefined);

  // Opt the `Button` below out of the app's component settings, so app-wide `Button` defaults and
  // classes do not leak into menu items
  setComponentSettings({});

  const scrollOptions = $derived(
    typeof scrollIntoView === 'boolean' ? { condition: scrollIntoView } : scrollIntoView
  );
</script>

<Button
  variant="none"
  {icon}
  {classes}
  fullWidth
  {disabled}
  {...restProps}
  class={cls(
    'MenuItem',
    'text-left items-center p-2 hover:bg-surface-content/5 rounded-sm duration-75',
    selected && classes?.selected,
    settingsClasses.root,
    classes?.root,
    className
  )}
  {@attach scrollIntoViewAttachment(scrollOptions)}
>
  {@render children?.()}
</Button>
