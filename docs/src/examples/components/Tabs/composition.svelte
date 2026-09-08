<script lang="ts">
  import { Tab, Tabs } from '@layerstack/ui';

  const options = [1, 2, 3].map((value) => ({ label: `Tab ${value}`, value }));
  let value = $state(1);
  let contained = $state(1);
</script>

<div class="grid gap-8">
  <!-- Compose `Tab` directly when the tabs are not uniform -->
  <Tabs>
    {#each options as option (option.value)}
      <Tab onclick={() => (value = option.value)} selected={value === option.value}>
        {option.label}
      </Tab>
    {/each}

    {#snippet content()}
      <div class="p-2">Page {value}</div>
    {/snippet}
  </Tabs>

  <!-- Rounded and contained, via `classes` -->
  <Tabs
    {options}
    bind:value={contained}
    classes={{
      content: 'border border-surface-content/10 px-4 py-2 rounded-b rounded-tr',
      tab: { root: 'rounded-t' },
    }}
  >
    {#snippet content({ value })}
      Page {value}
    {/snippet}
  </Tabs>
</div>
