<script lang="ts">
  import { ToggleGroup, ToggleOption } from '@layerstack/ui';

  const variants = [
    'default',
    'outline',
    'fill',
    'fill-light',
    'fill-surface',
    'underline',
  ] as const;
</script>

<div class="grid gap-4">
  {#each variants as variant (variant)}
    <div>
      <div class="text-xs text-surface-content/50 mb-1">{variant}</div>
      <ToggleGroup value="b" {variant} inset>
        <ToggleOption value="a">One</ToggleOption>
        <ToggleOption value="b">Two</ToggleOption>
        <ToggleOption value="c">Three</ToggleOption>
      </ToggleGroup>
    </div>
  {/each}
</div>
