<script lang="ts">
  // All docs pages now render through the markdown-based framework via the
  // `[packageName]/[name]` dynamic route (which provides its own chrome, TOC,
  // source links, and examples context). This layout just clears the root
  // layout's component theme so it doesn't bleed into the rendered examples.
  import { settings, getSettings } from 'svelte-ux';

  settings({ ...getSettings(), components: {} });
</script>

<slot />
