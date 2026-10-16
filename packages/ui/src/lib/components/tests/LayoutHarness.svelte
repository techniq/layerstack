<script lang="ts">
  import Drawer from '../Drawer.svelte';
  import ListItem from '../ListItem.svelte';
  import Steps from '../Steps.svelte';
  import Step from '../Step.svelte';
  import Tabs from '../Tabs.svelte';
  import Timeline from '../Timeline.svelte';
  import TimelineEvent from '../TimelineEvent.svelte';

  let {
    kind,
    open = $bindable(false),
    value = $bindable(),
    ...props
  }: Record<string, any> = $props();
</script>

{#if kind === 'tabs'}
  <Tabs bind:value {...props as any}>
    {#snippet content({ value })}
      <div data-testid="content">Content for {value}</div>
    {/snippet}
  </Tabs>
  <output data-testid="value">{value}</output>
{:else if kind === 'steps'}
  <Steps {...props as any} />
{:else if kind === 'steps-children'}
  <Steps {...props as any}>
    {#snippet children()}
      <Step completed>First</Step>
      <Step>Second</Step>
    {/snippet}
  </Steps>
{:else if kind === 'timeline'}
  <Timeline {...props as any} />
{:else if kind === 'timeline-children'}
  <Timeline {...props as any}>
    {#snippet children()}
      <TimelineEvent start="A" completed />
      <TimelineEvent start="B" />
    {/snippet}
  </Timeline>
{:else if kind === 'listitem'}
  <ul>
    <ListItem {...props as any}>
      {#snippet actions()}
        <button data-testid="item-action">Act</button>
      {/snippet}
    </ListItem>
  </ul>
{:else if kind === 'drawer'}
  <button data-testid="trigger" onclick={() => (open = true)}>Open</button>
  <Drawer bind:open {...props as any}>
    {#snippet children(ctx)}
      <div data-testid="drawer-content">Content</div>
      <button data-testid="force-close" onclick={() => ctx.close({ force: true })}>Force</button>
    {/snippet}
    {#snippet actions()}
      <button data-testid="drawer-action">Action</button>
    {/snippet}
  </Drawer>
  <output data-testid="open-state">{open}</output>
{/if}
