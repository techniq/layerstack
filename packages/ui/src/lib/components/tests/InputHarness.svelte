<script lang="ts">
  import Input from '../Input.svelte';

  let { value = $bindable(''), ...props }: Record<string, any> = $props();
</script>

<Input bind:value {...props} />

<output data-testid="bound-value">{value}</output>
