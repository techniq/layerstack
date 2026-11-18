import type { Component } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import type {
  FlyParams,
  SlideParams,
  BlurParams,
  FadeParams,
  ScaleParams,
} from 'svelte/transition';
import type { ThemeColors } from '@layerstack/tailwind';

import LucideChevronDown from '@lucide/svelte/icons/chevron-down';

// Unable to get `IconProps` from `@lucide/svelte`
type LucideComponent = typeof LucideChevronDown;

/**
 * Structural match for Font Awesome's `IconDefinition`, declared here so `@layerstack/ui` does not
 * take a dependency on `@fortawesome/fontawesome-common-types`.  Real `IconDefinition` values are
 * assignable to this, since `IconPrefix`/`IconName` are string literal unions.
 */
export type FontAwesomeIconDefinition = {
  prefix: string;
  iconName: string;
  /** `[width, height, ligatures, unicode, svgPathData]` */
  icon: [number, number, string[], string, string | string[]];
};

export type IconComponent = Component<SvelteHTMLElements['svg']> | LucideComponent;

/**
 * Everything `Icon` accepts as its `data` prop — an icon component, a Font Awesome definition, or
 * a string holding an SVG path, an inline `<svg>`, or a URL to fetch one from.
 */
export type IconData = IconComponent | FontAwesomeIconDefinition | string | null | undefined;

export type IconProp = IconComponent | IconData;

export type MenuOption<T = any> = {
  label: string;
  value: T;
  icon?: IconProp;
  group?: string;
  disabled?: boolean;
} & Record<string, any>;

export type LabelPlacement = 'inset' | 'float' | 'top' | 'left';
export const DEFAULT_LABEL_PLACEMENT: LabelPlacement = 'inset';

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'fill'
  | 'fill-outline'
  | 'fill-light'
  | 'text'
  | 'none';

export type ButtonColor = ThemeColors | 'default';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRounded = boolean | 'full';

export type TransitionParams = BlurParams | FadeParams | FlyParams | SlideParams | ScaleParams;
