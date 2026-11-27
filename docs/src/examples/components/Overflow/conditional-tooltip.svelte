<script lang="ts">
  import { Overflow, Tooltip } from '@layerstack/ui';

  const text = 'A label long enough that it will not fit in this narrow container';
</script>

<!-- Only show the tooltip when the text is actually clipped -->
<div class="grid gap-3">
  <Overflow class="w-48 truncate border border-surface-content/10 rounded px-2 py-1">
    {#snippet children({ overflowX })}
      <Tooltip title={text} enabled={overflowX > 0}>{text}</Tooltip>
    {/snippet}
  </Overflow>

  <Overflow class="w-full truncate border border-surface-content/10 rounded px-2 py-1">
    {#snippet children({ overflowX })}
      <Tooltip title={text} enabled={overflowX > 0}>{text}</Tooltip>
    {/snippet}
  </Overflow>
</div>
