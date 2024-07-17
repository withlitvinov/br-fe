import { useContext } from 'react';

import { DiContext } from './di.provider.tsx';

function useDiContainer() {
  const ctx = useContext(DiContext);

  if (!ctx) {
    throw new Error('useDi must be used within the DiContext');
  }

  return ctx.container;
}

export default useDiContainer;
