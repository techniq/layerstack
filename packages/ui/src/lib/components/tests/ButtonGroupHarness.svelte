<script lang="ts">
  import Button from '../Button.svelte';
  import ButtonGroup from '../ButtonGroup.svelte';

  let {
    count = 3,
    buttonProps = {},
    ...groupProps
  }: { count?: number; buttonProps?: Record<string, any> } & Record<string, any> = $props();
</script>

<ButtonGroup {...groupProps}>
  {#each Array.from({ length: count }, (_, i) => i) as i (i)}
    <Button {...buttonProps}>Button {i}</Button>
  {/each}
</ButtonGroup>
