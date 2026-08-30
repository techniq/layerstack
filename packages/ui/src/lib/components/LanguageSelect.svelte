<script lang="ts" module>
  import type { ButtonProps } from './Button.svelte';

  export type Language = {
    name: string;
    code: string;
    flag: string;
  };

  type LanguageSelectOwnProps = {
    /** Languages offered.  Selecting one sets the locale used for date and number formatting */
    languages?: Language[];
    /** Called with the newly selected language */
    onLanguageSet?: (language: Language) => void;
  };

  export type LanguageSelectProps = LanguageSelectOwnProps &
    Omit<ButtonProps, keyof LanguageSelectOwnProps | 'children'>;
</script>

<script lang="ts">
  import { cls } from '@layerstack/tailwind';

  import Button from './Button.svelte';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import { getSettings } from './settingsState.svelte.js';

  let {
    languages = [
      { name: 'English', code: 'en', flag: '🇺🇸' },
      { name: 'Français', code: 'fr', flag: '🇫🇷' },
    ],
    onLanguageSet,
    ...restProps
  }: LanguageSelectProps = $props();

  const settings = getSettings();

  let open = $state(false);

  const selected = $derived(languages.find((l) => l.code === settings.locale));
</script>

<Button
  {...restProps}
  class={cls('LanguageSelect font-mono font-semibold', restProps.class)}
  iconOnly
  onclick={() => (open = !open)}
>
  {selected?.code ?? settings.locale}

  <Menu bind:open offset={4} explicitClose resize>
    <div class="grid gap-2 p-2 border-b border-surface-content/10">
      {#each languages as language (language.code)}
        <MenuItem
          onclick={() => {
            onLanguageSet?.(language);
            settings.setLocale(language.code);
          }}
          class={cls(
            'bg-surface-100 text-surface-content font-semibold border shadow-sm',
            selected === language && 'ring-2 ring-surface-content'
          )}
        >
          {language.flag} - {language.name}
        </MenuItem>
      {/each}
    </div>

    <div class="p-2 grid grid-cols-[auto_1fr] gap-2 items-center text-xs">
      <span class="font-medium">Affects date &amp; number formats</span>
    </div>
  </Menu>
</Button>
