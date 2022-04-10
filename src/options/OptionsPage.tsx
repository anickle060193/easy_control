import React from 'react';
import { Alert, AppBar, Box, Button, CircularProgress, Divider, Grid, Snackbar, styled, SxProps, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import { BugReport, ChangeHistory, Keyboard } from '@mui/icons-material';

import { CheckboxSetting } from './components/CheckboxSetting';
import { NumberSetting } from './components/NumberSetting';
import { StringArraySetting } from './components/StringArraySetting';

import { useSettingsInitialized } from '../common/hooks/useSettingsInitialized';
import settings, { ControlsOverlayControlVisibleSettingId, SettingKey } from '../common/settings';
import { CONTROLLERS } from '../common/controllers';

const FullWidthDivider = styled( Divider )( {
  width: '100%',
  marginTop: 2,
  marginBottom: 2,
} );

const HeaderCell = styled( TableCell )( {
  padding: [ 0, 2 ],
  whiteSpace: 'pre',
  textAlign: 'center',
} );

const INPUT_SX: SxProps = {
  marginTop: 2,
};

interface ControlsOverlaySettings
{
  visible: ControlsOverlayControlVisibleSettingId;
  description: string;
  allowHiding: boolean;
}

const CONTROLS_OVERLAY_SETTINGS: ControlsOverlaySettings[] = [
  { visible: SettingKey.ControlsOverlay.Visible.Reset, description: 'Playback Speed Reset', allowHiding: false },
  { visible: SettingKey.ControlsOverlay.Visible.MuchSlower, description: 'Playback Speed Much Slower', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.Slower, description: 'Playback Speed Slower', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.SkipBackward, description: 'Skip Backward', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.PlayPause, description: 'Play/Pause', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.SkipForward, description: 'Skip Forward', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.Faster, description: 'Playback Speed Faster', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.MuchFaster, description: 'Playback Speed Much Faster', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.Loop, description: 'Loop', allowHiding: true },
  { visible: SettingKey.ControlsOverlay.Visible.Fullscreen, description: 'Fullscreen', allowHiding: true },
];

export const OptionsPage: React.FC = () =>
{
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
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '30%',
          transform: 'translate( -50%, -50% )',
        }}
      >
        <CircularProgress variant="indeterminate" />
      </Box>
    );
  }
  else
  {
    content = (
      <Box
        sx={{
          position: 'relative',
          padding: 2,
          overflowY: 'auto',
        }}
      >
        <Grid container={true}>

          <Grid item={true} xs={false} md={3} />

          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            item={true}
            xs={12}
            md={6}
          >

            <Typography variant="h5">Controller Options</Typography>

            <Typography variant="body2">Changing these settings may require refreshing the tab that includes the media to fully apply.</Typography>

            <div>
              <Table
                sx={{
                  marginTop: 1,
                }}
                padding="none"
              >
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <HeaderCell>Enabled?</HeaderCell>
                    <HeaderCell>Notifications?</HeaderCell>
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
              sx={INPUT_SX}
              setting={SettingKey.Other.MaximumGenericAudioVideoControllersPerPage}
              label="Maximum generic controllers per page"
              minimum={1}
              fullWidth={true}
            />

            <StringArraySetting
              sx={INPUT_SX}
              label="Generic Audio/Video Controller Site Blacklist"
              setting={SettingKey.Other.SiteBlacklist}
              rows={5}
            />

            <FullWidthDivider />

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

            <FullWidthDivider />

            <Typography variant="h5">Controls Overlay Options</Typography>
            <CheckboxSetting
              setting={SettingKey.ControlsOverlay.Other.DisplayControls}
              label="Display content controls overlay"
            />
            <CheckboxSetting
              setting={SettingKey.ControlsOverlay.Other.AlwaysDisplayPlaybackSpeed}
              label="Always display playback speed overlay"
            />
            <CheckboxSetting
              setting={SettingKey.ControlsOverlay.Other.HideControlsWhenIdle}
              label="Hide controls when mouse goes idle"
            />
            <NumberSetting
              sx={INPUT_SX}
              setting={SettingKey.ControlsOverlay.Other.HideControlsIdleTime}
              label="Mouse idle timeout"
              endAdornmentText="seconds"
              minimum={0}
            />

            <Table
              sx={{
                marginTop: 1,
              }}
              padding="none"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Control</TableCell>
                  <TableCell align="center">Display in Overlay?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CONTROLS_OVERLAY_SETTINGS.map( ( { visible, description, allowHiding }, i ) => (
                  <TableRow key={i} hover={true}>
                    <TableCell>{description}</TableCell>
                    <TableCell align="center">
                      {allowHiding && (
                        <CheckboxSetting setting={visible} />
                      )}
                    </TableCell>
                  </TableRow>
                ) )}
              </TableBody>
            </Table>

            <FullWidthDivider />

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
              sx={INPUT_SX}
              setting={SettingKey.Other.InactivityTimeout}
              label="Inactivity timeout"
              endAdornmentText="seconds"
              minimum={15}
            />

            <FullWidthDivider />

            <Typography variant="h5">Other Options</Typography>
            <CheckboxSetting
              label="Show changelog on update"
              setting={SettingKey.Other.ShowChangeLogOnUpdate}
            />

            <FullWidthDivider />

            <Typography variant="h5">Import/Export</Typography>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                '& > *': {
                  marginTop: 1,
                  marginRight: 1,
                },
              }}
            >

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
                    await settings.importSettings( data );
                    setImportResult( 'Successfully imported settings!' );
                  }
                  catch( e )
                  {
                    console.warn( 'Failed to import settings:', e );
                    setImportResult( e as Error );
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

            </Box>

          </Grid>

        </Grid>

      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Easy Control Options
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          position: 'relative',
          padding: 2,
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: -1,
            '& > *': {
              margin: [ 1, 1, 0 ],
              whiteSpace: 'nowrap',
            },
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={async ( e ) =>
            {
              e.preventDefault();

              await browser.tabs.create( { url: 'chrome://extensions/shortcuts' } );
            }}
            startIcon={<Keyboard />}
          >
            Set Keyboard Shortcuts
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            href={browser.runtime.getURL( 'changelog.html' )}
            target="_blank"
            rel="noopener noreferrer nofollower"
            startIcon={<ChangeHistory />}
          >
            Open Changelog
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            href="https://github.com/anickle060193/easy_control/issues"
            target="_blank"
            rel="noopener noreferrer nofollower"
            startIcon={<BugReport />}
          >
            Suggest Feature/Report Issue
          </Button>
        </Box>
        {content}
      </Box>
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
    </Box>
  );
};
