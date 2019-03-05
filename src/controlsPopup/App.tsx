import React from 'react';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { darkTheme } from 'common/components/theme';

import ControlsPage from 'controlsPopup/components/ControlsPage';

export default class App extends React.PureComponent
{
  public render()
  {
    return (
      <MuiThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ControlsPage />
      </MuiThemeProvider>
    );
  }
}
