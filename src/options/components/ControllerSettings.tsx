import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';

import CheckboxSetting from 'options/components/CheckboxSetting';
import ColorSetting from 'options/components/ColorSetting';

import { SettingKey } from 'common/settings';

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
  enabledSetting: SettingKey.ControllersEnabled;
  notificationsSetting: SettingKey.Notifications;
  openInExistingSetting: SettingKey.OpenInExisting;
  colorSetting: SettingKey.ControllerColors;
  description: string;
  disallowOpenNewContentInExistingTabs?: boolean;
}

const CONTROLLER_SETTINGS: ControllerSetting[] = [
  {
    enabledSetting: SettingKey.ControllersEnabled.AmazonMusic,
    notificationsSetting: SettingKey.Notifications.AmazonMusic,
    openInExistingSetting: SettingKey.OpenInExisting.AmazonMusic,
    colorSetting: SettingKey.ControllerColors.AmazonMusic,
    description: 'Amazon Music',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.AmazonVideo,
    notificationsSetting: SettingKey.Notifications.AmazonVideo,
    openInExistingSetting: SettingKey.OpenInExisting.AmazonVideo,
    colorSetting: SettingKey.ControllerColors.AmazonVideo,
    description: 'Amazon Video',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Bandcamp,
    notificationsSetting: SettingKey.Notifications.Bandcamp,
    openInExistingSetting: SettingKey.OpenInExisting.Bandcamp,
    colorSetting: SettingKey.ControllerColors.Bandcamp,
    description: 'Bandcamp',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.GooglePlayMusic,
    notificationsSetting: SettingKey.Notifications.GooglePlayMusic,
    openInExistingSetting: SettingKey.OpenInExisting.GooglePlayMusic,
    colorSetting: SettingKey.ControllerColors.GooglePlayMusic,
    description: 'Google Play Music',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.HboGo,
    notificationsSetting: SettingKey.Notifications.HboGo,
    openInExistingSetting: SettingKey.OpenInExisting.HboGo,
    colorSetting: SettingKey.ControllerColors.HboGo,
    description: 'HBO Go',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Hulu,
    notificationsSetting: SettingKey.Notifications.Hulu,
    openInExistingSetting: SettingKey.OpenInExisting.Hulu,
    colorSetting: SettingKey.ControllerColors.Hulu,
    description: 'Hulu',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Netflix,
    notificationsSetting: SettingKey.Notifications.Netflix,
    openInExistingSetting: SettingKey.OpenInExisting.Netflix,
    colorSetting: SettingKey.ControllerColors.Netflix,
    description: 'Netflix',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Pandora,
    notificationsSetting: SettingKey.Notifications.Pandora,
    openInExistingSetting: SettingKey.OpenInExisting.Pandora,
    colorSetting: SettingKey.ControllerColors.Pandora,
    description: 'Pandora',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Spotify,
    notificationsSetting: SettingKey.Notifications.Spotify,
    openInExistingSetting: SettingKey.OpenInExisting.Spotify,
    colorSetting: SettingKey.ControllerColors.Spotify,
    description: 'Spotify',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Twitch,
    notificationsSetting: SettingKey.Notifications.Twitch,
    openInExistingSetting: SettingKey.OpenInExisting.Twitch,
    colorSetting: SettingKey.ControllerColors.Twitch,
    description: 'Twitch',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.Youtube,
    notificationsSetting: SettingKey.Notifications.Youtube,
    openInExistingSetting: SettingKey.OpenInExisting.Youtube,
    colorSetting: SettingKey.ControllerColors.Youtube,
    description: 'Youtube',
  },
  {
    enabledSetting: SettingKey.ControllersEnabled.GenericAudioVideo,
    notificationsSetting: SettingKey.Notifications.GenericAudioVideo,
    openInExistingSetting: SettingKey.OpenInExisting.GenericAudioVideo,
    colorSetting: SettingKey.ControllerColors.GenericAudioVideo,
    description: 'Generic Audio/Video',
    disallowOpenNewContentInExistingTabs: true,
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
            {CONTROLLER_SETTINGS.map( ( { description, enabledSetting, notificationsSetting, openInExistingSetting, colorSetting, disallowOpenNewContentInExistingTabs }, i ) => (
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
                  {!disallowOpenNewContentInExistingTabs && (
                    <CheckboxSetting setting={openInExistingSetting} />
                  )}
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
