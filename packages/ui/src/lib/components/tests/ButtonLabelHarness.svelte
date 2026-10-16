<script lang="ts">
  import Button from '../Button.svelte';

  let { label = 'Click me', ...props }: Record<string, any> = $props();
</script>

<Button {...props}>{label}</Button>
