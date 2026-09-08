<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import { SelectionState } from '@layerstack/svelte-state';

  export type SelectionContext<T> = {
    selected: T[];
    isSelected: (value: T) => boolean;
    isDisabled: (value: T) => boolean;
    isAllSelected: () => boolean;
    isAnySelected: () => boolean;
    toggleSelected: (value: T) => void;
    toggleAll: () => void;
    clear: () => void;
    /** The underlying state, for anything the helpers above do not cover */
    state: SelectionState<T, boolean>;
  };

  export type SelectionProps<T> = {
    initial?: T[];
    all?: T[];
    single?: boolean;
    max?: number;
    /** Called whenever the selection changes */
    onChange?: (detail: { value: T[] }) => void;
    children?: Snippet<[SelectionContext<T>]>;
  };
</script>

<script lang="ts" generics="T">
  let {
    initial = [],
    all = [],
    single = false,
    max,
    onChange,
    children,
  }: SelectionProps<T> = $props();

  // svelte-ignore state_referenced_locally
  const selection = new SelectionState<T, boolean>({ initial, all, single, max });

  $effect(() => {
    selection.all = all;
  });

  const selected = $derived(
    (Array.isArray(selection.current)
      ? selection.current
      : [selection.current].filter(Boolean)) as T[]
  );

  $effect(() => {
    onChange?.({ value: selected });
  });
</script>

{@render children?.({
  get selected() {
    return selected;
  },
  isSelected: (value: T) => selection.isSelected(value),
  isDisabled: (value: T) => selection.isDisabled(value),
  isAllSelected: () => selection.isAllSelected(),
  isAnySelected: () => selection.isAnySelected(),
  toggleSelected: (value: T) => selection.toggle(value),
  toggleAll: () => selection.toggleAll(),
  clear: () => selection.clear(),
  state: selection,
})}
