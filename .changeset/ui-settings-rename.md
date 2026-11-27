---
'@layerstack/ui': minor
---

fix: Rename the `Settings` class to `SettingsState` and move it to `settingsState.svelte.ts`.

Two collisions, both of which broke `import { Settings } from '@layerstack/ui'`:

- The class and the `Settings.svelte` component both exported as `Settings` from the package root,
  and the class won — so importing `Settings` gave you the class, not the component.
- `Settings.svelte` and `settings.svelte.ts` both emit `settings.svelte.d.ts`, which are the same
  file on case-insensitive filesystems. The component's declaration was being overwritten by the
  module's, so its props did not type-check for consumers.

`settings()`, `getSettings()`, and `SettingsOptions` are unchanged.
