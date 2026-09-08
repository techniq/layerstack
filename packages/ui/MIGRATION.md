# Migrating from `svelte-ux` to `@layerstack/ui`

`@layerstack/ui` is the Svelte 5 successor to [`svelte-ux`](https://github.com/techniq/svelte-ux).
Components keep their names, props, and Tailwind classes wherever possible; what changes is the
Svelte API surface (runes, snippets, attachments, callback props).

This file is the working reference for the migration — both the conventions to follow when porting
a component and the running list of breaking changes for consumers.

## Conventions

### Module script ordering

Always `<script lang="ts" module>`, never `<script module lang="ts">`.

The API generator (`layerstack-docs generate-api`) matches the module script with a regex that
expects `lang="ts"` before `module`. With the other ordering it silently reports
`⚠ No Props type found` and the component gets no API table. This matches LayerChart's convention.

### Props types

Declare own props separately, then subtract them from the element attributes:

```ts
type IconOwnProps = {
  size?: string | number;
  path?: string | string[];
  children?: Snippet;
};

export type IconProps = IconOwnProps & Omit<SVGAttributes<any>, keyof IconOwnProps>;
```

`Omit<..., keyof OwnProps>` matters: a plain intersection collapses `path?: string | string[]`
against the SVG `path` attribute into `string | (string[] & string)`, which nothing satisfies.

Name the type `<ComponentName>Props` and export it from the module script — that is what
`generate-api` looks for, and the exported name becomes `propsType` in the generated JSON.

Keep the element type parameter open (`SVGAttributes<any>`) for components that render different
elements depending on their props. A concrete intersection like
`HTMLAttributes<SVGElement & HTMLSpanElement>` produces event-handler types no element satisfies.

### Spreading rest props into a component union

Narrow to a single component type at the spread site:

```svelte
{@const IconComponent = data as Component<SVGAttributes<any>>}
<IconComponent {...restProps} />
```

Type-checking a spread against a union of component types (`svg component | lucide component`)
exceeds TypeScript's union complexity limit.

### Svelte 4 → 5 mechanics

| Svelte UX                        | `@layerstack/ui`                                |
| -------------------------------- | ----------------------------------------------- |
| `export let foo`                 | `let { foo } = $props()`                        |
| `export let foo` (two-way bound) | `let { foo = $bindable() } = $props()`          |
| `$: bar = ...`                   | `const bar = $derived(...)`                     |
| `$: { sideEffect() }`            | `$effect(() => { sideEffect() })`               |
| `$$restProps`                    | `...restProps` from `$props()`                  |
| `$$slots.default`                | the `children` snippet prop being defined       |
| `<slot />`                       | `{@render children?.()}`                        |
| `<slot name="x" />`              | an `x` snippet prop, `{@render x?.()}`          |
| `createEventDispatcher()`        | callback props (`onchange`, `onclose`, ...)     |
| `on:click` forwarding            | nothing — `onclick` arrives via the rest spread |
| `use:someAction`                 | `{@attach someAttachment()}`                    |
| `<script context="module">`      | `<script lang="ts" module>`                     |

Props that Svelte UX reassigned internally (Svelte 4 allowed writing to `export let`) become
`$derived` values computed from the incoming prop plus whatever else feeds them. Suffix the raw
prop with `Prop` when the derived value needs the plain name:

```ts
let { viewBox: viewBoxProp = '0 0 24 24', data }: IconProps = $props();
const viewBox = $derived(faIcon ? `0 0 ${faIcon.icon[0]} ${faIcon.icon[1]}` : viewBoxProp);
```

### Runes in classes

`$derived` class fields are initialized before the constructor body, so they cannot read fields the
constructor assigns — TypeScript rejects it, and it would be wrong at runtime. Derive inside the
constructor and expose a getter instead:

```ts
constructor(options) {
  const allLocales = getAllKnownLocales(options.localeFormats);
  const localeSettings = $derived(allLocales[this.locale] ?? ...);
  this.#localeSettings = () => localeSettings;
}

get localeSettings() {
  return this.#localeSettings();
}
```

### Callback props are camelCased

Custom callbacks use camelCase (`onChange`, `onClear`, `onBrushEnd`); native DOM handlers stay
lowercase (`onclick`, `oninput`, `onfocus`). This matches LayerChart and shadcn-svelte, and makes
the distinction visible at the call site — the lowercase ones are forwarded straight to an element,
the camelCased ones are the component's own API.

```diff
- dispatch('change', { value });
+ onChange?.(value);
```

Note that `onChange` and the native `onchange` differ by one letter and can both be set on the same
component — on `Input` the lowercase one is forwarded straight to the `<input>`. They are genuinely
different callbacks with different timing (`onChange` fires per keystroke, `onchange` on commit), so
say which one you mean in the prop's doc comment.

### Reactive context

Svelte UX set context once, so a parent whose props changed never updated its descendants. Pass
accessors so the context stays live:

```ts
setButtonGroup({
  get variant() {
    return variant;
  },
  get size() {
    return size;
  },
});
```

### Bridging prop types across components

When a parent's prop is wider than the child's (`HTMLInputElement | HTMLTextAreaElement` vs
`HTMLInputElement`), use a function binding rather than widening the child's type:

```svelte
<script>
  const getInputEl = () => inputEl as HTMLInputElement | null;
  const setInputEl = (el: HTMLInputElement | null) => (inputEl = el);
</script>

<Input bind:inputEl={getInputEl, setInputEl} />
```

Declare the getter/setter in the script, not inline. Prettier reformats an inline
`bind:x={() => a, (v) => b}` into a comma expression and produces a file that no longer parses.

### Derived values that are also written

Props that Svelte UX mutated in a reactive block need care. Prefer re-deriving over a separate
piece of state:

```ts
// `type` stays 'password'; the reveal button flips how it renders
let passwordRevealed = $state(false);
const inputType = $derived(type === 'password' ? (passwordRevealed ? 'text' : 'password') : ...);
```

Where state genuinely must be written from an effect that also reads it, read through `untrack` so
the effect does not retrigger on its own write:

```ts
$effect(() => {
  const next = potentialInputValue;
  untrack(() => {
    if (inputValue != next) inputValue = next;
  });
});
```

### Bindable props are read back as proxies

A value written to a `$bindable()` prop does not come back as the same object. When the parent binds
to `$state`, the write is proxied, so reference comparison against the original silently stops
matching:

```ts
// `selected` is a bindable prop, `option` came from the `options` array
selected = option;
selected === option; // false
```

Svelte UX got away with `option === selected` because `selected` was internal state. Compare by a
stable key instead — anything else loops, because an effect that guards its write on
`selected !== option` never sees them as equal:

```ts
function isSameOption(a, b) {
  return a == null || b == null ? a == null && b == null : a.value === b.value;
}
```

This bites in templates too (`aria-selected={option === selected}`), not just in effects.

### A `.svelte.ts` module cannot share a name with a `.svelte` component

`svelte-package` emits `Settings.svelte` as `Settings.svelte.d.ts` and `settings.svelte.ts` as
`settings.svelte.d.ts` — the same file on macOS and Windows, so one silently overwrites the other
and the component's props stop type-checking for consumers. Name the module after what it exports
(`settingsState.svelte.ts`) rather than after the component beside it.

The same applies to the barrel: a class and a component that share a name cannot both be exported
from the package root.

### A component cannot share a name with a type it imports

`svelte-package` emits both the import and the component declaration into one scope, so
`DateRange.svelte` importing `type DateRange` produces a `.d.ts` where the default export resolves
to a type-only declaration — consumers then get _"'DateRange' resolves to a type-only declaration
and must be imported using a type-only import"_. Alias the import:

```ts
import { type DateRange as DateRangeValue } from '@layerstack/utils/dateRange';
```

### Tests

Two files per component, matched by the `client` and `ssr` vitest projects:

- `<Name>.svelte.test.ts` — real Chromium via `vitest-browser-svelte`
- `<Name>.ssr.test.ts` — `render` from `svelte/server`

Components that need wrapper markup (snippet children, bindings) get a harness under
`src/lib/components/tests/`.

Three gotchas that cost real debugging time:

- **Delegated events need `bubbles: true`.** Svelte 5 delegates `click`, `input`, `keydown`,
  `keyup`, and friends to a root listener, so a synthetic `new KeyboardEvent('keydown')` (which
  does not bubble by default) never reaches the handler. `focus`/`blur` are not delegated and work
  either way. A handler that "isn't wired up" is usually this.
- **`target` is a render option.** `render(Component, { target: '_blank' })` is interpreted by
  `vitest-browser-svelte` as the DOM node to render into, not as a prop. Use the explicit
  `render(Component, { props: { ... } })` form for any prop whose name collides.
- **A `{...props as any}` spread defeats generic inference.** A harness that forwards its props
  with a spread gives a generic component (`<script generics="T extends object">`) nothing to infer
  from, so `T` falls back to its constraint and `form.draft.name` stops type-checking. List the
  props explicitly instead.
- **A harness that always passes a snippet makes fallbacks unreachable.** `{#snippet children()}`
  with conditional content still means `children !== undefined`, so a component's "no children"
  branch never runs. Use a second harness that omits the snippet entirely. Likewise, a
  `<label for>` wrapping a real control re-dispatches clicks to it, so click handlers fire twice.
- **`$effect` in a class constructor passes in a node environment and throws in a browser one.**
  Under the default node environment a `.svelte.ts` module is compiled for the server, where
  `$effect` is a no-op; add `// @vitest-environment happy-dom` and the same code raises
  `effect_orphan` unless it is constructed during component initialization. A state class that must
  also work from a plain module should expose an explicit `dispose()` rather than registering its
  own cleanup effect — `FetchState` does. `TimerState` still registers one, which is why its tests
  are the only ones in `@layerstack/svelte-state` without the `happy-dom` docblock.

### Bridging actions that are not migrated yet

Where an action still lives in another package, adapt it rather than reaching for `use:`:

```svelte
<script>
  import { fromAction } from 'svelte/attachments';
  import { tableCell } from '@layerstack/svelte-table';
</script>

<td {@attach fromAction(tableCell, () => ({ column, rowData, rowIndex }))}>…</td>
```

The getter keeps the options reactive. When the action itself is ported to an attachment, the call
site becomes `{@attach tableCell({ ... })}` with no other change.

### Scoping component settings to a subtree

`setComponentSettings({})` overrides the default props and classes for everything below it without
touching locale, theme, or icons. `MenuItem` uses it to keep app-wide `Button` styling out of menu
rows.

Svelte UX did this with `settings({ ...getSettings(), components: {} })`, which no longer works —
`Settings` is a class, so spreading it drops its getters and private fields.

### Docs example directories

Example folders live in one flat namespace (`docs/src/examples/components/<name>/`) and macOS is
case-insensitive, so a component named `Input` silently merges into an existing `input/` folder and
behaves differently on Linux CI. Docs for the packages a component replaces are namespaced to keep
the plain name free for the component:

- `action-input/`, `action-portal/`, … — `@layerstack/svelte-actions`
- `attach-input/`, `attach-focus/`, … — `@layerstack/svelte-attachments`
- `Input/`, `Button/`, … — `@layerstack/ui`

Namespaced folders need an explicit `component=` on the directive, since it otherwise defaults to
the page name: `:example{component="action-input" name="auto-focus"}`.

### Docs

- `docs/src/content/components/<Name>.md` — frontmatter (`description`, `category`, `related`),
  prose, and `:example{name="..." showCode}` directives
- `docs/src/examples/components/<Name>/<example>.svelte` — one file per example
- the API table is generated from the props type; do not hand-write it

## Breaking changes

### `@layerstack/svelte-actions` → `@layerstack/svelte-attachments`

Every action is now an attachment factory: it takes its options and returns the attachment, so
`use:thing={options}` becomes `{@attach thing(options)}`.

```diff
- <div use:sticky={{ top: true }}>
+ <div {@attach sticky({ top: true })}>
```

Two consequences follow from attachments running inside an effect:

- **There is no `update()`.** An attachment re-runs whenever the state it reads changes, and its
  cleanup runs first. Anything an action did in `update` to undo the previous run now belongs in the
  returned cleanup.
- **Cleanup is expected, not optional.** Several actions never removed what they applied, because
  the element was usually being destroyed anyway. The attachments do, so re-running is safe.

Custom events are replaced by callback options (`on:resize` → `onResize`), matching the callback
convention used by components.

**An attachment must not apply a Tailwind class of its own.** Tailwind only emits utilities it finds
while **scanning source files**, and a class added from a library's JavaScript is never scanned, so
the rule simply does not exist in the output. Utilities that happen to appear somewhere in the app
work by luck, which is what makes this so easy to miss.

Under Tailwind v3 this was hidden: apps listed `./node_modules/svelte-ux/**/*` in `content`, so the
package's own source was scanned. v4's `@source` does not cover installed packages by default, and
`spotlight` (which drew its gradients entirely from `before:*` utilities) and `scrollShadow` (the
same with `after:*`) both went silently invisible.

Where the effect needs a pseudo-element — which cannot be styled inline — the attachment ships the
rule itself, via `injectStyles(node, id, css)`:

- injected once per document (or shadow root) on first use, as a constructable stylesheet with a
  `<style>` fallback. No stylesheet import, and nothing tied to a CSS framework
- wrapped in `@layer layerstack`, so any style the app writes wins without a specificity fight
- the attachment marks the element with a **data attribute** (`data-spotlight`,
  `data-scroll-shadow`) and passes options through inline custom properties
- users keep the expressive path, because `[--spotlight-radius:100px]` and
  `hover:[--spotlight-radius:50px]` are written in _their_ markup, which is scanned normally

Defining the rule as a custom `@utility` does **not** work either — those are emitted on demand too,
so a name that is never scanned yields nothing.

Anything expressible inline should just be set inline. `scrollFade` sets `overflow` and its mask
directly and injects nothing, and both scroll attachments only set `position`/`overflow` when the
element does not already have them, so an app managing that itself is left alone.

Two are dropped rather than ported, because the language now covers them:

| Dropped                   | Replacement                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `multi`                   | attachments compose natively — put several `{@attach}` on one element, or `createAttachmentKey` to pass them through a component's props |
| `DomTracker`'s action map | `tracker.addAttachment(...)`, which folds another attachment's cleanup into the tracker                                                  |

`DomTracker` itself is ported. Its purpose narrows: an action instance persisted across `update()`
calls, so the tracker could keep state between them, whereas an attachment re-runs from scratch.
What remains useful — recording DOM changes so exactly those can be reversed, leaving changes made
by anything else alone — is what `sticky` and `spotlight` now use it for.

### `@layerstack/svelte-stores` → `@layerstack/svelte-state`

Every store is now a class whose properties are reactive. Construct it with `new`, and drop the `$`
prefix:

```diff
- const pagination = paginationStore({ total: 100 });
- {$pagination.page}
+ const pagination = new PaginationState({ total: 100 });
+ {pagination.page}
```

| Store                  | Replacement                                              |
| ---------------------- | -------------------------------------------------------- |
| `debounceStore`        | `DebouncedState`                                         |
| `fetchStore`           | `FetchState`                                             |
| `formStore`            | `FormState`                                              |
| `graphStore`           | `GraphState`                                             |
| `localStore`           | `LocalState`                                             |
| `matchMedia` + presets | `MediaQueryPresets`, over Svelte's `MediaQuery`          |
| `paginationStore`      | `PaginationState`                                        |
| `promiseStore`         | `PromiseState`                                           |
| `queryParamsStore`     | `QueryParamsState` (and `QueryParamState` for one param) |
| `selectionStore`       | `SelectionState`                                         |
| `themeStore`           | `ThemeState`                                             |
| `timerStore`           | `TimerState`                                             |
| `uniqueStore`          | `UniqueState`                                            |

Three are dropped rather than ported, because runes cover them directly:

| Dropped       | Replacement                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| `changeStore` | `$effect` with the previous value captured outside it                             |
| `dirtyStore`  | `$derived` comparing against the initial value — `!isEqual(initial, current)`     |
| `mapStore`    | `SvelteMap` from `svelte/reactivity`, which is reactive on `set`/`delete`/`clear` |

Where the store took another store, the class takes a **getter**, so the dependency is tracked:

```diff
- const debounced = debounceStore(value);
+ const debounced = new DebouncedState(() => value);
```

`QueryParamsState` takes `page` from `$app/state` rather than the `$app/stores` readable, and
forwards `gotoOptions` to `goto`. The store passed the whole page object as `goto`'s second
argument, which is its options position.

Cleanup that a store did when its last subscriber went away has no equivalent, since nothing
subscribes. `FetchState.dispose()` is explicit — wire it up with `$effect(() => state.dispose)`
where a shared `FetchErrors` collection needs pruning.

### Settings and formatting are no longer stores

`settings()` returns a `Settings` class instance whose properties are reactive. Drop the `$` store
prefix:

```diff
- {$format.number(value)}
+ {settings.format.number(value)}
```

`Settings.locale` is now a read-only getter; use `setLocale(value)` to change it. `currentTheme` is
a [`ThemeState`](https://next.layerstack.dev/docs/svelte-state/ThemeState) from
`@layerstack/svelte-state` rather than a theme store, so read `currentTheme.resolvedTheme` instead
of `$currentTheme.resolvedTheme`.

### `Icon`

- An explicit `width` or `height` is now respected for Font Awesome icons. Previously the component
  overwrote both with `1.0rem` regardless of what the caller passed. `size` is still overridden, so
  the default behavior is unchanged.
- `IconData` is no longer derived from `Icon`'s own props, and Font Awesome definitions are matched
  structurally — `@layerstack/ui` no longer depends on `@fortawesome/fontawesome-common-types`.
  Real `IconDefinition` values remain assignable.

### `Button`

- The `actions` prop and the `multi` action are gone. Pass attachments directly —
  `<Button {@attach autoFocus()}>` — and they reach the element through the rest spread.
- A `ButtonGroup`'s `variant`/`color`/`size`/`rounded` now update its buttons reactively; the
  context was previously a snapshot taken when the group initialized.

### `Input` and `TextField`

- The dispatched `change` event is now the `onChange` callback prop (`onchange` is the native
  attribute and is still forwarded). `Input` reports the masked string; `TextField` reports
  `{ value, inputValue, operator }`.
- `Input` no longer dispatches a synthetic `blur` in addition to forwarding the native one, which
  previously caused `on:blur` handlers to fire twice.
- `TextField`'s `actions` prop is gone; `autofocus` now applies the `autoFocus` attachment from
  `@layerstack/svelte-attachments`.
- `Field`'s slots (`prepend`, `append`, `prefix`, `suffix`, `root`, and the default slot's
  `let:id`) are snippets; the default slot becomes `children` and receives `{ id }`.

### `ProgressCircle`

- The root element's class is now `ProgressCircle` (it was `ProgressCircular`, inconsistent with
  every other component).
