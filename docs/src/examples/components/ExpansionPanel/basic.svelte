<script lang="ts">
  import { ExpansionPanel } from '@layerstack/ui';
</script>

<div>
  {#each ['Details', 'Billing', 'Advanced'] as name (name)}
    <ExpansionPanel {name} class="px-3 py-2">
      <p class="text-sm text-surface-content/70">Settings for {name.toLowerCase()}.</p>
    </ExpansionPanel>
  {/each}
</div>
