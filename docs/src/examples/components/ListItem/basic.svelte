<script lang="ts">
  import { Button, ListItem } from '@layerstack/ui';
  import { mdiAccount, mdiCog } from '@mdi/js';
</script>

<ul class="rounded-sm overflow-hidden">
  <ListItem title="Profile" subheading="Your account details" icon={mdiAccount} avatar>
    {#snippet actions()}
      <Button variant="outline" size="sm">Edit</Button>
    {/snippet}
  </ListItem>
  <ListItem title="Settings" subheading="Preferences and theme" icon={mdiCog} avatar />
  <ListItem title="Loading item" loading />
</ul>
