<script lang="ts">
  import { Notification } from '@layerstack/ui';
  import { mdiCheckCircle } from '@mdi/js';

  const colors = ['info', 'success', 'warning', 'danger'] as const;
</script>

<div class="grid gap-3 max-w-md">
  {#each colors as color (color)}
    <Notification title={color} description="Default variant" {color} icon={mdiCheckCircle} open />
  {/each}

  {#each colors as color (color)}
    <Notification
      title={color}
      description="Fill variant"
      {color}
      variant="fill"
      icon={mdiCheckCircle}
      open
    />
  {/each}
</div>
