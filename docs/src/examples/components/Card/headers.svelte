<script lang="ts">
  import { Avatar, Button, Card, Header } from '@layerstack/ui';
  import { mdiDotsVertical } from '@mdi/js';
</script>

<div class="grid gap-4 max-w-md">
  <Card title="Title" subheading="Subheading">Contents</Card>

  <!-- Arrays render as a Breadcrumb -->
  <Card title={['One', 'Two', 'Three']} subheading="Array title" />

  <!-- Replace the header outright for an avatar or actions -->
  <Card>
    {#snippet header()}
      <Header title="Ada Lovelace" subheading="Mathematician">
        {#snippet avatar()}
          <Avatar class="bg-primary text-primary-content font-bold">AL</Avatar>
        {/snippet}
        {#snippet actions()}
          <Button icon={mdiDotsVertical} />
        {/snippet}
      </Header>
    {/snippet}

    Contents
  </Card>
</div>
