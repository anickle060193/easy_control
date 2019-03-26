import React from 'react';
import ReactDOM from 'react-dom';
import { Snackbar, MuiThemeProvider, Theme, createStyles, withStyles, WithStyles, Typography } from '@material-ui/core';
import { SnackbarProps } from '@material-ui/core/Snackbar';

import { theme as projectTheme } from 'common/components/theme';

interface MessageInfo
{
  key: number;
  message: string;
}

const root = document.createElement( 'div' );

let messageQueue: MessageInfo[] = [];
let snackbarOpen = false;
let currentMessage: MessageInfo | undefined = undefined;

const styles = ( theme: Theme ) => createStyles( {
  message: {
    fontSize: '14px',
  },
} );

interface Props extends WithStyles<typeof styles>
{
  open: boolean;
  message: string | undefined;
  onClose: SnackbarProps[ 'onClose' ];
  onExit: SnackbarProps[ 'onExit' ];
}

function UnstyledSnackbarAlert( { classes, open, message, onClose, onExit }: Props )
{
  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
      disableWindowBlurListener={true}
      onClose={onClose}
      onExit={onExit}
      message={(
        <Typography variant="inherit" className={classes.message}>
          {message}
        </Typography>
      )}
    />
  );
}

const SnackbarAlert = withStyles( styles )( UnstyledSnackbarAlert );

function processMessageQueue()
{
  if( messageQueue.length > 0 )
  {
    currentMessage = messageQueue.shift();
    snackbarOpen = true;
  }
  renderSnackbar();
}

function onSnackbarClose( event: React.SyntheticEvent<{}>, reason: string )
{
  if( reason === 'clickaway' )
  {
    return;
  }

  snackbarOpen = false;
  renderSnackbar();
}

function onSnackbarExit()
{
  processMessageQueue();
}

function renderSnackbar()
{
  if( root.parentElement !== document.body )
  {
    document.body.append( root );
  }

  ReactDOM.render(
    (
      <MuiThemeProvider theme={projectTheme}>
        <SnackbarAlert
          key={currentMessage && currentMessage.key}
          open={snackbarOpen}
          message={currentMessage && currentMessage.message}
          onClose={onSnackbarClose}
          onExit={onSnackbarExit}
        />
      </MuiThemeProvider>
    ),
    root
  );
}

export default function showSnackbar( message: string )
{
  messageQueue.push( {
    key: new Date().getTime(),
    message: message,
  } );

  if( snackbarOpen )
  {
    snackbarOpen = false;
    renderSnackbar();
  }
  else
  {
    processMessageQueue();
  }
}
