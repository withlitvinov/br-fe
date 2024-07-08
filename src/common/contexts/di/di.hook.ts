import { interfaces } from 'inversify';

import useDiContainer from './di-container.hook';

function useDi<T>(service: interfaces.ServiceIdentifier<T>) {
  const di = useDiContainer();

  return di.get(service);
}

export default useDi;
