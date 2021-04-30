import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export const OptionsPage: React.FC = () =>
{
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Easy Control Options</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};
