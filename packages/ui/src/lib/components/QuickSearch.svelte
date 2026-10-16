<script lang="ts" module>
  import type { MenuOption } from '../types/index.js';
  import type { SelectFieldProps } from './SelectField.svelte';

  export type QuickSearchProps = {
    options?: MenuOption<string>[];
    /** Bindable */
    open?: boolean;
    class?: string;
    classes?: {
      root?: string;
      button?: string;
    };
    /** Called when an option is chosen */
    onChange?: (detail: { value: string | null; option: MenuOption<string> | null }) => void;
  } & Omit<SelectFieldProps<string>, 'options' | 'value' | 'onChange' | 'class' | 'classes'>;
</script>

<script lang="ts">
  import { autoFocus, selectOnFocus } from '@layerstack/svelte-attachments';
  import { MediaQueryPresets } from '@layerstack/svelte-state';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Dialog from './Dialog.svelte';
  import Kbd from './Kbd.svelte';
  import SelectField from './SelectField.svelte';
  import { getComponentClasses } from './theme.js';
  import { getSettings } from './settingsState.svelte.js';

  let {
    options = [],
    open = $bindable(false),
    class: className,
    classes = {},
    onChange,
    ...restProps
  }: QuickSearchProps = $props();

  const settingsClasses = getComponentClasses('QuickSearch');
  const settings = getSettings();
  const icons = $derived(settings.icons);
  const media = new MediaQueryPresets();
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    } else if (open && e.key === 'Escape') {
      e.preventDefault();
      open = false;
    }
  }}
/>

<Button
  icon={icons.search}
  iconOnly={!media.smScreen.current}
  onclick={() => (open = true)}
  class={cls(
    'QuickSearch',
    'sm:bg-black/10 sm:hover:bg-black/20 rounded-full sm:w-56 justify-start',
    settingsClasses.button,
    classes.button
  )}
>
  <span class="flex-1 text-left max-sm:hidden">Search</span>
  <Kbd variant="none" class="opacity-50 max-sm:hidden" command>K</Kbd>
</Button>

<Dialog
  bind:open
  classes={{
    root: cls('items-start mt-8 sm:mt-24', settingsClasses.root, classes.root, className),
    backdrop: 'backdrop-blur-xs',
  }}
>
  <SelectField
    icon={icons.search}
    placeholder="Search..."
    inlineOptions
    {options}
    onChange={(detail) => {
      onChange?.(detail);
      open = false;
    }}
    classes={{
      root: 'w-[420px] max-w-[95vw] py-1',
      field: {
        container: 'border-none hover:shadow-none group-focus-within:shadow-none',
      },
      options: 'overflow-auto max-h-[min(90dvh,380px)]',
      group: 'capitalize',
    }}
    {@attach (node) => {
      // Focus and select the search input as the dialog opens
      const input = (node as HTMLElement).querySelector('input');
      if (!input) return;
      const cleanupFocus = autoFocus({ delay: 100 })(input);
      const cleanupSelect = selectOnFocus()(input);
      return () => {
        cleanupFocus?.();
        cleanupSelect?.();
      };
    }}
    {...restProps}
  />
</Dialog>
