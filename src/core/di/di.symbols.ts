const DiSymbolNames = [
  /* Core */
  'HttpService',
  /* Api */
  'CoreBeHttpService',
  'PersonProfilesApi',
  // <- Add new symbol names here
] as const;

type DiSymbols = {
  [k in (typeof DiSymbolNames)[number]]: symbol;
};

const DiSymbols = DiSymbolNames.reduce((acc, k) => {
  acc[k] = Symbol.for(k);
  return acc;
}, {} as DiSymbols);

export { DiSymbols };
