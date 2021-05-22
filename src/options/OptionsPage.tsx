import React from 'react';
import { AppBar, Button, CircularProgress, createStyles, Divider, Grid, makeStyles, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import KeyboardShortcutsIcon from '@material-ui/icons/Keyboard';
import ChangelogIcon from '@material-ui/icons/ChangeHistory';
import BugIcon from '@material-ui/icons/BugReport';

import { CheckboxSetting } from './components/CheckboxSetting';
import { NumberSetting } from './components/NumberSetting';
import { StringArraySetting } from './components/StringArraySetting';

import { useSettingsInitialized } from '../common/hooks/useSettingsInitialized';
import settings, { SettingKey } from '../common/settings';
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
    marginTop: theme.spacing( 1 ),
  },
  headerCell: {
    padding: theme.spacing( 0, 2 ),
    whiteSpace: 'pre',
    textAlign: 'center',
  },
  input: {
    marginTop: theme.spacing( 2 ),
  },
  importExportActions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& > *': {
      marginTop: theme.spacing( 1 ),
      marginRight: theme.spacing( 1 ),
    },
  },
} ) );

export const OptionsPage: React.FC = () =>
{
  const styles = useStyles();

  const initialized = useSettingsInitialized();
  const [ settingsExportUrl, setSettingsExportUrl ] = React.useState( '' );

  const [ showImportResult, setShowImportResult ] = React.useState( false );
  const [ importResult, setImportResult ] = React.useState<string | Error | null>( null );

  React.useEffect( () =>
  {
    function onSettingsChange()
    {
      setSettingsExportUrl( settings.getExportUrl() );
    }

    onSettingsChange();
    settings.onChanged.addEventListener( onSettingsChange );

    return () =>
    {
      settings.onChanged.removeEventListener( onSettingsChange );
    };
  }, [] );

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

            <NumberSetting
              className={styles.input}
              setting={SettingKey.Other.MaximumGenericAudioVideoControllersPerPage}
              label="Maximum generic controllers per page"
              minimum={1}
              fullWidth={true}
            />

            <StringArraySetting
              className={styles.input}
              label="Generic Audio/Video Controller Site Blacklist"
              setting={SettingKey.Other.SiteBlacklist}
              rows={5}
            />

            <Divider className={styles.divider} />

          </Grid>

          <Grid className={styles.section} item={true} xs={12} md={6} lg={4}>

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
            <NumberSetting
              className={styles.input}
              setting={SettingKey.Controls.Other.HideControlsIdleTime}
              label="Mouse idle timeout"
              endAdornmentText="seconds"
              minimum={0}
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
            <NumberSetting
              className={styles.input}
              setting={SettingKey.Other.InactivityTimeout}
              label="Inactivity timeout"
              endAdornmentText="seconds"
              minimum={15}
            />

            <Divider className={styles.divider} />

            <Typography variant="h5">Other Options</Typography>
            <CheckboxSetting
              label="Show changelog on update"
              setting={SettingKey.Other.ShowChangeLogOnUpdate}
            />

            <Divider className={styles.divider} />

            <Typography variant="h5">Import/Export</Typography>

            <div className={styles.importExportActions}>

              <Button
                variant="outlined"
                color="secondary"
                download="easy_control.json"
                href={settingsExportUrl}
                target="_blank"
                rel="noopener noreferrer nofollower"
              >
                Export Settings
              </Button>

              <input
                style={{ display: 'none' }}
                accept="application/json"
                id="import-settings-input"
                type="file"
                onChange={async ( e ) =>
                {
                  setShowImportResult( false );

                  const file = e.currentTarget.files?.[ 0 ];
                  if( !file )
                  {
                    return;
                  }

                  e.currentTarget.value = '';

                  try
                  {
                    const content = await file.text();
                    const data: unknown = JSON.parse( content );
                    settings.importSettings( data );
                    setImportResult( 'Successfully imported settings!' );
                  }
                  catch( e )
                  {
                    console.warn( 'Failed to import settings:', e );
                    setImportResult( e );
                  }

                  setShowImportResult( true );
                }}
              />
              <label htmlFor="import-settings-input">
                <Button
                  variant="outlined"
                  color="secondary"
                  component="span"
                >
                  Import Settings
                </Button>
              </label>

            </div>

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
      <Snackbar
        open={showImportResult}
        onClose={( _e, reason ) =>
        {
          if( reason === 'clickaway' )
          {
            return;
          }

          setShowImportResult( false );
        }}
        autoHideDuration={importResult instanceof Error ? null : 6000}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
      >
        <Alert
          severity={importResult instanceof Error ? 'error' : 'success'}
          onClose={() => setShowImportResult( false )}
        >
          {importResult instanceof Error ? `Failed to import settings: ${importResult.message}` : importResult}
        </Alert>
      </Snackbar>
    </div>
  );
};
