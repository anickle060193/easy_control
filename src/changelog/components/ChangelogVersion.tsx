import React from 'react';
import { createStyles, makeStyles, Paper, Typography } from '@material-ui/core';

interface Props
{
  version: string;
}

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    padding: theme.spacing( 1, 2, 2 ),

    '&:not( :last-child )': {
      marginBottom: theme.spacing( 2 ),
    },
  },
  list: {
    marginTop: 0,
    marginBottom: 0,
  },
} ) );

export const ChangelogVersion: React.FC<Props> = ( { version, children } ) =>
{
  const styles = useStyles();

  return (
    <Paper className={styles.root}>
      <Typography variant="h6">Version {version}</Typography>
      <ul className={styles.list}>
        {children}
      </ul>
    </Paper>
  );
};
