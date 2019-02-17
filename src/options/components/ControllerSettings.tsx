import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import CheckboxSetting from 'options/components/CheckboxSetting';
import ColorSetting from 'options/components/ColorSetting';

import { Settings } from 'common/settings';

const styles = ( theme: Theme ) => createStyles( {
  fixedWidthCell: {
    width: theme.spacing.unit * 8,
    'th&': {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    }
  }
} );

interface ControllerSetting
{
  enabledSetting: Settings.ControllersEnabled;
  notificationsSetting: Settings.Notifications;
  openInExistingSetting: Settings.OpenInExisting;
  colorSetting: Settings.ControllerColors;
  description: string;
}

const CONTROLLER_SETTINGS: ControllerSetting[] = [
  {
    enabledSetting: Settings.ControllersEnabled.Pandora,
    notificationsSetting: Settings.Notifications.Pandora,
    openInExistingSetting: Settings.OpenInExisting.Pandora,
    colorSetting: Settings.ControllerColors.Pandora,
    description: 'Pandora',
  },
  {
    enabledSetting: Settings.ControllersEnabled.Spotify,
    notificationsSetting: Settings.Notifications.Spotify,
    openInExistingSetting: Settings.OpenInExisting.Spotify,
    colorSetting: Settings.ControllerColors.Spotify,
    description: 'Spotify',
  },
  {
    enabledSetting: Settings.ControllersEnabled.Youtube,
    notificationsSetting: Settings.Notifications.Youtube,
    openInExistingSetting: Settings.OpenInExisting.Youtube,
    colorSetting: Settings.ControllerColors.Youtube,
    description: 'Youtube',
  },
  {
    enabledSetting: Settings.ControllersEnabled.GooglePlayMusic,
    notificationsSetting: Settings.Notifications.GooglePlayMusic,
    openInExistingSetting: Settings.OpenInExisting.GooglePlayMusic,
    colorSetting: Settings.ControllerColors.GooglePlayMusic,
    description: 'Google Play Music',
  },
  {
    enabledSetting: Settings.ControllersEnabled.Bandcamp,
    notificationsSetting: Settings.Notifications.Bandcamp,
    openInExistingSetting: Settings.OpenInExisting.Bandcamp,
    colorSetting: Settings.ControllerColors.Bandcamp,
    description: 'Bandcamp',
  },
  {
    enabledSetting: Settings.ControllersEnabled.Netflix,
    notificationsSetting: Settings.Notifications.Netflix,
    openInExistingSetting: Settings.OpenInExisting.Netflix,
    colorSetting: Settings.ControllerColors.Netflix,
    description: 'Netflix',
  },
  {
    enabledSetting: Settings.ControllersEnabled.AmazonVideo,
    notificationsSetting: Settings.Notifications.AmazonVideo,
    openInExistingSetting: Settings.OpenInExisting.AmazonVideo,
    colorSetting: Settings.ControllerColors.AmazonVideo,
    description: 'Amazon Video',
  },
  {
    enabledSetting: Settings.ControllersEnabled.AmazonMusic,
    notificationsSetting: Settings.Notifications.AmazonMusic,
    openInExistingSetting: Settings.OpenInExisting.AmazonMusic,
    colorSetting: Settings.ControllerColors.AmazonMusic,
    description: 'Amazon Music',
  },
  {
    enabledSetting: Settings.ControllersEnabled.Hulu,
    notificationsSetting: Settings.Notifications.Hulu,
    openInExistingSetting: Settings.OpenInExisting.Hulu,
    colorSetting: Settings.ControllerColors.Hulu,
    description: 'Hulu',
  },
  {
    enabledSetting: Settings.ControllersEnabled.GenericAudioVideo,
    notificationsSetting: Settings.Notifications.GenericAudioVideo,
    openInExistingSetting: Settings.OpenInExisting.GenericAudioVideo,
    colorSetting: Settings.ControllerColors.GenericAudioVideo,
    description: 'Generic Audio/Video',
  },
  {
    enabledSetting: Settings.ControllersEnabled.Twitch,
    notificationsSetting: Settings.Notifications.Twitch,
    openInExistingSetting: Settings.OpenInExisting.Twitch,
    colorSetting: Settings.ControllerColors.Twitch,
    description: 'Twitch',
  },
];

class ControllerSettings extends React.Component<WithStyles<typeof styles>>
{
  public render()
  {
    const { classes } = this.props;

    return (
      <>
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>Website</TableCell>
              <TableCell align="center" className={classes.fixedWidthCell}>Enabled?</TableCell>
              <TableCell align="center" className={classes.fixedWidthCell}>Display Notifications?</TableCell>
              <TableCell align="center" className={classes.fixedWidthCell}>Open new content in existing tabs?</TableCell>
              <TableCell align="center" className={classes.fixedWidthCell}>Color</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CONTROLLER_SETTINGS.map( ( { description, enabledSetting, notificationsSetting, openInExistingSetting, colorSetting }, i ) => (
              <TableRow key={i} hover={true}>
                <TableCell>
                  {description}
                </TableCell>
                <TableCell align="center">
                  <CheckboxSetting setting={enabledSetting} />
                </TableCell>
                <TableCell align="center">
                  <CheckboxSetting setting={notificationsSetting} />
                </TableCell>
                <TableCell align="center">
                  <CheckboxSetting setting={openInExistingSetting} />
                </TableCell>
                <TableCell align="center">
                  <ColorSetting setting={colorSetting} />
                </TableCell>
              </TableRow>
            ) )}
          </TableBody>
        </Table>
      </>
    );
  }
}

export default withStyles( styles )( ControllerSettings );
