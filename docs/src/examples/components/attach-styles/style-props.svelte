<script lang="ts">
  import { TextField } from '@layerstack/ui';
  import { styleProps } from '@layerstack/svelte-attachments';

  let background = $state('#ddd');
  let border = $state('1px solid #aaa');

  const styles = $derived({ '--background': background, '--border': border });
</script>

<div class="grid gap-4" {@attach styleProps(styles)}>
  <div
    class="size-10 rounded-sm"
    style:background-color="var(--background)"
    style:border="var(--border)"
  ></div>
  <div class="grid grid-flow-col gap-2">
    <TextField label="Background" bind:value={background} />
    <TextField label="Border" bind:value={border} />
  </div>
</div>