- Adds `role="progressbar"` and `aria-valuenow`/`min`/`max` for determinate circles. Both are
  overridable through rest props.

### `Popover` and `Menu`

- `Popover`'s `clickOutside` DOM event is gone. The `popover` attachment takes an `onClickOutside`
  option, which drives `Popover`'s `onClose(reason)` — `'clickOutside'`, `'escape'`, or `'unknown'`.
- `Menu`'s `close` event is `onClose(reason)`, which adds `'item'` for a click on a menu row.
- `Menu`'s internal `popoverOpen`/`previousExternalOpen` mirror is gone; `open` is `$bindable`.
  That workaround existed only for Svelte 5 legacy compatibility.
- Both take `children` as a snippet receiving `{ close }`.

### `Dialog`

- The `open`, `close`, and `closeAttempt` events are the `onOpen`, `onClose`, and `onCloseAttempt`
  callback props. None fire on mount — only on an actual open/close transition.
- The `header`, `title`, `actions`, and default slots are snippets, each receiving
  `{ open, close }`.
- The `!e.target.hasAttribute('slot')` guard in the actions click handler is gone — there are no
  `slot` attributes in Svelte 5. Opt a button out with `e.stopPropagation()`.

### `Table`

- The `headerClick` and `cellClick` events are the `onHeaderClick` and `onCellClick` callback
  props. `onCellClick` now also receives `rowIndex`.
