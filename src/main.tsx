import 'reflect-metadata';
import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from 'inversify';

import { DiProvider } from '@/global-contexts/di';

import App from './App.tsx';

const rootContainer = new Container();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DiProvider container={rootContainer}>
      <App />
    </DiProvider>
  </React.StrictMode>,
);
