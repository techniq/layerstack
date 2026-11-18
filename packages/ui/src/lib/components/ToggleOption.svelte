<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type ToggleOptionOwnProps = {
    value: any;
    class?: string;
    classes?: {
      root?: string;
      option?: string;
      indicator?: string;
    };
    children?: Snippet<[{ selected: boolean }]>;
  };

  export type ToggleOptionProps = ToggleOptionOwnProps &
    Omit<HTMLAttributes<HTMLLabelElement>, keyof ToggleOptionOwnProps>;
</script>

<script lang="ts">
  import { untrack } from 'svelte';
  import { scrollIntoView } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  import { getToggleGroup } from './ToggleGroup.svelte';
  import { getComponentClasses } from './theme.js';

  let {
    value,
    class: className,
    classes = {},
    children,
    ...restProps
  }: ToggleOptionProps = $props();

  const settingsClasses = getComponentClasses('ToggleOption');
  const group = getToggleGroup();
  const [send, receive] = group.crossfade;

  let optionElement = $state<HTMLElement | null>(null);

  const selected = $derived(group.selectedOption === optionElement);

  $effect(() => {
    if (!optionElement) return;
    const el = optionElement;
    // `untrack` so mutating the group's option list does not make this effect depend on it,
    // which would unregister and re-register in a loop
    untrack(() => group.registerOption(el, value));
    return () => untrack(() => group.unregisterOption(el, value));
  });

  $effect(() => {
    // TODO: Only scroll when out of view
    if (group.autoscroll && selected && optionElement) {
      scrollIntoView(optionElement);
    }
  });
</script>

<label
  bind:this={optionElement}
  class:selected
  {...restProps}
  class={cls(
    'ToggleOption',
    'label',
    'grid items-center',
    group.classes.label,
    settingsClasses.root,
    classes.root,
    className
  )}
>
  <!-- Stacked beneath the option content -->
  {#if selected}
    <div
      class={cls(
        'indicator',
        group.classes.indicator,
        settingsClasses.indicator,
        classes.indicator
      )}
      in:receive={{ key: 'indicator' }}
      out:send={{ key: 'indicator' }}
    ></div>
  {/if}

  <div class={cls('option', group.classes.option, settingsClasses.option, classes.option)}>
    {@render children?.({ selected })}
  </div>

  <input
    name={group.name}
    type="radio"
    class="appearance-none absolute"
    checked={selected}
    onclick={() => group.selectOption(optionElement ?? undefined, value)}
  />
</label>

<style>
  /* Stack contents */
  label > * {
    grid-column: 1;
    grid-row: 1;
    z-index: 1;
  }
</style>
