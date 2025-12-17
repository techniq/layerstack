function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

function isPlainObject(value: any): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

type Customizer = (objValue: any, srcValue: any, key: string) => any;

function mergeOne<T extends object>(target: T, source: object, customizer?: Customizer): T {
  if (!isObject(target) || !isObject(source)) return target;

  for (const key in source) {
    const srcVal = (source as any)[key];
    const tgtVal = (target as any)[key];

    if (customizer) {
      const custom = customizer(tgtVal, srcVal, key);
      if (custom !== undefined) {
        (target as any)[key] = custom;
        continue;
      }
    }

    if (Array.isArray(srcVal)) {
      if (!Array.isArray(tgtVal)) (target as any)[key] = [];
      srcVal.forEach((item, i) => {
        if (isPlainObject(item) && isPlainObject((target as any)[key][i])) {
          (target as any)[key][i] = mergeOne((target as any)[key][i], item, customizer);
        } else {
          (target as any)[key][i] = item;
        }
      });
    } else if (isPlainObject(srcVal)) {
      if (!isPlainObject(tgtVal)) (target as any)[key] = {};
      mergeOne((target as any)[key], srcVal, customizer);
    } else {
      (target as any)[key] = srcVal;
    }
  }

  return target;
}

export function mergeWith(target: any, ...args: any[]): any {
  const last = args[args.length - 1];
  const hasCustomizer = typeof last === 'function';
  const customizer = hasCustomizer ? (last as Customizer) : undefined;
  const sources = hasCustomizer ? args.slice(0, -1) : args;

  for (const source of sources) {
    if (source) mergeOne(target, source, customizer);
  }
  return target;
}

export function merge(target: any, ...sources: any[]): any {
  for (const source of sources) {
    if (source) mergeOne(target, source);
  }
  return target;
}

export function defaultsDeep<T>(target: object, ...sources: object[]): T {
  return mergeWith(target, ...sources, (objValue: any, srcValue: any) => {
    if (objValue !== undefined) {
      if (isPlainObject(objValue) && isPlainObject(srcValue)) {
        return undefined;
      }
      return objValue;
    }
    return undefined;
  });
}
