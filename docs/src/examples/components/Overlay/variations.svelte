<script lang="ts">
  import { Button, Overlay, ProgressCircle } from '@layerstack/ui';

  let shown = $state(false);
</script>

<div class="grid grid-cols-2 gap-4">
  <!-- The overlay fills its nearest positioned ancestor -->
  <div class="relative border border-surface-content/10 rounded p-4">
    <Overlay center>
      <ProgressCircle />
    </Overlay>
    <div>Some content</div>
    <div>Some content</div>
    <div>Some content</div>
  </div>

  <!-- The scrim is a plain background utility -->
  <div class="relative border border-surface-content/10 rounded p-4">
    <Overlay center class="bg-surface-content/20">
      <ProgressCircle />
    </Overlay>
    <div>Some content</div>
    <div>Some content</div>
    <div>Some content</div>
  </div>

  <div class="relative border border-surface-content/10 rounded p-4">
    {#if shown}
      <Overlay center>
        <Button onclick={() => (shown = false)} class="border">Close</Button>
      </Overlay>
    {/if}
    <div>Some content</div>
    <div>Some content</div>
    <Button onclick={() => (shown = true)} class="border mt-4">Show overlay</Button>
  </div>
</div>
