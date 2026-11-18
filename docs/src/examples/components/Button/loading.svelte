<script lang="ts">
  import { Button } from '@layerstack/ui';
  import { mdiRefresh } from '@mdi/js';

  let loading = $state(false);

  function submit() {
    loading = true;
    setTimeout(() => (loading = false), 2000);
  }
</script>

<div class="flex flex-wrap items-center gap-2">
  <Button {loading} icon={mdiRefresh} variant="fill" color="primary" onclick={submit}>
    {loading ? 'Working…' : 'Click to load'}
  </Button>

  <Button loading variant="outline">Always loading</Button>
</div>
