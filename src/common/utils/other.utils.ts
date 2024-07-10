export const interleave = <T = any[], I = any>(array: T[], item: I) =>
  ([] as (T | I)[]).concat(...array.map((n) => [n, item])).slice(0, -1);
