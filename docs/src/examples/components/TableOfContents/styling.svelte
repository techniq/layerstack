<script lang="ts">
  import { TableOfContents } from '@layerstack/ui';
</script>

<div class="grid grid-cols-2 gap-8">
  <div id="toc-source" class="text-sm">
    <h2>Chapter 1</h2>
    <h3>New beginnings</h3>
    <h4>A brief interlude</h4>
    <h3>The journey</h3>
    <h2>Chapter 2</h2>
    <h2>Chapter 3</h2>
  </div>

  <div class="grid gap-6">
    <!-- Stop at h3 -->
    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">maxDepth 3</div>
      <TableOfContents element="#toc-source" maxDepth={3} />
    </div>

    <!-- Indent the links rather than the list items, and draw a rail -->
    <div>
      <div class="text-xs uppercase text-surface-content/50 mb-1">linkIndent with a rail</div>
      <TableOfContents
        element="#toc-source"
        itemIndent={0}
        linkIndent={12}
        classes={{ ul: 'border-l border-surface-content/10' }}
      />
    </div>
  </div>
</div>
