import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { AUTHORIZED_MY_DETAILS_KEY } from '@/app/constants';
import { dateUtils } from '@/common';
import { useDi } from '@/common/contexts';
import { MyApi } from '@/my';

const useConfigureGlobalTz = () => {
  const myApi = useDi(MyApi);

  const { data: my } = useQuery({
    queryKey: [AUTHORIZED_MY_DETAILS_KEY],
    queryFn: () => {
      return myApi.getMy();
    },
  });

  useEffect(() => {
    if (my) {
      dateUtils.setGlobalTz(my.config.timeZone);
    }
  }, [my]);
};

export { useConfigureGlobalTz };
