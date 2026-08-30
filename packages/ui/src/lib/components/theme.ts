import type { Component, ComponentProps } from 'svelte';
import type { TransitionConfig } from 'svelte/transition';

import type * as Components from './index.js';
import { getActiveComponentSettings, getSettings } from './settingsState.svelte.js';
import type {
  ButtonColor,
  ButtonRounded,
  ButtonSize,
  ButtonVariant,
  LabelPlacement,
  TransitionParams,
} from '../types/index.js';

export type ComponentName = keyof typeof Components;

/**
 * The shape of a component's `classes` prop, or `{ root?: string }` for components that only take
 * a `class`.  Svelte 5 components are functions rather than classes, so this infers from
 * `Component<Props>` rather than a `prototype`.
 */
type ClassesProp<T> =
  T extends Component<any, any, any>
    ? ComponentProps<T> extends { classes?: infer C }
      ? C
      : ComponentProps<T> extends { class?: string }
        ? { root?: string }
        : never
    : never;

interface ComponentDefaultProps {
  Button?: {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    rounded?: ButtonRounded;
  };
  ButtonGroup?: {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    rounded?: ButtonRounded;
  };
  CopyButton?: {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    rounded?: ButtonRounded;
  };
  DateButton?: {
    variant?: ButtonVariant;
  };
  DateField?: {
    labelPlacement?: LabelPlacement;
  };
  DatePickerField?: {
    labelPlacement?: LabelPlacement;
  };
  DateRangeField?: {
    labelPlacement?: LabelPlacement;
  };
  Field?: {
    labelPlacement?: LabelPlacement;
  };
  MenuButton?: {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    rounded?: ButtonRounded;
  };
  Menu?: {
    transition?: (node: HTMLElement, params: TransitionParams) => TransitionConfig;
    transitionParams?: TransitionParams;
  };
  MenuField?: {
    labelPlacement?: LabelPlacement;
  };
  MultiSelectField?: {
    labelPlacement?: LabelPlacement;
  };
  RangeField?: {
    labelPlacement?: LabelPlacement;
  };
  SelectField?: {
    labelPlacement?: LabelPlacement;
  };
  TextField?: {
    labelPlacement?: LabelPlacement;
  };
  ToggleButton?: {
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    rounded?: ButtonRounded;
  };
}

export type ResolvedComponentClasses = {
  [key in ComponentName]: ResolvedComponentClassesProp<key>;
};

export type ResolvedComponentClassesProp<NAME extends ComponentName> =
  ClassesProp<(typeof Components)[NAME]> extends never
    ? {}
    : NonNullable<ClassesProp<(typeof Components)[NAME]>>;

export type ResolvedDefaultProps<NAME extends ComponentName> =
  NAME extends keyof ComponentDefaultProps ? NonNullable<ComponentDefaultProps[NAME]> : {};

export interface ResolvedComponentSettings<NAME extends ComponentName> {
  defaults: ResolvedDefaultProps<NAME>;
  classes: ResolvedComponentClassesProp<NAME>;
}

export type ComponentSettings = {
  [key in ComponentName]?: {
    classes?: ClassesProp<(typeof Components)[key]> | string;
  } & (key extends keyof ComponentDefaultProps ? ComponentDefaultProps[key] : {});
};

export function getComponents(): ComponentSettings {
  return getSettings().components ?? {};
}

export function resolveComponentClasses<NAME extends ComponentName>(
  theme: ClassesProp<(typeof Components)[NAME]> | string | undefined
): ResolvedComponentClassesProp<NAME> {
  return (
    typeof theme === 'string' ? { root: theme } : (theme ?? {})
  ) as ResolvedComponentClassesProp<NAME>;
}

/**
 * Returns default component classes for a given component.  See {@link getComponentSettings}
 * to get both default props and classes.
 * @param name component name
 */
export function getComponentClasses<NAME extends ComponentName>(
  name: NAME
): ResolvedComponentClasses[NAME] {
  return resolveComponentClasses(getActiveComponentSettings()?.[name]?.classes);
}
