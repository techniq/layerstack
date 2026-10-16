<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type ToggleContext = {
    on: boolean;
    toggle: () => void;
    toggleOn: () => void;
    toggleOff: () => void;
  };

  export type ToggleProps = {
    /** Bindable */
    on?: boolean;
    /** Called whenever the state changes, with the new value */
    onToggle?: (on: boolean) => void;
    onToggleOn?: () => void;
    onToggleOff?: () => void;
    children?: Snippet<[ToggleContext]>;
  };
</script>

<script lang="ts">
  let {
    on = $bindable(false),
    onToggle,
    onToggleOn,
    onToggleOff,
    children,
  }: ToggleProps = $props();

  function set(value: boolean) {
    on = value;
    onToggle?.(on);
    if (on) {
      onToggleOn?.();
    } else {
      onToggleOff?.();
    }
  }
</script>

{@render children?.({
  get on() {
    return on;
  },
  toggle: () => set(!on),
  toggleOn: () => set(true),
  toggleOff: () => set(false),
})}
