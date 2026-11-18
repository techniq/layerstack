<script lang="ts">
  import { ToggleButton } from '@layerstack/ui';
</script>

<ToggleButton variant="outline" color="primary">
  {#snippet children({ on })}
    {on ? 'Hide' : 'Show'} details
  {/snippet}

  {#snippet toggle()}
    <div class="border rounded-sm p-4 mt-2 text-sm text-surface-content/70">
      Revealed content, which transitions in and out.
    </div>
  {/snippet}
</ToggleButton>
