<script lang="ts">
  import { ThemeSwitch } from '@layerstack/ui';

  let chosen = $state<string | null>(null);
</script>

<div class="flex gap-6 items-center">
  <ThemeSwitch onThemeSet={({ theme }) => (chosen = theme)} />

  <!-- Every Switch prop passes through -->
  <ThemeSwitch size="lg" color="primary" />
  <ThemeSwitch size="sm" classes={{ icon: 'text-warning' }} />
</div>

<div class="mt-3 text-sm text-surface-content/70">Last set: {chosen ?? '(none)'}</div>
