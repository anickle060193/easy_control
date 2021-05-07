import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import { EasyControlThemeProvider } from '../common/components/EasyControlThemeProvider';

import { ChangelogPage } from './ChangelogPage';

import './index.scss';

ReactDOM.render(
  (
    <EasyControlThemeProvider allowDarkMode={true}>
      <CssBaseline />
      <ChangelogPage />
    </EasyControlThemeProvider>
  ),
  document.getElementById( 'root' )
);
