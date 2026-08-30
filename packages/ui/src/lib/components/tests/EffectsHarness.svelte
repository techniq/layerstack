<script lang="ts">
  import BarStack from '../BarStack.svelte';
  import ScrollingValue from '../ScrollingValue.svelte';
  import SpringValue from '../SpringValue.svelte';
  import TweenedValue from '../TweenedValue.svelte';

  let { kind, ...props }: { kind: string } & Record<string, any> = $props();
</script>

{#if kind === 'spring'}
  <SpringValue {...props as any}>
    {#snippet children({ value })}
      <output data-testid="value">{value}</output>
    {/snippet}
  </SpringValue>
{:else if kind === 'spring-default'}
  <span data-testid="value"><SpringValue {...props as any} /></span>
{:else if kind === 'tween'}
  <TweenedValue {...props as any}>
    {#snippet children({ value })}
      <output data-testid="value">{value}</output>
    {/snippet}
  </TweenedValue>
{:else if kind === 'tween-default'}
  <span data-testid="value"><TweenedValue {...props as any} /></span>
{:else if kind === 'scrolling'}
  <ScrollingValue {...props as any} />
{:else if kind === 'barstack'}
  <BarStack {...props as any} />
{/if}
