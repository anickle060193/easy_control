import React from 'react';
import { AppBar, CircularProgress, createStyles, makeStyles, Toolbar, Typography } from '@material-ui/core';

import { useSettingsInitialized } from '../common/hooks/useSettingsInitialized';
import { SettingKey } from '../common/settings';

import { CheckboxSetting } from './components/CheckboxSetting';

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing( 2 ),
    overflowY: 'auto',
  },
  loading: {
    position: 'absolute',
    left: '50%',
    top: '30%',
    transform: 'translate( -50%, -50% )',
  },
} ) );

export const OptionsPage: React.FC = () =>
{
  const styles = useStyles();

  const initialized = useSettingsInitialized();

  let content: React.ReactNode;
  if( !initialized )
  {
    content = (
      <div className={styles.loading}>
        <CircularProgress variant="indeterminate" />
      </div>
    );
  }
  else
  {
    content = (
      <>
        <CheckboxSetting
          setting={SettingKey.Other.NotificationsEnabled}
          label="Notifications Enabled?"
        />
      </>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Easy Control Options</Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.content}>
        {content}
      </div>
    </div>
  );
};
