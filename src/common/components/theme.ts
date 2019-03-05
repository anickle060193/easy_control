import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme( {
  typography: {
    useNextVariants: true,
  },
} );

export const darkTheme = createMuiTheme( {
  palette: {
    type: 'dark',
  },
  typography: {
    useNextVariants: true,
  },
} );
