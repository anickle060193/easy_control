import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';

import 'typeface-roboto';

import { EasyControlThemeProvider } from '../common/components/EasyControlThemeProvider';

import { ChangelogPage } from './ChangelogPage';

import './index.scss';

const root = ReactDOM.createRoot( document.getElementById( 'root' ) as HTMLElement );

root.render(
  <React.StrictMode>
    <EasyControlThemeProvider allowDarkMode={true}>
      <CssBaseline />
      <ChangelogPage />
    </EasyControlThemeProvider>
  </React.StrictMode>
);
