<script lang="ts">
  // No `children` snippet at all, so `Field` renders its value/placeholder fallback.  Also avoids
  // the `<label for>` association, which would otherwise re-dispatch clicks to the inner control.
  import Field from '../Field.svelte';

  let { value = $bindable(null), ...props }: Record<string, any> = $props();
</script>

<Field bind:value {...props} />
