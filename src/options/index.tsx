import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@mui/material';

import 'typeface-roboto';

import { EasyControlThemeProvider } from '../common/components/EasyControlThemeProvider';

import { OptionsPage } from './OptionsPage';

import './index.scss';

ReactDOM.render(
  (
    <EasyControlThemeProvider allowDarkMode={true}>
      <CssBaseline />
      <OptionsPage />
    </EasyControlThemeProvider>
  ),
  document.getElementById( 'root' )
);
