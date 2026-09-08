import { getContext, setContext } from 'svelte';
import { BROWSER } from 'esm-env';

import { buildFormatters, type FormatFunctions } from '@layerstack/utils/format';
import {
  getAllKnownLocales,
  type LocaleSettings,
  type LocaleSettingsInput,
} from '@layerstack/utils/locale';
import { breakpoints, ThemeState } from '@layerstack/svelte-state';

import {
  type ComponentName,
  type ComponentSettings,
  type ResolvedComponentSettings,
  resolveComponentClasses,
  type ResolvedDefaultProps,
} from './theme.js';
import type { IconComponent, LabelPlacement } from '../types/index.js';

import LucideArrowUp from '@lucide/svelte/icons/arrow-up';
import LucideArrowDown from '@lucide/svelte/icons/arrow-down';
import LucideArrowLeft from '@lucide/svelte/icons/arrow-left';
import LucideArrowRight from '@lucide/svelte/icons/arrow-right';
import LucideBraces from '@lucide/svelte/icons/braces';
import LucideCalendar from '@lucide/svelte/icons/calendar';
import LucideCheck from '@lucide/svelte/icons/check';
import LucideChevronLeft from '@lucide/svelte/icons/chevron-left';
import LucideChevronRight from '@lucide/svelte/icons/chevron-right';
import LucideChevronDown from '@lucide/svelte/icons/chevron-down';
import LucideChevronFirst from '@lucide/svelte/icons/chevron-first';
import LucideChevronLast from '@lucide/svelte/icons/chevron-last';
import LucideClipboardPaste from '@lucide/svelte/icons/clipboard-paste';
import LucideCode from '@lucide/svelte/icons/code';
import LucideCopy from '@lucide/svelte/icons/copy';
import LucideDollarSign from '@lucide/svelte/icons/dollar-sign';
import LucideEllipsis from '@lucide/svelte/icons/ellipsis';
import LucideEllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
import LucideEye from '@lucide/svelte/icons/eye';
import LucideGripHorizontal from '@lucide/svelte/icons/grip-horizontal';
import LucideHouse from '@lucide/svelte/icons/house';
import LucideInfo from '@lucide/svelte/icons/info';
import LucideCircleAlert from '@lucide/svelte/icons/circle-alert';
import LucideMenu from '@lucide/svelte/icons/menu';
import LucideMinus from '@lucide/svelte/icons/minus';
import LucidePercent from '@lucide/svelte/icons/percent';
import LucidePencil from '@lucide/svelte/icons/pencil';
import LucidePlus from '@lucide/svelte/icons/plus';
import LucideRefreshCw from '@lucide/svelte/icons/refresh-cw';
import LucideScissors from '@lucide/svelte/icons/scissors';
import LucideSearch from '@lucide/svelte/icons/search';
import LucideTrash2 from '@lucide/svelte/icons/trash-2';
import LucideUndo2 from '@lucide/svelte/icons/undo-2';
import LucideX from '@lucide/svelte/icons/x';
import LucideSun from '@lucide/svelte/icons/sun';
import LucideMoon from '@lucide/svelte/icons/moon';
import LucideMonitor from '@lucide/svelte/icons/monitor';

export const DEFAULT_ICONS: Record<string, IconComponent> = {
  alert: LucideCircleAlert,
  arrowUp: LucideArrowUp,
  arrowDown: LucideArrowDown,
  arrowLeft: LucideArrowLeft,
  arrowRight: LucideArrowRight,
  calendar: LucideCalendar,
  check: LucideCheck,
  chevronLeft: LucideChevronLeft,
  chevronRight: LucideChevronRight,
  chevronDown: LucideChevronDown,
  chevronFirst: LucideChevronFirst,
  chevronLast: LucideChevronLast,
  close: LucideX,
  cut: LucideScissors,
  code: LucideCode,
  codeBraces: LucideBraces,
  copy: LucideCopy,
  currency: LucideDollarSign,
  edit: LucidePencil,
  ellipsis: LucideEllipsis,
  ellipsisVertical: LucideEllipsisVertical,
  gripHorizontal: LucideGripHorizontal,
  home: LucideHouse,
  info: LucideInfo,
  menu: LucideMenu,
  minus: LucideMinus,
  paste: LucideClipboardPaste,
  percent: LucidePercent,
  plus: LucidePlus,
  refresh: LucideRefreshCw,
  reveal: LucideEye,
  search: LucideSearch,
  trash: LucideTrash2,
  undo: LucideUndo2,

  lightMode: LucideSun,
  darkMode: LucideMoon,
  monitor: LucideMonitor,
};

export interface DefaultProps {
  labelPlacement: LabelPlacement;
}

export type SettingsOptions = {
  /** Force a specific locale setting. */
  forceLocale?: string;
  /** Use this locale in case we don't have locale info for the user's current locale as returned
   * from Intl.  Defaults to `en` if not specified. */
  fallbackLocale?: string;
  /** Format information for additional locales that are not built-in. */
  localeFormats?: Record<string, LocaleSettingsInput>;

  /** Component settings including default props and classes */
  components?: ComponentSettings;

  /** A list of the available themes */
  themes?: {
    light?: string[];
    dark?: string[];
  };

  /** An existing theme, when calling `settings()` again from inside a component */
  currentTheme?: ThemeState;

  icons?: typeof DEFAULT_ICONS;
};

