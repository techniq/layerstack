<script lang="ts">
  import { Button, Toggle } from '@layerstack/ui';
</script>

<Toggle>
  {#snippet children({ on, toggle })}
    <Button variant={on ? 'fill' : 'outline'} color="primary" onclick={toggle}>
      {on ? 'On' : 'Off'}
    </Button>
  {/snippet}
</Toggle>
