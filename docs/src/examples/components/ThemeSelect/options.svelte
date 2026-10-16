<script lang="ts">
  import { ThemeSelect } from '@layerstack/ui';

  let chosen = $state<string | null>(null);
</script>

<div class="flex gap-6 items-center">
  <!-- Defaults to the themes given to `settings()` -->
  <ThemeSelect onThemeSet={({ theme }) => (chosen = theme)} />

  <!-- Or list them explicitly -->
  <ThemeSelect
    lightThemes={['light']}
    darkThemes={['dark']}
    variant="outline"
    onThemeSet={({ theme }) => (chosen = theme)}
  />

  <!-- Ctrl+T toggles the scheme, Ctrl+Shift+T cycles themes -->
  <ThemeSelect keyboardShortcuts variant="fill-light" color="primary" />
</div>

<div class="mt-3 text-sm text-surface-content/70">Last set: {chosen ?? '(none)'}</div>
