import React from 'react';
import { colors, createMuiTheme, ThemeProvider } from '@material-ui/core';

import useIsDarkMode from '../hooks/useIsDarkMode';

interface Props
{
  allowDarkMode?: boolean;
  children: React.ReactNode;
}

export const EasyControlThemeProvider: React.FC<Props> = ( { allowDarkMode = false, children } ) =>
{
  const isDarkMode = useIsDarkMode();

  const darkMode = allowDarkMode && isDarkMode;

  const theme = React.useMemo( () =>
  {
    return createMuiTheme( {
      palette: {
        type: darkMode ? 'dark' : 'light',
        primary: colors.lightBlue,
        secondary: colors.amber,
      },
    } );
  }, [darkMode] );

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
