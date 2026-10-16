<script lang="ts">
  import { Button, ListItem } from '@layerstack/ui';
  import { mdiAccount, mdiCog, mdiDotsVertical } from '@mdi/js';
</script>

<div class="grid gap-6 max-w-md">
  <ul>
    <ListItem title="Title only" />
    <ListItem title="With subheading" subheading="Subheading" />
    <ListItem title="With icon" subheading="Subheading" icon={mdiAccount} />

    <!-- `avatar` wraps the icon, and accepts Avatar props -->
    <ListItem
      title="Icon in an avatar"
      subheading="Subheading"
      icon={mdiCog}
      avatar={{ class: 'bg-primary text-primary-content' }}
    />

    <ListItem title="With actions" subheading="Subheading" icon={mdiAccount}>
      {#snippet actions()}
        <Button icon={mdiDotsVertical} />
      {/snippet}
    </ListItem>

    <ListItem title="Loading" subheading="Subheading" loading />
  </ul>

  <!-- `noShadow`/`noBackground` strip the chrome when the list sits inside another surface -->
  <ul class="border border-surface-content/10 rounded p-1">
    <ListItem title="Plain" subheading="No shadow or background" noShadow noBackground />
    <ListItem title="Plain" subheading="No shadow or background" noShadow noBackground />
  </ul>
</div>
