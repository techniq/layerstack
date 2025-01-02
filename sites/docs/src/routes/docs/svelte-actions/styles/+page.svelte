<script lang="ts">
  import { cls, Field, TextField, ToggleGroup, ToggleOption } from 'svelte-ux';
  import { computedStyles, styleProps } from '@layerstack/svelte-actions';

  import Preview from '$docs/Preview.svelte';
  import Code from '$docs/Code.svelte';
  import Json from '$docs/Json.svelte';

  let _styles: CSSStyleDeclaration;
  let backgroundClass = 'bg-primary';
  let outlineStyle = 'solid';

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
  <div class="grid gap-3">
    <div
      use:computedStyles={(styles) => (_styles = styles)}
      class={cls('size-10 rounded outline-offset-2', backgroundClass)}
      style:outline-style={outlineStyle}
    ></div>

    <div class="grid grid-cols-2 gap-3">
      <Field label="Background Class">
        <ToggleGroup bind:value={backgroundClass} variant="outline" inset>
          <ToggleOption value="bg-primary">primary</ToggleOption>
          <ToggleOption value="bg-secondary">secondary</ToggleOption>
        </ToggleGroup>
      </Field>

      <Field label="Outline Style">
        <ToggleGroup bind:value={outlineStyle} variant="outline" inset>
          <ToggleOption value="solid">solid</ToggleOption>
          <ToggleOption value="dashed">dashed</ToggleOption>
          <ToggleOption value="dotted">dotted</ToggleOption>
        </ToggleGroup>
      </Field>
    </div>

    <Field label="Focal styles">
      <Json
        value={{ backgroundColor: _styles?.backgroundColor, outlineStyle: _styles?.outlineStyle }}
        defaultExpandedPaths={[]}
      />
    </Field>

    <Field label="All styles">
      <Json value={_styles} defaultExpandedPaths={[]} />
    </Field>
  </div>
</Preview>

<h2>styleProps <small>Reactively set style properties using a single object.</small></h2>

<Preview>
  {@const styles = { '--background': background, '--border': border }}
  <div class="grid gap-4" use:styleProps={styles}>
    <div
      class="size-10 rounded"
      style:background-color="var(--background)"
      style:border="var(--border)"
    ></div>
    <div class="grid grid-flow-col gap-2">
      <TextField label="Background" bind:value={background} />
      <TextField label="Border" bind:value={border} />
    </div>
  </div>
</Preview>
