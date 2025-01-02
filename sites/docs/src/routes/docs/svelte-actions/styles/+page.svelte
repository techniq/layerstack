<script lang="ts">
  import { TextField } from 'svelte-ux';
  import { computedStyles, styleProps } from '@layerstack/svelte-actions';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';
  import Json from '$docs/Json.svelte';

  let _styles: CSSStyleDeclaration;
  let background = '#ddd';
  let border = '1px solid #aaa';
</script>

<h1>Usage</h1>

<Code
  source={`import { computedStyles, styleProps } from '@layerstack/svelte-actions';`}
  language="javascript"
  class="mb-4"
/>

<h2>
  computedStyles <small>
    Retrieve all computed styles for element. Useful to resolve CSS variable values or working with
    `canvas`.
  </small>
</h2>

<Preview>
  <div class="bg-primary" use:computedStyles={(styles) => (_styles = styles)}></div>
  <Json value={_styles} defaultExpandedPaths={[]} />
</Preview>

<h2>styleProps <small>Reactively set style properties using a single object.</small></h2>

<Preview>
  {@const styles = { '--background': background, '--border': border }}
  <div class="grid gap-4" use:styleProps={styles}>
    <div
      class="w-10 h-10 rounded"
      style:background-color="var(--background)"
      style:border="var(--border)"
    ></div>
    <div class="grid grid-flow-col gap-2">
      <TextField label="Background" bind:value={background} />
      <TextField label="Border" bind:value={border} />
    </div>
  </div>
</Preview>
