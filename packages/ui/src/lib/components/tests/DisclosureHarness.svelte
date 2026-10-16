<script lang="ts">
  import Collapse from '../Collapse.svelte';
  import ExpansionPanel from '../ExpansionPanel.svelte';
  import TreeList from '../TreeList.svelte';

  let { kind, group = $bindable(), ...props }: { kind: string } & Record<string, any> = $props();
</script>

{#if kind === 'collapse'}
  <Collapse {...props as any}>
    <div data-testid="collapse-content">content</div>
  </Collapse>
{:else if kind === 'accordion'}
  {#each ['a', 'b', 'c'] as item (item)}
    <Collapse bind:group value={item} name={item}>
      <div data-testid="panel-{item}">panel {item}</div>
    </Collapse>
  {/each}
  <output data-testid="group">{group ?? 'none'}</output>
{:else if kind === 'expansion'}
  <ExpansionPanel {...props as any} name="Panel">
    {#snippet actions()}
      <span data-testid="panel-actions">actions</span>
    {/snippet}
    <div data-testid="panel-content">content</div>
  </ExpansionPanel>
{:else if kind === 'tree'}
  <TreeList {...props as any}>
    {#snippet children({ node })}
      <span class="node-label" data-level={node.level}>{node.name}</span>
    {/snippet}
  </TreeList>
{/if}
