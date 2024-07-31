import 'reflect-metadata';
import './index.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Container } from 'inversify';
import * as ReactDOM from 'react-dom/client';

import { AuthApi } from '@/auth';
import { CoreApiHttpService } from '@/common/api';
import { DiProvider } from '@/common/contexts';
import { DiTokens, HttpService, type IHttpService } from '@/core';
import { MyApi } from '@/my';
import { ProfilesApi } from '@/profiles';
import { TzApi } from '@/tz';

import { Application } from './app';

const rootContainer = new Container();

// TODO: Bind to self
rootContainer.bind<IHttpService>(DiTokens.HttpService).to(HttpService);

rootContainer.bind(CoreApiHttpService).toSelf();
rootContainer.bind(ProfilesApi).toSelf();
rootContainer.bind(AuthApi).toSelf();
rootContainer.bind(MyApi).toSelf();
rootContainer.bind(TzApi).toSelf();

const MAX_RETRIES = 3;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // 15 min
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (failureCount > MAX_RETRIES) {
          return false;
        }

        if (
          isAxiosError(error) &&
          HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0)
        ) {
          import.meta.env.DEV &&
            console.log(
              `Aborting retry due to ${error.response?.status} status`,
            );
          return false;
        }

        return true;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <DiProvider container={rootContainer}>
    <QueryClientProvider client={queryClient}>
      <Application />
    </QueryClientProvider>
  </DiProvider>,
);
