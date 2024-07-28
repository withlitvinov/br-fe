import 'reflect-metadata';
import './index.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container } from 'inversify';
import * as ReactDOM from 'react-dom/client';

import { AuthApi } from '@/auth';
import { CoreApiHttpService } from '@/common/api';
import { DiProvider } from '@/common/contexts';
import { DiTokens, HttpService, type IHttpService } from '@/core';
import { MyApi } from '@/my';
import { ProfilesApi } from '@/profiles';

import { Application } from './app';

const rootContainer = new Container();

// TODO: Bind to self
rootContainer.bind<IHttpService>(DiTokens.HttpService).to(HttpService);

rootContainer.bind(CoreApiHttpService).toSelf();
rootContainer.bind(ProfilesApi).toSelf();
rootContainer.bind(AuthApi).toSelf();
rootContainer.bind(MyApi).toSelf();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // 15 min
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
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
