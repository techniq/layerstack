<script lang="ts">
  import { Button, MultiSelectMenu } from '@layerstack/ui';

  const options = Array.from({ length: 20 }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
  }));

  let value = $state<string[]>([]);
  let open = $state(false);
</script>

<div class="relative inline-block">
  <Button variant="outline" onclick={() => (open = !open)}>Options</Button>
  <MultiSelectMenu {options} bind:value bind:open search placeholder="Filter options" />
</div>
