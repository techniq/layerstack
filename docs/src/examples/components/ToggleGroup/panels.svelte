<script lang="ts">
  import { ToggleGroup, ToggleOption, TogglePanel } from '@layerstack/ui';

  const tabs = [
    { value: 'overview', label: 'Overview', body: 'A summary of the project.' },
    { value: 'usage', label: 'Usage', body: 'How to install and use it.' },
    { value: 'api', label: 'API', body: 'Every prop, in detail.' },
  ];
</script>

<ToggleGroup value="overview" variant="underline">
  {#each tabs as tab (tab.value)}
    <ToggleOption value={tab.value}>{tab.label}</ToggleOption>
  {/each}

  {#snippet panes()}
    {#each tabs as tab (tab.value)}
      <TogglePanel>
        <p class="p-4 text-sm text-surface-content/70">{tab.body}</p>
      </TogglePanel>
    {/each}
  {/snippet}
</ToggleGroup>
