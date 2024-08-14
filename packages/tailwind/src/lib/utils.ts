import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { range } from 'd3-array';
import { mergeWith } from 'lodash-es';

/**
 * Wrapper around `tailwind-merge` and `clsx`
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [
        'shadow-border-l',
        'shadow-border-r',
        'shadow-border-t',
        'shadow-border-b',
        'elevation-none',
        ...range(1, 25).map((x) => `elevation-${x}`),
      ],
    },
  },
});

type ClassFalsyValues = undefined | null | false;
type AnyClassValue = ClassValue | ClassFalsyValues;
type AnyClassCollection = Record<string | number | symbol, AnyClassValue> | ClassFalsyValues;

export const cls = (...inputs: AnyClassValue[]) => twMerge(clsx(...inputs));

export const clsMerge = <T extends AnyClassCollection>(
  ...inputs: T[]
): Exclude<T, false | undefined> =>
  mergeWith({}, ...inputs.filter(Boolean), (a: string, b: string) => twMerge(a, b));

export const normalizeClasses = <T extends object>(classes: string | ClassFalsyValues | T): T => {
  return classes && typeof classes === 'object' ? classes : ({ root: classes } as T);
};
