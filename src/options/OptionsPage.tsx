import React from 'react';
import { AppBar, Button, CircularProgress, createStyles, Divider, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';

import { CheckboxSetting } from './components/CheckboxSetting';
import { NumberSetting } from './components/NumberSetting';

import { useSettingsInitialized } from '../common/hooks/useSettingsInitialized';
import { SettingKey } from '../common/settings';
import { ControllerDetails, ControllerId, CONTROLLERS } from '../common/controllers';

function mapControllerSettings<T>( mapper: ( id: ControllerId, details: ControllerDetails ) => T ): T[]
{
  return Object.entries( CONTROLLERS ).map( ( [ id, details ] ) => mapper( id as ControllerId, details ) );
}

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  appBarRight: {
    marginLeft: 'auto',
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
  table: {
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
        <Typography variant="h5">Controller Options</Typography>
        <TableContainer className={styles.table}>
          <Table padding="none">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Enabled?</TableCell>
                <TableCell>Notifications Enabled?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mapControllerSettings( ( id, { name, enabledSetting, notificationsEnabledSetting } ) => (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <CheckboxSetting setting={enabledSetting} />
                  </TableCell>
                  <TableCell>
                    <CheckboxSetting setting={notificationsEnabledSetting} />
                  </TableCell>
                </TableRow>
              ) )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5">Notification Options</Typography>
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

        <Typography variant="h5">Idle Options</Typography>
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

        <Divider className={styles.divider} />

        <Typography variant="h5">Other Options</Typography>
        <CheckboxSetting
          label="Show changelog on update"
          setting={SettingKey.Other.ShowChangeLogOnUpdate}
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Easy Control Options
          </Typography>
          <div className={styles.appBarRight}>
            <Button
              variant="outlined"
              color="secondary"
              href={chrome.runtime.getURL( 'changelog.html' )}
              target="_blank"
              rel="noopener noreferrer nofollower"
            >
              Open Changelog
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      {content}
    </div>
  );
};
