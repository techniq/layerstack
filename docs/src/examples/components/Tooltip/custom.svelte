<script lang="ts">
  import { Button, Tooltip } from '@layerstack/ui';
</script>

<div class="flex gap-6 items-center">
  <!-- The `title` snippet replaces the default bubble entirely -->
  <Tooltip>
    {#snippet titleSnippet()}
      <div
        class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 bg-surface-content text-surface-100 px-4 py-2 text-xs rounded shadow"
      >
        <div class="col-span-2 justify-self-center text-sm font-semibold">Tue, March 30</div>
        <div class="text-surface-100/50 justify-self-end">Actual</div>
        <div class="justify-self-end">123.50</div>
        <div class="text-surface-100/50 justify-self-end">Target</div>
        <div class="justify-self-end">90.00</div>
      </div>
    {/snippet}

    <Button variant="outline">Custom markup</Button>
  </Tooltip>

  <!-- `underline`/`cursor` hint that inline text is explainable -->
  <Tooltip title="A longer explanation" underline cursor>
    <span class="text-sm">Inline term</span>
  </Tooltip>

  <!-- `enabled` turns it off conditionally -->
  <Tooltip title="Never shown" enabled={false}>
    <Button variant="outline">Disabled tooltip</Button>
  </Tooltip>
</div>
