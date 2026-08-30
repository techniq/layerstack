<script lang="ts">
  import { Badge, Button, Icon } from '@layerstack/ui';
  import { mdiFilterVariant, mdiPlus } from '@mdi/js';

  let value = $state(3);
</script>

<div class="grid gap-6">
  <div class="flex gap-8 items-center">
    <Badge {value}>
      <Button variant="outline">Example</Button>
    </Badge>

    <Badge {value} small>
      <Button variant="outline">Small</Button>
    </Badge>

    <!-- `circle` nudges the badge inward for a round anchor -->
    <Badge {value} circle>
      <Button icon={mdiFilterVariant} variant="outline" class="p-3" />
    </Badge>

    <Badge {value} dot>
      <Button icon={mdiFilterVariant} variant="outline" class="p-3" />
    </Badge>

    <Badge {value} circle class="bg-success text-success-content">
      <Button icon={mdiFilterVariant} variant="outline" class="p-3" />
    </Badge>

    <!-- Replace the number entirely -->
    <Badge circle>
      <Button icon={mdiFilterVariant} variant="outline" class="p-3" />
      {#snippet valueSnippet()}
        <div class="bg-success text-success-content rounded-full">
          <Icon data={mdiPlus} />
        </div>
      {/snippet}
    </Badge>

    <!-- Nesting gives more than one badge per anchor -->
    <Badge placement="bottom-right" {value} dot circle class="bg-danger">
      <Badge placement="top-right" {value} dot circle class="bg-success">
        <Button icon={mdiFilterVariant} variant="outline" class="p-3" />
      </Badge>
    </Badge>
  </div>

  <div class="flex gap-2 items-center text-sm">
    <button class="border rounded px-2 py-1" onclick={() => (value = Math.max(0, value - 1))}
      >−</button
    >
    <span class="w-6 text-center">{value}</span>
    <button class="border rounded px-2 py-1" onclick={() => value++}>+</button>
    <span class="text-surface-content/50">(hidden at 0)</span>
  </div>
</div>
