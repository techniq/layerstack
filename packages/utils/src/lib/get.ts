/**
 * See: https://github.com/angus-c/just/blob/d8c5dd18941062d8db7e9310ecc8f53fd607df54/packages/object-safe-get/index.mjs#L33C1-L61C2
 */
export function get<T = any>(
  obj: any,
  propsArg: string | symbol | (string | number | symbol)[],
  defaultValue?: T
): T {
  if (!obj) {
    return defaultValue as T;
  }

  let props: (string | number | symbol)[];

  if (Array.isArray(propsArg)) {
    props = propsArg.slice(0);
  } else if (typeof propsArg === 'string') {
    props = propsArg.split('.');
  } else if (typeof propsArg === 'symbol') {
    props = [propsArg];
  } else {
    throw new Error('props arg must be an array, a string or a symbol');
  }

  let result: any = obj;

  while (props.length) {
    const prop = props.shift()!;
    if (!result) {
      return defaultValue as T;
    }
    result = result[prop];
    if (result === undefined) {
      return defaultValue as T;
    }
  }

  return result;
}
