import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface Props
{
  version: string;
  children: React.ReactNode;
}

export const ChangelogVersion: React.FC<Props> = ( { version, children } ) =>
{
  return (
    <Paper
      sx={{
        padding: [ 1, 2, 2 ],

        '&:not( :last-child )': {
          marginBottom: 2,
        },
      }}
    >
      <Typography variant="h6">Version {version}</Typography>
      <Box
        component="ul"
        sx={{
          marginTop: 0,
          marginBottom: 0,
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};
