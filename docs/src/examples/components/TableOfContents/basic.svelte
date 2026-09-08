<script lang="ts">
  import { TableOfContents } from '@layerstack/ui';
</script>

<!-- Collects headings from the page's `<main>` and highlights the one in view -->
<div class="border rounded-sm p-3 max-w-xs text-sm">
  <TableOfContents
    linkIndent={8}
    classes={{
      a: 'py-0.5 text-surface-content/60 hover:text-primary data-[active]:text-primary data-[active]:font-medium',
    }}
  />
</div>
