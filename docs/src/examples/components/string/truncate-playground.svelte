<script lang="ts">
  import { RangeField } from 'svelte-ux';
  import { truncate } from '@layerstack/utils';

  let str = 'This is very long text that will be truncated';
  let totalChars = 20;
  let endChars = 5;
</script>

<div class="grid grid-cols-2 gap-2 mb-2">
  <RangeField label="Total chars" bind:value={totalChars} />
  <RangeField label="End chars" bind:value={endChars} />
</div>
<div>{truncate(str, totalChars, endChars)}</div>
