<script lang="ts">
  import { QuickSearch } from '@layerstack/ui';

  const options = [
    { label: 'Dashboard', value: '/dashboard', group: 'pages' },
    { label: 'Settings', value: '/settings', group: 'pages' },
    { label: 'Profile', value: '/profile', group: 'pages' },
    { label: 'New project', value: 'new-project', group: 'actions' },
    { label: 'Invite teammate', value: 'invite', group: 'actions' },
  ];

  let open = $state(false);
  let chosen = $state<string | null>(null);
</script>

<QuickSearch {options} bind:open onChange={({ value }) => (chosen = value)} />

<div class="mt-3 text-sm text-surface-content/70">Chosen: {chosen ?? '(none)'}</div>
