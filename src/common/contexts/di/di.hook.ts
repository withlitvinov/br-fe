import { interfaces } from 'inversify';
import { useMemo } from 'react';

import useDiContainer from './di-container.hook';

function useDi<T>(service: interfaces.ServiceIdentifier<T>) {
  const di = useDiContainer();

  return useMemo(() => di.get(service), [di, service]);
}

export default useDi;
