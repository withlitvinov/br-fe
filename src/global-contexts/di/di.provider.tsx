import { createContext, PropsWithChildren, useRef } from 'react';
import { interfaces } from 'inversify';

interface DiContextState {
  container: interfaces.Container;
}

export const DiContext = createContext<DiContextState>({} as DiContextState);

type DiProviderProps = PropsWithChildren<{
  container: interfaces.Container;
}>;

function DiProvider(props: DiProviderProps) {
  const ref = useRef(props.container);

  return (
    <DiContext.Provider value={{ container: ref.current }}>
      {props.children}
    </DiContext.Provider>
  );
}

export default DiProvider;
