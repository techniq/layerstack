<script lang="ts">
  import { Tabs } from '@layerstack/ui';

  const options = [
    { label: 'Overview', value: 'overview' },
    { label: 'Usage', value: 'usage' },
    { label: 'API', value: 'api' },
  ];

  let value = $state('overview');
</script>

<Tabs bind:value {options}>
  {#snippet content({ value })}
    <div class="p-4 text-sm text-surface-content/70">Content for “{value}”</div>
  {/snippet}
</Tabs>
