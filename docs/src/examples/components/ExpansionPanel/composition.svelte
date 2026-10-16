<script lang="ts">
  import { Button, ExpansionPanel, ListItem } from '@layerstack/ui';
  import { mdiPencil, mdiTrashCan } from '@mdi/js';

  const items = [
    { title: 'Ada Lovelace', subheading: 'Mathematician' },
    { title: 'Grace Hopper', subheading: 'Rear Admiral' },
  ];
</script>

<div class="grid gap-6 max-w-md">
  <div>
    {#each items as item (item.title)}
      <ExpansionPanel>
        {#snippet trigger()}
          <ListItem {...item} noShadow noBackground class="flex-1" />
        {/snippet}

        <!-- `actions` renders inside the collapsible area, so it is only visible when expanded -->
        {#snippet actions()}
          <div class="flex gap-2 px-4 pb-2">
            <Button icon={mdiPencil} size="sm">Edit</Button>
            <Button icon={mdiTrashCan} size="sm">Delete</Button>
          </div>
        {/snippet}

        <div class="px-4 pb-3 text-sm text-surface-content/70">Details</div>
      </ExpansionPanel>
    {/each}
  </div>

  <!-- `disabled` hides the affordance for a panel with nothing to reveal -->
  <ExpansionPanel disabled>
    {#snippet trigger()}
      <ListItem title="Nothing to expand" noShadow noBackground class="flex-1" />
    {/snippet}
  </ExpansionPanel>
</div>
