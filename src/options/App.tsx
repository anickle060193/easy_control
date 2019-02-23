import React from 'react';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { theme } from 'common/components/theme';

import OptionsPage from 'options/components/OptionsPage';

export default class App extends React.PureComponent
{
  public render()
  {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <OptionsPage />
      </MuiThemeProvider>
    );
  }
}
