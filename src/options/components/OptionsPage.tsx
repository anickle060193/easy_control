import React from 'react';
import classNames from 'classnames';
import { Theme, createStyles, withStyles, WithStyles, Button, AppBar, Toolbar, Typography, Paper } from '@material-ui/core';

import CheckboxSetting from 'options/components/CheckboxSetting';
import NumberSetting from 'options/components/NumberSetting';
import SelectSetting from 'options/components/SelectSetting';
import TextSetting from 'options/components/TextSetting';
import GenericMediaControlsSettings from 'options/components/GenericMediaControlsSettings';
import ControllerSettings from 'options/components/ControllerSettings';

import { SettingKey, Sites, settings } from 'common/settings';

const styles = ( theme: Theme ) => createStyles( {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.unit * 4,
  },
  appbarSpacer: {
    ...theme.mixins.toolbar
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 4,
    width: 'auto',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    '&:not( :last-child )': {
      marginBottom: theme.spacing.unit * 3,
    },
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing.unit,
    '&:not( :last-child )': {
      marginRight: theme.spacing.unit * 2,
    }
  },
  checkboxHelperText: {
    marginTop: -theme.spacing.unit,
  },
} );

interface State
{
  initialized: boolean;
}

class OptionsPage extends React.Component<WithStyles<typeof styles>, State>
{
  public readonly state: State = {
    initialized: false
  };

  public componentDidMount()
  {
    settings.initialize()
      .then( () => this.setState( { initialized: true } ) );
  }

  public render()
  {
    const { classes } = this.props;
    const { initialized } = this.state;

    if( !initialized )
    {
      return null;
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Easy Control Options
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.appbarSpacer} />

        <Paper className={classes.paper}>

          <div className={classNames( classes.group, classes.buttons )}>
            <Button
              className={classes.button}
              variant="contained"
              color="default"
              onClick={this.onOpenKeyboardShortcutsClick}
            >
              Set Keyboard Shortcuts
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="default"
              href="https://github.com/anickle060193/easy_control/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Suggest Feature/Report Issue
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="default"
              href="./changelog.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Change Log
            </Button>
          </div>

          <div className={classes.group}>
            <Typography variant="h6">Focused Content Controls</Typography>

            <CheckboxSetting
              label="Display content controls overlay?"
              setting={SettingKey.Controls.Other.DisplayControls}
            />
            <CheckboxSetting
              label="Always display playback speed overlay?"
              setting={SettingKey.Controls.Other.AlwaysDisplayPlaybackSpeed}
            />
            <CheckboxSetting
              label="Hide controls when mouse goes idle?"
              setting={SettingKey.Controls.Other.HideControlsWhenIdle}
            />
            <NumberSetting
              label="Mouse idle timeout"
              setting={SettingKey.Controls.Other.HideControlsIdleTime}
              endAdornmentText="seconds"
            />
          </div>

          <div className={classes.group}>
            <Typography variant="h6">Generic Media Controls</Typography>

            <GenericMediaControlsSettings />
          </div>

          <div className={classes.group}>
            <Typography variant="h6">Other Generic Media Control Settings</Typography>

            <NumberSetting
              label="Default Playback Speed"
              setting={SettingKey.Controls.Other.DefaultPlaybackSpeed}
              step={0.1}
              min={0}
            />
            <NumberSetting
              label="Media overlay Skip Backward Amount"
              endAdornmentText="seconds"
              setting={SettingKey.Controls.Other.SkipBackwardAmount}
              min={0}
            />
            <NumberSetting
              label="Media overlay Skip Forward Amount"
              endAdornmentText="seconds"
              setting={SettingKey.Controls.Other.SkipForwardAmount}
              min={0}
            />
          </div>

          <div className={classes.group}>
            <Typography variant="h6">Controller Settings</Typography>

            <ControllerSettings />

            <br />

            <CheckboxSetting
              label="Don't show notifications if content window is active?"
              setting={SettingKey.Other.NoActiveWindowNotifications}
            />
          </div>

          <div className={classes.group}>
            <Typography variant="h6">Other Settings</Typography>

            <SelectSetting
              label="Default streaming site"
              setting={SettingKey.Other.DefaultSite}
              options={[
                { value: Sites.Pandora, label: 'Pandora' },
                { value: Sites.Spotify, label: 'Spotify' },
                { value: Sites.Youtube, label: 'Youtube' },
                { value: Sites.GooglePlayMusic, label: 'Google Play Music' },
                { value: Sites.Bandcamp, label: 'Bandcamp' },
                { value: Sites.Netflix, label: 'Netflix' },
                { value: Sites.AmazonVideo, label: 'Amazon Video' },
                { value: Sites.AmazonMusic, label: 'Amazon Music' },
                { value: Sites.Hulu, label: 'Hulu' },
                { value: Sites.Twitch, label: 'Twitch' },
              ]}
            />
            <CheckboxSetting
              label="Pause content when computer is locked?"
              setting={SettingKey.Other.PauseOnLock}
            />
            <CheckboxSetting
              label="Pause content after inactivity timeout?"
              setting={SettingKey.Other.PauseOnInactivity}
            />
            <NumberSetting
              label="Inactivity timeout"
              setting={SettingKey.Other.InactivityTimeout}
              endAdornmentText="seconds"
              helperText="Must be >= 15 seconds"
            />
            <CheckboxSetting
              label="Show notification when content is auto-paused?"
              setting={SettingKey.Other.ShowAutoPausedNotification}
            />
            <Typography variant="caption" className={classes.checkboxHelperText}>
              (Shows prompt to allow disabling auto-pause for the content's tab.)
            </Typography>

            <TextSetting
              setting={SettingKey.Other.SiteBlacklist}
              label="Generic controller URL blacklist"
              helpText="One URL per line"
              splitLines={true}
            />

            <CheckboxSetting
              label="Show change log on update?"
              setting={SettingKey.Other.ShowChangeLogOnUpdate}
            />
          </div>

          <div className={classes.group}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.onResetToDefaultsClick}
            >
              Reset to Defaults
            </Button>
          </div>

        </Paper>

      </div>
    );
  }

  private onOpenKeyboardShortcutsClick = () =>
  {
    chrome.tabs.create( {
      url: 'chrome://extensions/shortcuts',
      selected: true
    } );
  }

  private onResetToDefaultsClick = () =>
  {
    settings.reset();
  }
}

export default withStyles( styles )( OptionsPage );
