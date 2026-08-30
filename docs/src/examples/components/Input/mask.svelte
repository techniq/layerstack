<script lang="ts">
  import { Input } from '@layerstack/ui';

  let phone = $state('');
  let date = $state('');
</script>

<div class="grid gap-2 max-w-sm">
  <Input bind:value={phone} mask="(___) ___-____" class="border rounded-sm px-2 py-1" />
  <Input bind:value={date} mask="__/__/____" class="border rounded-sm px-2 py-1" />
  <div class="text-sm text-surface-content/70">
    <code>{phone || '(empty)'}</code> / <code>{date || '(empty)'}</code>
  </div>
</div>
