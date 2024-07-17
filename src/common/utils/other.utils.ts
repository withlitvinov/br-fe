export const interleave = <T = unknown[], I = unknown>(array: T[], item: I) =>
  ([] as (T | I)[]).concat(...array.map((n) => [n, item])).slice(0, -1);
