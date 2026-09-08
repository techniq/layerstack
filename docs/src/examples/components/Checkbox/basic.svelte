<script lang="ts">
  import { Checkbox } from '@layerstack/ui';

  let checked = $state(true);
</script>

<div class="grid gap-2">
  <Checkbox bind:checked>Accept terms</Checkbox>
  <Checkbox checked indeterminate>Indeterminate</Checkbox>
  <Checkbox circle>Circle</Checkbox>
  <Checkbox disabled checked>Disabled</Checkbox>
</div>
