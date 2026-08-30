<script lang="ts">
  import Avatar from '../Avatar.svelte';
  import Card from '../Card.svelte';
  import Maybe from '../Maybe.svelte';
  import ScrollContainer from '../ScrollContainer.svelte';
  import Selection from '../Selection.svelte';
  import Toggle from '../Toggle.svelte';

  let { kind, ...props }: { kind: string } & Record<string, any> = $props();
</script>

{#if kind === 'toggle'}
  <Toggle {...props}>
    {#snippet children({ on, toggle, toggleOn, toggleOff })}
      <output data-testid="on">{on}</output>
      <button data-testid="toggle" onclick={toggle}>toggle</button>
      <button data-testid="on-btn" onclick={toggleOn}>on</button>
      <button data-testid="off-btn" onclick={toggleOff}>off</button>
    {/snippet}
  </Toggle>
{:else if kind === 'selection'}
  <Selection {...props}>
    {#snippet children({ selected, isSelected, toggleSelected, toggleAll, isAllSelected, clear })}
      <output data-testid="selected">{selected.join(',')}</output>
      <output data-testid="all-selected">{isAllSelected()}</output>
      <output data-testid="is-a">{isSelected('a')}</output>
      <button data-testid="toggle-a" onclick={() => toggleSelected('a')}>a</button>
      <button data-testid="toggle-all" onclick={toggleAll}>all</button>
      <button data-testid="clear" onclick={clear}>clear</button>
    {/snippet}
  </Selection>
{:else if kind === 'maybe'}
  <Maybe this={props.wrapper} class="wrapped">
    <span data-testid="maybe-child">child</span>
  </Maybe>
{:else if kind === 'scroll'}
  <ScrollContainer style="height: 40px; overflow: auto">
    {#snippet children({ scrollIntoView })}
      <button data-testid="scroll" onclick={() => scrollIntoView()}>scroll</button>
    {/snippet}
  </ScrollContainer>
{:else if kind === 'avatar-children'}
  <Avatar {...props}>
    <span data-testid="avatar-child">AB</span>
  </Avatar>
{:else if kind === 'card-snippets'}
  <Card {...props}>
    <div data-testid="card-children">children</div>
    {#snippet contents()}
      <div data-testid="card-contents">contents</div>
    {/snippet}
    {#snippet actions()}
      <div data-testid="card-actions">actions</div>
    {/snippet}
  </Card>
{/if}
