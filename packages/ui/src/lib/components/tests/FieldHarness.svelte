<script lang="ts">
  import Field from '../Field.svelte';

  let {
    value = $bindable(null),
    withPrepend = false,
    withAppend = false,
    withPrefix = false,
    withSuffix = false,
    withRoot = false,
    withChildren = true,
    ...props
  }: Record<string, any> = $props();
</script>

<Field bind:value {...props}>
  {#snippet children({ id })}
    {#if withChildren}
      <input {id} data-testid="field-input" />
    {/if}
  {/snippet}

  {#snippet prepend()}
    {#if withPrepend}<span data-testid="prepend">pre</span>{/if}
  {/snippet}

  {#snippet append()}
    {#if withAppend}<span data-testid="append">app</span>{/if}
  {/snippet}

  {#snippet prefix()}
    {#if withPrefix}<span data-testid="prefix">$</span>{/if}
  {/snippet}

  {#snippet suffix()}
    {#if withSuffix}<span data-testid="suffix">%</span>{/if}
  {/snippet}

  {#snippet root()}
    {#if withRoot}<span data-testid="root">root</span>{/if}
  {/snippet}
</Field>
