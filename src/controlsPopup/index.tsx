import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';

import { EasyControlThemeProvider } from '../common/components/EasyControlThemeProvider';

import { ControlsPopup } from './ControlsPopup';

import './index.scss';

ReactDOM.render(
  (
    <EasyControlThemeProvider allowDarkMode={true}>
      <CssBaseline />
      <ControlsPopup />
    </EasyControlThemeProvider>
  ),
  document.getElementById( 'root' )
);
