type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
    : S;

type CamelizeObject<T, S = false> = {
  [K in keyof T as Uncapitalize<CamelCase<string & K>>]: T[K] extends Date
    ? T[K]
    : T[K] extends RegExp
      ? T[K]
      : T[K] extends Array<infer U>
        ? U extends object | undefined
          ? Array<CamelizeObject<U>>
          : T[K]
        : T[K] extends object | undefined
          ? S extends true
            ? T[K]
            : CamelizeObject<T[K]>
          : T[K];
};

export type Camelize<T, S = false> =
  T extends Array<infer U> ? Array<CamelizeObject<U, S>> : CamelizeObject<T, S>;

function camelCase(str: string) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}

// @ts-expect-error used any for simplicity
function walk(obj, shallow = false): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (Array.isArray(obj))
    return obj.map((v) => {
      if (!shallow) {
        return walk(v);
      }
      if (typeof v === 'object') return walk(v, shallow);
      return v;
    });

  return Object.keys(obj).reduce((res, key) => {
    const camel = camelCase(key);
    const uncapitalized = camel.charAt(0).toLowerCase() + camel.slice(1);
    // @ts-expect-error key may exist
    res[uncapitalized] = shallow ? obj[key] : walk(obj[key]);
    return res;
  }, {});
}

export function camelize<T, S extends boolean = false>(
  /**
   * Value to be camelized
   */
  obj: T,

  /**
   * If true, only the top level keys of the obj will be camel cased
   */
  shallow?: S,
): T extends string ? string : Camelize<T, S> {
  return typeof obj === 'string' ? camelCase(obj) : walk(obj, shallow);
}
