<script lang="ts">
  import { Button, Popover } from '@layerstack/ui';

  let open = $state(false);
</script>

<div class="relative inline-block">
  <Button variant="fill" color="primary" onclick={() => (open = !open)}>Toggle popover</Button>

  <Popover bind:open placement="bottom-start" offset={4}>
    <div class="bg-surface-100 border rounded-sm shadow-sm p-4 w-64">
      Positioned with floating-ui and portaled to the end of the document. Press
      <kbd class="border rounded-sm px-1 text-xs">Esc</kbd> or click outside to close.
    </div>
  </Popover>
</div>
