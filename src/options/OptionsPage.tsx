import React from 'react';
import { AppBar, Button, CircularProgress, createStyles, Divider, Grid, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import KeyboardShortcutsIcon from '@material-ui/icons/Keyboard';
import ChangelogIcon from '@material-ui/icons/ChangeHistory';
import BugIcon from '@material-ui/icons/BugReport';

import { CheckboxSetting } from './components/CheckboxSetting';
import { NumberSetting } from './components/NumberSetting';
import { StringArraySetting } from './components/StringArraySetting';

import { useSettingsInitialized } from '../common/hooks/useSettingsInitialized';
import { SettingKey } from '../common/settings';
import { CONTROLLERS } from '../common/controllers';

const useStyles = makeStyles( ( theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  appBarRight: {
    marginLeft: 'auto',

    '& > *': {
      marginLeft: theme.spacing( 1 ),
    },
  },
  loading: {
    position: 'absolute',
    left: '50%',
    top: '30%',
    transform: 'translate( -50%, -50% )',
  },
  content: {
    position: 'relative',
    padding: theme.spacing( 2 ),
    overflowY: 'auto',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing( -1 ),
    '& > *': {
      margin: theme.spacing( 1, 1, 0 ),
      whiteSpace: 'nowrap',
    },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  divider: {
    width: '100%',
    marginTop: theme.spacing( 2 ),
    marginBottom: theme.spacing( 2 ),
  },
  table: {
    margin: theme.spacing( 2, 0, 4 ),
  },
  headerCell: {
    padding: theme.spacing( 0, 2 ),
    whiteSpace: 'pre',
    textAlign: 'center',
  },
  numberInput: {
    marginTop: theme.spacing( 1 ),
  },
  stringsInput: {
    width: 'min( 500px, 100% )',
    marginBottom: theme.spacing( 1 ),
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

        <Grid container={true} spacing={4}>

          <Grid className={styles.section} item={true} xs={12} md={6} lg={4}>

            <Typography variant="h5">Controller Options</Typography>

            <Typography variant="body2">Changing these settings may require refreshing the tab that includes the media to fully apply.</Typography>

            <div>
              <Table
                className={styles.table}
                padding="none"
              >
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className={styles.headerCell}>Enabled?</TableCell>
                    <TableCell className={styles.headerCell}>Notifications?</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values( CONTROLLERS ).map( ( { id, name, enabledSetting, notificationsEnabledSetting } ) => (
                    <TableRow key={id}>
                      <TableCell>{name}</TableCell>
                      <TableCell padding="checkbox" align="center">
                        <CheckboxSetting setting={enabledSetting} />
                      </TableCell>
                      <TableCell padding="checkbox" align="center">
                        <CheckboxSetting setting={notificationsEnabledSetting} />
                      </TableCell>
                    </TableRow>
                  ) )}
                </TableBody>
              </Table>
            </div>

            <div className={styles.stringsInput}>
              <StringArraySetting
                label="Generic Audio/Video Controller Site Blacklist"
                setting={SettingKey.Other.SiteBlacklist}
                rows={5}
              />
            </div>

          </Grid>

          <Grid className={styles.section} item={true} xs={12} md={6} lg={4}>

            <Divider className={styles.divider} />

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

            <Typography variant="h5">Controls Overlay Options</Typography>
            <CheckboxSetting
              setting={SettingKey.Controls.Other.DisplayControls}
              label="Display content controls overlay"
            />
            <CheckboxSetting
              setting={SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed}
              label="Always display playback speed overlay"
            />
            <CheckboxSetting
              setting={SettingKey.Controls.Other.HideControlsWhenIdle}
              label="Hide controls when mouse goes idle"
            />
            <div className={styles.numberInput}>
              <NumberSetting
                setting={SettingKey.Controls.Other.HideControlsIdleTime}
                label="Mouse idle timeout"
                endAdornmentText="seconds"
                minimum={0}
              />
            </div>

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
                label="Inactivity timeout"
                endAdornmentText="seconds"
                minimum={15}
              />
            </div>

            <Divider className={styles.divider} />

            <Typography variant="h5">Other Options</Typography>
            <CheckboxSetting
              label="Show changelog on update"
              setting={SettingKey.Other.ShowChangeLogOnUpdate}
            />

          </Grid>

        </Grid>

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
        </Toolbar>
      </AppBar>
      <div className={styles.content}>
        <div className={styles.actions}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={( e ) =>
            {
              e.preventDefault();

              chrome.tabs.create( { url: 'chrome://extensions/shortcuts' } );
            }}
            startIcon={<KeyboardShortcutsIcon />}
          >
            Set Keyboard Shortcuts
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            href={chrome.runtime.getURL( 'changelog.html' )}
            target="_blank"
            rel="noopener noreferrer nofollower"
            startIcon={<ChangelogIcon />}
          >
            Open Changelog
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            href="https://github.com/anickle060193/easy_control/issues"
            target="_blank"
            rel="noopener noreferrer nofollower"
            startIcon={<BugIcon />}
          >
            Suggest Feature/Report Issue
          </Button>
        </div>
        {content}
      </div>
    </div>
  );
};