/**
 * Application-wide settings — locale/formatting, theme, icons, and per-component defaults.
 *
 * Replaces the store-based `Settings` object from Svelte UX: `locale`, `localeSettings`, `format`,
 * `currentTheme`, and `showDrawer` are reactive properties rather than stores, so read them
 * directly (`settings.format.number(...)`) instead of subscribing (`$format.number(...)`).
 */
export class SettingsState {
  #fallbackLocale: string | undefined;
  #locale = $state<string | null>(null);
  #localeSettings: () => LocaleSettings;
  #format: () => FormatFunctions;

  /** Component settings including default props and classes */
  components: ComponentSettings;
  /** A list of the available themes */
  themes: { light: string[]; dark: string[] };
  /** The currently selected theme */
  currentTheme: ThemeState;
  icons: typeof DEFAULT_ICONS;

  /** Whether the app drawer is open.  Defaults to open on `md` and wider viewports */
  showDrawer = $state(BROWSER ? window.innerWidth >= breakpoints.md : true);

  componentSettingsCache: Partial<Record<ComponentName, ResolvedComponentSettings<ComponentName>>> =
    {};

  constructor(options: SettingsOptions = {}) {
    const allLocales = getAllKnownLocales(options.localeFormats);
    this.#fallbackLocale = options.fallbackLocale;
    this.#locale = options.forceLocale ?? null;

    // Derived here rather than as class fields so they can read `allLocales` — class field
    // initializers run before the constructor body, which TypeScript (correctly) rejects.
    const localeSettings = $derived(
      allLocales[this.locale] ?? { ...allLocales.en, locale: this.locale }
    );
    const format = $derived(buildFormatters(localeSettings));
    this.#localeSettings = () => localeSettings;
    this.#format = () => format;

    this.components = options.components ?? {};

    const light = options.themes ? (options.themes.light ?? []) : ['light'];
    const dark = options.themes ? (options.themes.dark ?? []) : ['dark'];
    this.themes = { light, dark };

    // `settings()` is sometimes called again from inside a component — reuse the existing theme
    // rather than creating (and re-applying) a second one
    this.currentTheme = options.currentTheme ?? new ThemeState({ light, dark });

    this.icons = options.icons ?? DEFAULT_ICONS;
  }

  /** The currently selected locale */
  get locale(): string {
    return this.#locale ?? this.#fallbackLocale ?? 'en';
  }

  /** Select a locale, or `null` to fall back to `fallbackLocale` */
  setLocale(value: string | null) {
    this.#locale = value;
  }

  /** The settings for the currently selected locale */
  get localeSettings(): LocaleSettings {
    return this.#localeSettings();
  }

  /** Formatting functions and information for the currently selected locale */
  get format(): FormatFunctions {
    return this.#format();
  }
}

const settingsKey = Symbol();
const componentsKey = Symbol();

/**
 * Override the component settings (default props and classes) for a subtree, without disturbing
 * locale, theme, or icons.  `MenuItem` uses this to opt the `Button` it renders out of the app's
 * `Button` defaults.
 */
export function setComponentSettings(components: ComponentSettings) {
  setContext(componentsKey, components);
}

function getComponentSettingsOverride(): ComponentSettings | undefined {
  // in a try/catch to support use outside of a component
  try {
    return getContext<ComponentSettings | undefined>(componentsKey);
  } catch {
    return undefined;
  }
}

/** Create application settings and make them available to descendant components */
export function settings(options: SettingsOptions = {}): SettingsState {
  return setContext(settingsKey, new SettingsState(options));
}

let FALLBACK_SETTINGS: SettingsState | null = null;

function getFallbackSettings() {
  FALLBACK_SETTINGS = FALLBACK_SETTINGS ?? new SettingsState({ themes: { light: [], dark: [] } });
  return FALLBACK_SETTINGS;
}

export function getSettings(): SettingsState {
  // in a try/catch to be able to use components without calling `settings()` first, and to
  // support testing outside of a component
  try {
    return getContext<SettingsState>(settingsKey) ?? getFallbackSettings();
  } catch {
    return getFallbackSettings();
  }
}

export function resolveComponentSettings<NAME extends ComponentName>(
  settings: SettingsState | ComponentSettings,
  name: NAME
): ResolvedComponentSettings<NAME> {
  const components = settings instanceof SettingsState ? settings.components : settings;
  const { classes: themeClasses, ...defaultProps } = components?.[name] ?? {};

  return {
    defaults: (defaultProps ?? {}) as ResolvedDefaultProps<NAME>,
    classes: resolveComponentClasses<NAME>(themeClasses),
  };
}

/** The component settings in effect here — a subtree override if present, otherwise the app's */
export function getActiveComponentSettings(): ComponentSettings {
  return getComponentSettingsOverride() ?? getSettings().components;
}

/**
 * Returns default component props and classes for a given component.
 * @param name component name
 */
export function getComponentSettings<NAME extends ComponentName>(
  name: NAME
): ResolvedComponentSettings<NAME> {
  const override = getComponentSettingsOverride();
  if (override) {
    // Overrides are subtree-scoped, so they bypass the app-level cache
    return resolveComponentSettings(override, name);
  }

  const settings = getSettings();

  const existing = settings.componentSettingsCache[name];
  if (existing) {
    return existing as ResolvedComponentSettings<NAME>;
  }

  const output = resolveComponentSettings(settings, name);
  settings.componentSettingsCache[name] = output;
  return output;
}
