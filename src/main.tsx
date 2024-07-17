import 'reflect-metadata';
import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from 'inversify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { type IHttpService, HttpService, DiTokens } from '@/core';
import { CoreApiHttpService } from '@/common/api';
import { DiProvider } from '@/common/contexts';

// Features
import { AuthApi } from '@/auth';
import { ProfilesApi } from '@/profiles';

import { Application } from './app';

const rootContainer = new Container();

rootContainer.bind<IHttpService>(DiTokens.HttpService).to(HttpService);

rootContainer.bind(CoreApiHttpService).toSelf();
rootContainer.bind(ProfilesApi).toSelf();
rootContainer.bind(AuthApi).toSelf();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DiProvider container={rootContainer}>
      <QueryClientProvider client={queryClient}>
        <Application />
      </QueryClientProvider>
    </DiProvider>
  </React.StrictMode>,
);
