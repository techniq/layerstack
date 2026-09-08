<script lang="ts">
  import { Field, ToggleGroup, ToggleOption } from '@layerstack/ui';
  import { computedStyles } from '@layerstack/svelte-attachments';
  import { cls } from '@layerstack/tailwind';

  import { Json } from '@layerstack/docs/components';

  let _styles: Record<string, string> = $state({});
  let backgroundClass = $state('bg-primary');
  let outlineStyle = $state('solid');

  /**
   * `getComputedStyle` returns a live object, and the same reference on every call, so assigning it
   * to state would not register as a change.  Snapshot it into a plain object instead.
   */
  function snapshot(styles: CSSStyleDeclaration) {
    return Object.fromEntries(
      Array.from(styles).map((property) => [property, styles.getPropertyValue(property)])
    );
  }
</script>

<div class="grid gap-3">
  <div
    {@attach computedStyles((styles) => (_styles = snapshot(styles)))}
    class={cls('size-10 rounded-sm outline-offset-2', backgroundClass)}
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
      value={{
        backgroundColor: _styles['background-color'],
        outlineStyle: _styles['outline-style'],
      }}
      defaultExpandedPaths={[]}
    />
  </Field>

  <Field label="All styles">
    <Json value={_styles} defaultExpandedPaths={[]} />
  </Field>
</div>
