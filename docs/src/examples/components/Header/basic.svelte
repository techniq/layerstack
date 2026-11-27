<script lang="ts">
  import { Avatar, Button, Header } from '@layerstack/ui';
</script>

<Header title="Sean Lynch" subheading="Engineer">
  {#snippet avatar()}
    <Avatar class="bg-primary text-primary-content">SL</Avatar>
  {/snippet}

  {#snippet actions()}
    <Button variant="outline">Edit</Button>
  {/snippet}
</Header>