- The `data` slot is the `body` snippet — a snippet named `data` would collide with the `data` prop.
  The `headers` slot keeps its name.
- Formatting reads `settings.format` directly rather than the `$format` store.
- `getComponentClasses('Table')` works now, so `Table` picks up `settings({ components: { Table } })`.
  Svelte UX stubbed this out with a "TODO: Figure out circular reference error" — the cycle was
  really just `Table` missing from the components barrel.
- With an `order` store, header clicks are wired up by the `tableCell` behavior itself. Passing
  `onHeaderClick={order.onHeaderClick}` **as well** sorts twice per click; use `onHeaderClick` only
  for extra behavior.

### `SelectField`, `MenuField`, `MenuButton`

- `on:change` → `onChange({ value, option })`; `SelectField`'s `on:inputChange` → `onInputChange(text)`.
- `SelectField` compares options by `value` rather than by reference, so an option object rebuilt
  between renders still matches the current selection.
- `MenuField`'s `menuIcon` on `MenuButton` accepts `false`/`null` to hide the chevron, rather than
  relying on a slot.

### `MultiSelect` and friends

- `on:change`, `on:cancel`, and the `apply` handler are the `onChange`, `onCancel`, and `onApply`
  callback props. `onApply` is awaited, and Apply shows a spinner while it runs.
