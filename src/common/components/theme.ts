import { createMuiTheme, colors } from '@material-ui/core';

export const theme = createMuiTheme( {
  palette: {
    primary: colors.blue,
    secondary: colors.amber,
  },
  typography: {
    useNextVariants: true,
  },
} );

export const darkTheme = createMuiTheme( {
  palette: {
    type: 'dark',
    primary: colors.blue,
    secondary: colors.amber,
  },
  typography: {
    useNextVariants: true,
  },
} );
