<script lang="ts" module>
  import type { SwitchProps } from './Switch.svelte';

  type ThemeSwitchOwnProps = {
    classes?: { icon?: string } & SwitchProps['classes'];
    /** Called with the newly selected theme */
    onThemeSet?: (detail: { theme: string }) => void;
  };

  export type ThemeSwitchProps = ThemeSwitchOwnProps &
    Omit<SwitchProps, keyof ThemeSwitchOwnProps | 'checked' | 'children'>;
</script>

<script lang="ts">
  import { cls, clsMerge } from '@layerstack/tailwind';

  import Icon from './Icon.svelte';
  import Switch from './Switch.svelte';
  import { getSettings } from './settingsState.svelte.js';
  import { getComponentClasses } from './theme.js';

  let { classes = {}, onThemeSet, ...restProps }: ThemeSwitchProps = $props();

  const settings = getSettings();
  const icons = $derived(settings.icons);
  const { icon: iconClasses, ...otherClasses } = getComponentClasses('ThemeSwitch');
</script>

<Switch
  checked={settings.currentTheme.dark}
  onchange={(e) => {
    const newTheme = e.currentTarget.checked ? 'dark' : 'light';
    onThemeSet?.({ theme: newTheme });
    settings.currentTheme.setTheme(newTheme);
  }}
  classes={clsMerge(
    {
      switch: 'dark:bg-primary dark:border-primary',
      toggle: 'translate-x-0 dark:translate-x-full',
    },
    otherClasses,
    classes
  )}
  {...restProps}
>
  <div class="grid grid-stack">
    <Icon
      data={icons.darkMode}
      class={cls('size-3 text-primary opacity-0 dark:opacity-100', iconClasses, classes.icon)}
    />
    <Icon
      data={icons.lightMode}
      class={cls('size-3 text-primary opacity-100 dark:opacity-0', iconClasses, classes.icon)}
    />
  </div>
</Switch>
