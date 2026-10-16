<script lang="ts">
  import Settings from '../Settings.svelte';
  import MenuButton from '../MenuButton.svelte';
  import MenuField from '../MenuField.svelte';
  import MultiSelect from '../MultiSelect.svelte';
  import MultiSelectField from '../MultiSelectField.svelte';
  import SelectField from '../SelectField.svelte';

  // Separate bindings per shape — binding `undefined` to a prop that has a fallback is an error
  let {
    kind,
    value = $bindable(null),
    values = $bindable([]),
    open = $bindable(false),
    ...props
  }: Record<string, any> = $props();
</script>

<Settings themeInit={false}>
  {#if kind === 'menu-button'}
    <MenuButton bind:value {...props as any} />
    <output data-testid="value">{value ?? 'none'}</output>
  {:else if kind === 'menu-field'}
    <MenuField bind:value {...props as any} />
    <output data-testid="value">{value ?? 'none'}</output>
  {:else if kind === 'select-field'}
    <SelectField bind:value bind:open {...props as any} />
    <output data-testid="value">{value ?? 'none'}</output>
  {:else if kind === 'multi-select'}
    <MultiSelect bind:value={values} {...props as any} />
    <output data-testid="value">{(values ?? []).join(',')}</output>
  {:else if kind === 'multi-select-field'}
    <MultiSelectField bind:value={values} {...props as any} />
    <output data-testid="value">{(values ?? []).join(',')}</output>
  {/if}
</Settings>
