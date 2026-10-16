<script lang="ts">
  import { TreeList } from '@layerstack/ui';
  import { buildTree } from '@layerstack/utils/array';

  // `buildTree` nests a flat list by its `level`
  const nodes = buildTree([
    { id: 'src', name: 'src', level: 1 },
    { id: 'src/lib', name: 'lib', level: 2 },
    { id: 'src/lib/index.ts', name: 'index.ts', level: 3 },
    { id: 'src/routes', name: 'routes', level: 2 },
    { id: 'package.json', name: 'package.json', level: 1 },
  ]);
</script>

<TreeList {nodes} classes={{ ul: 'pl-4', li: 'py-0.5' }}>
  {#snippet children({ node })}
    <span class="text-sm">{node.name}</span>
  {/snippet}
</TreeList>
