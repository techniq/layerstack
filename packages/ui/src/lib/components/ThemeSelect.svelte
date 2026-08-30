<script lang="ts" module>
  import type { ButtonProps } from './Button.svelte';

  type ThemeSelectOwnProps = {
    /** Dark themes to choose from.  Defaults to those given to `settings()` */
    darkThemes?: string[];
    /** Light themes to choose from.  Defaults to those given to `settings()` */
    lightThemes?: string[];
    /** Bind `Ctrl+T` to toggle the color scheme and `Ctrl+Shift+T` to cycle themes */
    keyboardShortcuts?: boolean;
    /** Called with the newly selected theme (`'system'` when reset) */
    onThemeSet?: (detail: { theme: string }) => void;
  };

  export type ThemeSelectProps = ThemeSelectOwnProps &
    Omit<ButtonProps, keyof ThemeSelectOwnProps | 'children'>;
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Kbd from './Kbd.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import Switch from './Switch.svelte';
  import Tooltip from './Tooltip.svelte';
  import { getSettings } from './settingsState.svelte.js';

  const settings = getSettings();

  let {
    darkThemes,
    lightThemes,
    keyboardShortcuts = false,
    onThemeSet,
    ...restProps
  }: ThemeSelectProps = $props();

  const icons = $derived(settings.icons);
  const currentTheme = $derived(settings.currentTheme);

  const resolvedDarkThemes = $derived(darkThemes ?? settings.themes.dark ?? ['dark']);
  const resolvedLightThemes = $derived(lightThemes ?? settings.themes.light ?? ['light']);

  const themes = $derived(currentTheme.dark ? resolvedDarkThemes : resolvedLightThemes);

  /** Multiple themes per scheme means offering a picker rather than a simple light/dark/system menu */
  const hasThemeChoice = $derived(resolvedDarkThemes.length > 1 || resolvedLightThemes.length > 1);

  let open = $state(false);

  function setTheme(theme: string) {
    onThemeSet?.({ theme });
    currentTheme.setTheme(theme);
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (!keyboardShortcuts) return;
    if (!(e.ctrlKey && e.code === 'KeyT')) return;

    if (e.shiftKey) {
      // Cycle to the next theme within the current scheme
      const currentIndex = themes.indexOf(currentTheme.resolvedTheme);
      setTheme(themes[(currentIndex + 1) % themes.length]);
    } else {
      setTheme(currentTheme.dark ? 'light' : 'dark');
    }
  }}
/>

<Button
  {...restProps}
  class={cls('ThemeSelect', restProps.class)}
  iconOnly
  onclick={() => (open = !open)}
>
  <div
    class={hasThemeChoice
      ? 'grid grid-cols-1 grid-rows-1 overflow-hidden'
      : 'grid grid-stack overflow-hidden'}
  >
    <Icon
      data={icons.lightMode}
      class={cls(
        hasThemeChoice && 'row-[1] col-[1]',
        'translate-x-0 dark:-translate-x-full transition-transform duration-300'
      )}
    />
    <Icon
      data={icons.darkMode}
      class={cls(
        hasThemeChoice && 'row-[1] col-[1]',
        'translate-x-full dark:translate-x-0 transition-transform duration-300'
      )}
    />
  </div>

  {#if hasThemeChoice}
    <Menu bind:open explicitClose resize="height" classes={{ root: 'w-[400px] max-w-[95vw]' }}>
      <label
        for="switch-color-scheme"
        class="grid grid-cols-[1fr_auto_auto] items-center p-2 border-b border-surface-content/10 mb-1 text-sm font-medium sticky top-0 bg-surface-100"
      >
        Mode
        {#if currentTheme.theme}
          <span transition:fly={{ x: 8 }}>
            <Tooltip title="Reset to System" offset={2}>
              <Button
                icon={icons.undo}
                color="primary"
                size="sm"
                class="mr-1"
                onclick={() => setTheme('system')}
              />
            </Tooltip>
          </span>
        {/if}

        <Switch
          id="switch-color-scheme"
          checked={currentTheme.dark}
          onchange={(e) => setTheme(e.currentTarget.checked ? 'dark' : 'light')}
          class="my-1"
        >
          {#snippet children({ checked })}
            {#if checked}
              <Icon data={icons.darkMode} class="size-3 text-primary" />
            {:else}
              <Icon data={icons.lightMode} class="size-3 text-primary" />
            {/if}
          {/snippet}
        </Switch>
      </label>

      <div class="grid grid-cols-2 gap-2 p-2">
        {#each themes as themeName (themeName)}
          <MenuItem
            onclick={() => setTheme(themeName)}
            data-theme={themeName}
            class={cls(
              'bg-surface-100 text-surface-content font-semibold border shadow-sm',
              currentTheme.resolvedTheme === themeName && 'ring-2 ring-surface-content'
            )}
          >
            <div class="grid gap-1">
              <div class="w-4 h-4 rounded-full bg-primary"></div>
              <div class="w-4 h-4 rounded-full bg-secondary"></div>
            </div>
            {themeName}
          </MenuItem>
        {/each}
      </div>

      {#if keyboardShortcuts}
        <div
          class="p-2 grid grid-cols-[auto_1fr] gap-2 items-center text-xs sticky bottom-0 bg-surface-100 border-t border-surface-content/10"
        >
          <span class="font-medium">Toggle scheme:</span>
          <span><Kbd control /> + <Kbd>T</Kbd></span>

          <span class="font-medium">Next theme:</span>
          <span><Kbd control /> + <Kbd shift /> + <Kbd>T</Kbd></span>
        </div>
      {/if}
    </Menu>
  {:else}
    <Menu bind:open classes={{ menu: 'p-1' }}>
      <MenuItem
        icon={icons.lightMode}
        selected={currentTheme.theme === 'light'}
        onclick={() => setTheme('light')}
      >
        Light
      </MenuItem>

      <MenuItem
        icon={icons.darkMode}
        selected={currentTheme.theme === 'dark'}
        onclick={() => setTheme('dark')}
      >
        Dark
      </MenuItem>

      <MenuItem
        icon={icons.monitor}
        selected={currentTheme.theme == null}
        onclick={() => setTheme('system')}
      >
        System
      </MenuItem>
    </Menu>
  {/if}
</Button>
