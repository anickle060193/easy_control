import React from 'react';
import { colors, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';

function getHtmlFontSize()
{
  const styles = window.getComputedStyle( document.documentElement );
  const match = /^(\d+)px$/i.exec( styles.fontSize );
  if( match )
  {
    const fontSize = parseFloat( match[ 1 ] );
    if( isFinite( fontSize ) )
    {
      return fontSize;
    }
  }

  return 16;
}

interface Props
{
  allowDarkMode?: boolean;
  forceDarkMode?: boolean;
  children: React.ReactNode;
}

export const EasyControlThemeProvider: React.FC<Props> = ( { allowDarkMode = false, forceDarkMode = false, children } ) =>
{
  const isDarkMode = useMediaQuery( '(prefers-color-scheme: dark)', { matchMedia: window.matchMedia.bind( window ) } );

  const darkMode = forceDarkMode || ( allowDarkMode && isDarkMode );

  const theme = React.useMemo( () =>
  {
    return createTheme( {
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: colors.lightBlue,
        secondary: colors.amber,
      },
      typography: {
        htmlFontSize: getHtmlFontSize(),
      },
    } );
  }, [ darkMode ] );

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
