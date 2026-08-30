<script lang="ts">
  import Checkbox from '../Checkbox.svelte';
  import NavItem from '../NavItem.svelte';
  import NumberStepper from '../NumberStepper.svelte';
  import Radio from '../Radio.svelte';
  import RangeField from '../RangeField.svelte';
  import Switch from '../Switch.svelte';

  let {
    kind,
    group = $bindable(),
    checked = $bindable(false),
    value = $bindable(),
    ...props
  }: { kind: string } & Record<string, any> = $props();
</script>

{#if kind === 'switch'}
  <Switch bind:checked {...props as any} />
  <output data-testid="checked">{checked}</output>
{:else if kind === 'checkbox'}
  <Checkbox bind:checked {...props as any}>Label</Checkbox>
  <output data-testid="checked">{checked}</output>
{:else if kind === 'checkbox-group'}
  {#each ['a', 'b', 'c'] as item (item)}
    <Checkbox bind:group value={item}>{item}</Checkbox>
  {/each}
  <output data-testid="group">{(group ?? []).join(',')}</output>
{:else if kind === 'radio-group'}
  {#each ['a', 'b', 'c'] as item (item)}
    <Radio bind:group value={item} name="demo">{item}</Radio>
  {/each}
  <output data-testid="group">{group ?? 'none'}</output>
{:else if kind === 'stepper'}
  <NumberStepper bind:value {...props as any} />
  <output data-testid="value">{value}</output>
{:else if kind === 'range'}
  <RangeField bind:value {...props as any} />
  <output data-testid="value">{value}</output>
{:else if kind === 'navitem'}
  <NavItem {...props as any} />
{/if}