- The dirty state that gated the Apply button came from `dirtyStore`/`changeStore` in
  `@layerstack/svelte-stores`. It is now a snapshot of the last applied selection held inside the
  component, so nothing external is needed and Apply enables only when the staged selection actually
  differs.
- `MultiSelectOption`'s `checkmark` and `fill` variants report clicks through `onChange` and do not
  toggle `checked` themselves — only the default `checkbox` variant is self-managing.
- `MultiSelectField`'s `formatSelected` receives the _selected_ options as `options`, not the full
  list. (Unchanged from Svelte UX, but it reads as if it were the full list.)

### `DateRange` and `DateRangeField`

- `on:change` → `onChange(value)`, and `DateRangeField` gains `onClear`.
- `emptyDateRange` is exported from the package root rather than from the component module.
- Both take `utc` to work on UTC calendar boundaries, for values keyed on a UTC date.

### `QuickSearch`

- `on:change` → `onChange({ value, option })`.
- The `⌘K` shortcut is not registered for you. The button renders the hint; bind `open` and add the
  key handler where it belongs in your app.

### `Form`

- The nine slot props (`state`, `draft`, `errors`, `commit`, `revert`, `revertAll`, `undo`,
  `refresh`, `current`) collapse to one snippet argument, `{ form }` — a
  [`FormState`](https://www.layerstack.dev/docs/svelte-state/FormState) carrying all of them plus
  `isDirty` and `canUndo`.
- `refresh()` and `current` are gone. `form.draft` is a `$state` proxy, so
  `bind:value={form.draft.name}` updates reactively; the immer draft the old store used did not.
- `on:change` is `onChange(value)`, and no longer fires on mount.
- A `form` prop accepts a `FormState` you own, for reading or driving the form from outside.

```diff
- <Form initial={data} on:change={(e) => (data = e.detail)} let:draft let:commit let:refresh>
-   <TextField value={draft.name} on:change={(e) => { draft.name = e.detail.value; refresh(); }} />
-   <Button on:click={() => commit()}>Apply</Button>
- </Form>
+ <Form initial={data} onChange={(value) => (data = value)}>
+   {#snippet children({ form })}
+     <TextField bind:value={form.draft.name} />
+     <Button type="submit">Apply</Button>
+   {/snippet}
+ </Form>
```

### Dropped

Not migrated, with what replaces each:

| Dropped                             | Replacement                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `ApiDocs`                           | `layerstack-docs generate-api` renders API tables from the props type                 |
| `StoreSubscribe`                    | `$state`/`$derived` — subscribing to a store in markup has no purpose under runes     |
| `State`                             | a plain `let x = $state(...)`, or [`Toggle`](#) / `Selection` for markup-scoped state |
| `Preview`                           | the docs site's `Example` component, which already pairs a rendering with its source  |
| `plugins/vite.js` (`sveld`)         | `layerstack-docs generate-api`                                                        |
| `plugins/svelte.js` (`codePreview`) | the docs `Example` component                                                          |

`Code` was **kept** rather than moved into `@layerstack/docs`. A syntax-highlighted block is useful
outside a docs site (config, logs, API samples), Svelte UX's implementation is already
framework-agnostic (`esm-env` rather than `$app/environment`), and keeping one copy in
`@layerstack/ui` removes the near-duplicate that `@layerstack/docs` maintains today — that package
can consume this one once it moves off published `svelte-ux`.

`shiki` and `@shikijs/transformers` are declared as **optional peer dependencies** so the highlighter
does not land in the bundle of every app that installs `@layerstack/ui`. Both are imported
dynamically and `Code` degrades to plain text when they are absent.
