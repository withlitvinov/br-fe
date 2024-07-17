import { interfaces } from 'inversify';
import { PropsWithChildren, createContext, useMemo } from 'react';

interface DiContextState {
  container: interfaces.Container;
}

export const DiContext = createContext<DiContextState>({} as DiContextState);

type DiProviderProps = PropsWithChildren<{
  container: interfaces.Container;
}>;

function DiProvider(props: DiProviderProps) {
  const value = useMemo(
    () => ({
      container: props.container,
    }),
    [props],
  );

  return (
    <DiContext.Provider value={value}>{props.children}</DiContext.Provider>
  );
}

export default DiProvider;
