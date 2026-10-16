<script lang="ts">
  import Icon from '../Icon.svelte';

  let { ...props }: Record<string, any> = $props();
</script>

<Icon {...props}>
  <svg data-testid="custom-child" viewBox="0 0 24 24"></svg>
</Icon>
