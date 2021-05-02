import React from 'react';
import { AppBar, CircularProgress, createStyles, Divider, makeStyles, Toolbar, Typography } from '@material-ui/core';

import { useSettingsInitialized } from '../common/hooks/useSettingsInitialized';
import { SettingKey } from '../common/settings';

import { CheckboxSetting } from './components/CheckboxSetting';
import { NumberSetting } from './components/NumberSetting';

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
  divider: {
    width: '100%',
    marginTop: theme.spacing( 2 ),
    marginBottom: theme.spacing( 2 ),
  },
  numberInput: {
    marginTop: theme.spacing( 1 ),
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
      <div className={styles.content}>
        <Typography variant="h5">Notifications</Typography>
        <CheckboxSetting
          setting={SettingKey.Other.NotificationsEnabled}
          label="Notifications Enabled"
        />
        <CheckboxSetting
          setting={SettingKey.Other.NoActiveWindowNotifications}
          label="Do not show notifications for active tab"
        />
        <CheckboxSetting
          setting={SettingKey.Other.ShowAutoPausedNotification}
          label="Show notification when media is auto-paused"
        />

        <Divider className={styles.divider} />

        <Typography variant="h5">Idle</Typography>
        <CheckboxSetting
          setting={SettingKey.Other.PauseOnLock}
          label="Pause media when computer is locked"
        />
        <CheckboxSetting
          setting={SettingKey.Other.PauseOnInactivity}
          label="Pause media when computer goes inactive"
        />
        <div className={styles.numberInput}>
          <NumberSetting
            setting={SettingKey.Other.InactivityTimeout}
            label="Inactivity timeout (seconds)"
            minimum={15}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Easy Control Options</Typography>
        </Toolbar>
      </AppBar>
      {content}
    </div>
  );
};
