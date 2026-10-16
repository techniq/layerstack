<script lang="ts">
  import Dialog from '../Dialog.svelte';

  let {
    open = $bindable(false),
    withTitle = true,
    withActions = true,
    withHeader = false,
    ...props
  }: Record<string, any> = $props();
</script>

<button data-testid="trigger" onclick={() => (open = true)}>Open</button>

<!-- Snippets are passed conditionally so the component's own fallbacks stay reachable -->
{#snippet headerSnippet()}
  <div data-testid="custom-header">Custom header</div>
{/snippet}

{#snippet titleSnippet()}
  Dialog title
{/snippet}

{#snippet actionsSnippet()}
  <button data-testid="action-cancel">Cancel</button>
  <button data-testid="action-stop" onclick={(e) => e.stopPropagation()}>Stay</button>
{/snippet}

<Dialog
  bind:open
  {...props}
  header={withHeader ? headerSnippet : undefined}
  title={withTitle ? titleSnippet : undefined}
  actions={withActions ? actionsSnippet : undefined}
>
  {#snippet children(ctx)}
    <div data-testid="content">Body content (open: {ctx.open})</div>
    <button data-testid="force-close" onclick={() => ctx.close({ force: true })}>Force</button>
  {/snippet}
</Dialog>

<output data-testid="open-state">{open}</output>
