const DiTokenNames = [
  /* Core */
  'HttpService',
  // <- Add new symbol names here
] as const;

type DiTokens = {
  [k in (typeof DiTokenNames)[number]]: symbol;
};

const DiTokens = DiTokenNames.reduce((acc, k) => {
  acc[k] = Symbol.for(k);
  return acc;
}, {} as DiTokens);

export { DiTokens };
