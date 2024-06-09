import 'reflect-metadata';
import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from 'inversify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { type IHttpService, HttpService } from '@/core/http';
import { DiSymbols } from '@/core/di';
import {
  type ICoreBeHttpService,
  type IPersonProfilesApi,
  CoreBeHttpService,
  PersonProfilesApi,
} from '@/api';

import { DiProvider } from '@/global-contexts';

import { Application } from './app';

const rootContainer = new Container();

rootContainer.bind<IHttpService>(DiSymbols.HttpService).to(HttpService);
rootContainer
  .bind<ICoreBeHttpService>(DiSymbols.CoreBeHttpService)
  .to(CoreBeHttpService);
rootContainer
  .bind<IPersonProfilesApi>(DiSymbols.PersonProfilesApi)
  .to(PersonProfilesApi);

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
