import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@mui/material';

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
