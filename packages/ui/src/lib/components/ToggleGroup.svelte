<script lang="ts" module>
  import { getContext, setContext, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { TransitionConfig } from 'svelte/transition';

  export type ToggleGroupVariant =
    | 'default'
    | 'outline'
    | 'fill'
    | 'fill-light'
    | 'fill-surface'
    | 'underline'
    | 'none';

  export type ToggleGroupClasses = {
    root?: string;
    options?: string;
    label?: string;
    option?: string;
    indicator?: string;
  };

  export type ToggleGroupContext = {
    readonly name: string;
    readonly autoscroll: boolean;
    /** Resolved classes, recomputed as the group's props change */
    readonly classes: ToggleGroupClasses;
    readonly selectedOption: HTMLElement | undefined;
    readonly selectedPanel: HTMLElement | undefined;
    readonly crossfade: [
      (node: Element, params: any) => () => TransitionConfig,
      (node: Element, params: any) => () => TransitionConfig,
    ];
    registerOption: (option: HTMLElement, value: any) => void;
    unregisterOption: (option: HTMLElement, value: any) => void;
    selectOption: (option: HTMLElement | undefined, value: any) => void;
    registerPanel: (panel: HTMLElement) => void;
    unregisterPanel: (panel: HTMLElement) => void;
  };

  const groupKey = Symbol();

  export function setToggleGroup(context: ToggleGroupContext) {
    setContext(groupKey, context);
  }

  export function getToggleGroup() {
    return getContext<ToggleGroupContext>(groupKey);
  }

  type ToggleGroupOwnProps = {
    name?: string;
    /** Bindable.  The selected option's value, or its index */
    value?: any;
    /** Scroll the selected option into view when it changes */
    autoscroll?: boolean;
    variant?: ToggleGroupVariant;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    rounded?: boolean | 'full';
    gap?: boolean | 'px';
    inset?: boolean;
    vertical?: boolean;
    class?: string;
    classes?: ToggleGroupClasses;
    /** Called when the selected value changes */
    onChange?: (detail: { value: any }) => void;
    /** The `ToggleOption`s */
    children?: Snippet;
    /** The `TogglePanel`s, rendered below the options */
    panes?: Snippet;
  };

  export type ToggleGroupProps = ToggleGroupOwnProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof ToggleGroupOwnProps>;
</script>

<script lang="ts">
  import { crossfade, fade } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';
  import { uniqueId } from '@layerstack/utils';

  import { getComponentClasses } from './theme.js';

  let {
    name = uniqueId('group-'),
    value = $bindable(),
    autoscroll = false,
    variant = 'default',
    size = 'md',
    rounded,
    gap = false,
    inset = false,
    vertical = false,
    class: className,
    classes = {},
    onChange,
    children,
    panes,
    ...restProps
  }: ToggleGroupProps = $props();

  const settingsClasses = getComponentClasses('ToggleGroup');

  const resolvedRounded = $derived(rounded ?? variant !== 'underline');

  const variantClasses = $derived(
    {
      default: {
        options: '',
        label: 'text-surface-content/60 hover:text-primary [&.selected]:text-primary',
        indicator: 'h-full bg-primary/10',
      },
      outline: {
        options: cls(
          'border',
          gap === true
            ? vertical
              ? 'divide-y divide-y-4'
              : 'divide-x divide-x-4'
            : gap === 'px'
              ? vertical
                ? 'divide-y'
                : 'divide-x'
              : ''
        ),
        label: 'text-surface-content/60 hover:text-primary [&.selected]:text-primary',
        indicator: 'h-full w-full bg-primary/10',
      },
      fill: {
        options: cls(!gap && 'bg-primary/10'),
        label: cls(
          'text-primary hover:text-primary-700 hover:bg-primary/10 [&.selected]:text-primary-content',
          gap && 'bg-primary/10'
        ),
        indicator: 'h-full bg-primary',
      },
      'fill-light': {
        options: cls(!gap && 'bg-surface-content/10'),
        label: cls(
          'text-surface-content/60 hover:text-surface-content/80 hover:bg-surface-content/10 [&.selected]:text-primary',
          gap && 'bg-surface-content/10'
        ),
        indicator: 'h-full bg-primary/10',
      },
      'fill-surface': {
        options: cls(!gap && 'bg-surface-content/10'),
        label: cls(
          'text-surface-content/60 hover:text-surface-content/80 hover:bg-surface-content/10 [&.selected]:text-primary',
          gap && 'bg-surface-content/10'
        ),
        indicator: 'h-full bg-surface-100 border',
      },
      underline: {
        options: vertical ? 'border-r' : 'border-b',
        label:
          'relative text-surface-content/50 font-bold hover:text-primary hover:bg-primary/10 [&.selected]:text-primary',
        indicator: cls(
          'absolute border-primary',
          vertical
            ? 'top-0 right-0 h-full border-l-4 rounded-l'
            : 'bottom-0 left-0 w-full border-t-2 rounded-t'
        ),
      },
      none: {},
    }[variant] as ToggleGroupClasses
  );

  const resolvedClasses = $derived<ToggleGroupClasses>({
    root: cls('', variantClasses.root, classes.root),

    options: cls(
      'grid overflow-auto',
      vertical ? 'grid-flow-row' : 'grid-flow-col',
      resolvedRounded === 'full' ? 'rounded-full' : resolvedRounded && 'rounded-sm',
      variant !== 'outline' && (gap === true ? 'gap-1' : gap === 'px' ? 'gap-px' : ''),
      inset ? 'p-[2px]' : '',
      variantClasses.options,
      settingsClasses.options,
      classes.options
    ),

    label: cls(
      'text-center cursor-pointer',
      {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      }[size],
      resolvedRounded === 'full' ? 'rounded-full' : resolvedRounded && 'rounded-sm',
      // With gaps, round the outside edges of the first/last option and indicator only
      gap &&
        (vertical
          ? [
              'not-first:rounded-t-none',
              'not-last:rounded-b-none',
              '[&:not(:first-child)_.indicator]:rounded-t-none',
              '[&:not(:last-child)_.indicator]:rounded-b-none',
            ]
          : [
              'not-first:rounded-l-none',
              'not-last:rounded-r-none',
              '[&:not(:first-child)_.indicator]:rounded-l-none',
              '[&:not(:last-child)_.indicator]:rounded-r-none',
            ]),
      variantClasses.label,
      settingsClasses.label,
      classes.label
    ),

    option: cls(
      variant !== 'none' && 'px-4 font-medium',
      {
        xs: '',
        sm: 'py-1',
        md: 'py-1',
        lg: 'py-1',
      }[size],
      variantClasses.option,
      settingsClasses.option,
      classes.option
    ),

    indicator: cls(
      'z-0',
      resolvedRounded === 'full' ? 'rounded-full' : resolvedRounded && 'rounded-sm',
      variantClasses.indicator,
      settingsClasses.indicator,
      classes.indicator
    ),
  });

  // Reactive so `selectedPanel` can be derived from registration order rather than tracked
  // separately — options and panels register in child effects, and the ordering between them is
  // not guaranteed
  let options = $state<HTMLElement[]>([]);
  let panels = $state<HTMLElement[]>([]);
  const optionsByValue = new Map<any, HTMLElement>();

  let selectedOption = $state<HTMLElement | undefined>(undefined);

  const selectedPanel = $derived(
    selectedOption ? panels[options.indexOf(selectedOption)] : panels[0]
  );

  // @ts-expect-error `fade` is not quite type-compatible as a `fallback`
  const [send, receive] = crossfade({ fallback: fade });

  function selectOption(option: HTMLElement | undefined, optionValue: any) {
    if (value !== optionValue) {
      onChange?.({ value: optionValue });
    }

    selectedOption = option;
    value = optionValue;
  }

  // Keep the selection in sync when `value` is set from outside
  $effect(() => {
    const next = optionsByValue.get(value) ?? options[value];
    if (next && next !== selectedOption) {
      selectOption(next, value);
    }
  });

  setToggleGroup({
    get name() {
      return name;
    },
    get autoscroll() {
      return autoscroll;
    },
    get classes() {
      return resolvedClasses;
    },
    get selectedOption() {
      return selectedOption;
    },
    get selectedPanel() {
      return selectedPanel;
    },
    crossfade: [send, receive],
    registerOption(option, optionValue) {
      options.push(option);
      optionsByValue.set(optionValue, option);

      // Select if this option is the one already chosen
      if (optionValue === value) {
        selectOption(option, optionValue);
      }
    },
    unregisterOption(option, optionValue) {
      const i = options.indexOf(option);
      options.splice(i, 1);
      if (selectedOption === option) {
        selectedOption = options[i] ?? options[options.length - 1];
      }
      optionsByValue.delete(optionValue);
    },
    selectOption,
    registerPanel(panel) {
      panels.push(panel);
    },
    unregisterPanel(panel) {
      panels.splice(panels.indexOf(panel), 1);
    },
  });
</script>

<div
  {...restProps}
  class={cls('ToggleGroup', `variant-${variant}`, resolvedClasses.root, className)}
>
  <div class={cls('options', resolvedClasses.options)}>
    {@render children?.()}
  </div>
  {@render panes?.()}
</div>
