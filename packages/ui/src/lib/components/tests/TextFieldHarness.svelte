<script lang="ts">
  import TextField from '../TextField.svelte';

  let { value = $bindable(''), ...props }: Record<string, any> = $props();
</script>

<TextField bind:value {...props} />
