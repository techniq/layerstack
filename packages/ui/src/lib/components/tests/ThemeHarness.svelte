<script lang="ts">
  import LanguageSelect from '../LanguageSelect.svelte';
  import Settings from '../Settings.svelte';
  import ThemeSelect from '../ThemeSelect.svelte';
  import ThemeSwitch from '../ThemeSwitch.svelte';
  import Tooltip from '../Tooltip.svelte';

  let {
    kind,
    options = {},
    ...props
  }: { kind: string; options?: any } & Record<string, any> = $props();
</script>

<Settings {...options} themeInit={false}>
  {#if kind === 'theme-switch'}
    <ThemeSwitch {...props as any} />
  {:else if kind === 'theme-select'}
    <ThemeSelect {...props as any} />
  {:else if kind === 'language'}
    <LanguageSelect {...props as any} />
  {:else if kind === 'tooltip'}
    <Tooltip {...props as any}>
      <button data-testid="trigger">Hover me</button>
    </Tooltip>
  {/if}
</Settings>
