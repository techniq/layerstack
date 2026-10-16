<script lang="ts">
  import { Code } from '@layerstack/ui';

  const source = `const total = items.reduce((sum, item) => sum + item.value, 0);
const average = total / items.length;
const max = Math.max(...items.map((i) => i.value));
return { total, average, max };`;
</script>

<div class="grid gap-4">
  <Code {source} language="ts" showLineNumbers highlight="2,4" />
  <Code {source} language="ts" copyButton="hover" />
</div>
